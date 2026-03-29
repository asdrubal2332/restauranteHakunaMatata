<?php
require 'bd.php';

// Obtener todos los usuarios
$stmt = $conexionBd->query("SELECT * FROM gestusuarios ORDER BY fecha_creacion DESC");
$usuarios = $stmt->fetch_all(MYSQLI_ASSOC);


// Función para obtener iniciales
function getInitials($nombre) {
    $palabras = explode(' ', $nombre);
    $iniciales = '';
    foreach (array_slice($palabras, 0, 2) as $palabra) {
        $iniciales .= strtoupper($palabra[0]);
    }
    return $iniciales;
}
?>

<!DOCTYPE html>
<html class="dark" lang="es">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Gestión de Usuarios - Hakuna Matata</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <style>
        .status-active {
            background-color: rgba(120, 220, 119, 0.1);
            color: #78dc77;
        }
        .status-inactive {
            background-color: rgba(255, 180, 171, 0.1);
            color: #ffb4ab;
        }
        .avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            border-radius: 12px;
            font-weight: bold;
            font-size: 14px;
            background-color: #2a2a2a;
        }
    </style>
</head>
<body class="bg-surface text-on-surface font-body">

<main class="pt-24 pb-32 px-6 md:pl-80 md:pr-10">
    <div class="max-w-7xl mx-auto">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div class="space-y-2">
                <h1 class="text-4xl font-headline font-extrabold tracking-tight text-on-surface">Administración de Usuarios</h1>
                <p class="text-on-surface-variant font-body">Gestiona el personal, roles y permisos de acceso al sistema.</p>
            </div>
            <a href="agregar_usuario.php" class="bg-gradient-to-tr from-[#FFB77A] to-[#FD8E00] text-[#131313] px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform inline-flex items-center gap-2">
                <span class="material-symbols-outlined">add</span>
                Nuevo Usuario
            </a>
        </div>

        <!-- Tabla de Usuarios -->
        <div class="bg-surface-container rounded-2xl overflow-hidden shadow-2xl">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-surface-container-high/50 text-on-surface-variant text-xs uppercase tracking-widest font-bold">
                            <th class="px-8 py-5">Usuario</th>
                            <th class="px-6 py-5">Rol</th>
                            <th class="px-6 py-5">Estado</th>
                            <th class="px-6 py-5 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-outline-variant/10">
                        <?php foreach ($usuarios as $usuario): ?>
                        <tr class="hover:bg-surface-bright/20 transition-colors">
                            <td class="px-8 py-5">
                                <div class="flex items-center gap-4">
                                    <div class="avatar" style="background-color: #2a2a2a; color: #FFB77A;">
                                        <?php echo getInitials($usuario['nombre_completo']); ?>
                                    </div>
                                    <div>
                                        <div class="font-bold text-on-surface text-base"><?php echo htmlspecialchars($usuario['nombre_completo']); ?></div>
                                        <div class="text-sm text-on-surface-variant"><?php echo htmlspecialchars($usuario['email']); ?></div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-5">
                                <span class="px-3 py-1 bg-surface-container-highest text-on-surface-variant rounded-full text-xs font-bold border border-outline-variant/20">
                                    <?php echo htmlspecialchars($usuario['rol']); ?>
                                </span>
                            </td>
                            <td class="px-6 py-5">
                                <div class="flex items-center gap-2">
                                    <div class="w-2 h-2 rounded-full" style="background-color: <?php echo ($usuario['estado'] === 'ACTIVO') ? '#78dc77' : '#ffb4ab'; ?>;"></div>
                                    <span class="text-sm font-medium" style="color: <?php echo ($usuario['estado'] === 'ACTIVO') ? '#78dc77' : '#ffb4ab'; ?>;">
                                        <?php echo ($usuario['estado'] === 'ACTIVO') ? 'Active' : 'Inactive'; ?>
                                    </span>
                                </div>
                            </td>
                            <td class="px-6 py-5 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <!-- Botón Editar -->
                                    <a href="editar_usuario.php?id=<?php echo $usuario['id']; ?>" class="p-2 hover:bg-surface-container-highest rounded-lg transition-colors text-on-surface-variant hover:text-primary" title="Editar usuario">
                                        <span class="material-symbols-outlined">edit</span>
                                    </a>
                                    <!-- Botón Eliminar -->
                                    <form method="POST" action="eliminar_usuario.php" style="display: inline;" onsubmit="return confirm('¿Estás seguro de que deseas eliminar este usuario?');">
                                        <input type="hidden" name="id" value="<?php echo $usuario['id']; ?>">
                                        <button type="submit" class="p-2 hover:bg-error/10 rounded-lg transition-colors text-on-surface-variant hover:text-error" title="Eliminar usuario">
                                            <span class="material-symbols-outlined">person_off</span>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</main>

</body>
</html>