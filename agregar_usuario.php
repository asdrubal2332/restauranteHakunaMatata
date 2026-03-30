<?php
require 'bd.php';

$mensaje = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = trim($_POST['nombre'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $telefono = trim($_POST['telefono'] ?? '');
    $password = $_POST['password'] ?? '';
    $id_rol = (int)($_POST['id_rol'] ?? 0);
    $activo = isset($_POST['activo']) ? 1 : 0;

    if ($nombre && $email && $password && $id_rol) {
        $contrasena_hash = md5($password);
        $stmt = mysqli_prepare($conexionBd, "INSERT INTO usuarios (nombre, email, telefono, contrasena_hash, id_rol, activo) VALUES (?, ?, ?, ?, ?, ?)");
        mysqli_stmt_bind_param($stmt, 'ssssii', $nombre, $email, $telefono, $contrasena_hash, $id_rol, $activo);
        if (mysqli_stmt_execute($stmt)) {
            $mensaje = '<div class="bg-secondary/20 text-secondary p-4 rounded-lg mb-6">✓ Usuario agregado exitosamente</div>';
        } else {
            $mensaje = '<div class="bg-error/20 text-error p-4 rounded-lg mb-6">✗ Error al agregar usuario</div>';
        }
    } else {
        $mensaje = '<div class="bg-error/20 text-error p-4 rounded-lg mb-6">✗ Todos los campos obligatorios</div>';
    }
}
// Obtener roles
$roles_result = mysqli_query($conexionBd, "SELECT id_rol, nombre_rol FROM roles ORDER BY nombre_rol");
$roles = [];
while ($row = mysqli_fetch_assoc($roles_result)) {
    $roles[] = $row;
}
?>
<!DOCTYPE html>
<html class="dark" lang="es">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <title>Agregar Usuario</title>
    <style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
</head>
<body class="bg-[#131313] text-[#FD8E00] font-body min-h-screen">
<header class="bg-[#131313] dark:bg-[#131313] shadow-[0_12px_32px_rgba(0,0,0,0.5)] docked full-width top-0 sticky z-50">
    <div class="flex justify-between items-center w-full px-10 py-6 max-w-full">
        <div class="flex items-center gap-4">
            <span class="material-symbols-outlined text-[#FFB77A] text-3xl" data-icon="restaurant">restaurant</span>
            <h1 class="text-[#E5E2E1] font-black italic font-['Plus_Jakarta_Sans'] text-2xl font-bold tracking-tight">Hakuna Matata</h1>
        </div>
        <a href="gestusuarios.php" class="bg-gradient-to-tr from-[#FFB77A] to-[#FD8E00] text-[#131313] px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform inline-flex items-center gap-2">
            <span class="material-symbols-outlined">arrow_back</span>
            Volver
        </a>
    </div>
</header>
<main class="pt-24 pb-32 px-6 md:pl-80 md:pr-10 min-h-screen">
    <div class="max-w-xl mx-auto bg-[#1c1b1b] rounded-2xl shadow-2xl p-10 mt-10">
        <h2 class="text-3xl font-headline font-bold mb-8 text-center text-[#FD8E00]">Agregar Usuario</h2>
        <?php if ($mensaje) echo $mensaje; ?>
        <form method="POST" class="space-y-6">
            <div>
                <label class="block mb-1 font-bold text-[#FD8E00]" for="nombre">Nombre completo</label>
                <input class="w-full px-4 py-3 rounded-xl bg-[#131313] text-[#FD8E00] placeholder:text-[#FD8E00] border border-[#FD8E00] focus:ring-2 focus:ring-[#FD8E00] transition-all duration-200" type="text" name="nombre" id="nombre" required placeholder="Nombre completo">
            </div>
            <div>
                <label class="block mb-1 font-bold text-[#FD8E00]" for="email">Email</label>
                <input class="w-full px-4 py-3 rounded-xl bg-[#131313] text-[#FD8E00] placeholder:text-[#FD8E00] border border-[#FD8E00] focus:ring-2 focus:ring-[#FD8E00] transition-all duration-200" type="email" name="email" id="email" required placeholder="Correo electrónico">
            </div>
            <div>
                <label class="block mb-1 font-bold text-[#FD8E00]" for="telefono">Teléfono</label>
                <input class="w-full px-4 py-3 rounded-xl bg-[#131313] text-[#FD8E00] placeholder:text-[#FD8E00] border border-[#FD8E00] focus:ring-2 focus:ring-[#FD8E00] transition-all duration-200" type="text" name="telefono" id="telefono" placeholder="Teléfono">
            </div>
            <div>
                <label class="block mb-1 font-bold text-[#FD8E00]" for="password">Contraseña</label>
                <input class="w-full px-4 py-3 rounded-xl bg-[#131313] text-[#FD8E00] placeholder:text-[#FD8E00] border border-[#FD8E00] focus:ring-2 focus:ring-[#FD8E00] transition-all duration-200" type="password" name="password" id="password" required placeholder="Contraseña">
            </div>
            <div>
                <label class="block mb-1 font-bold text-[#FD8E00]" for="id_rol">Rol</label>
                <select class="w-full px-4 py-3 rounded-xl bg-[#131313] text-[#FD8E00] border border-[#FD8E00] focus:ring-2 focus:ring-[#FD8E00] transition-all duration-200" name="id_rol" id="id_rol" required>
                    <option value="" class="text-[#131313]">Seleccione un rol</option>
                    <?php foreach ($roles as $rol): ?>
                        <option value="<?php echo $rol['id_rol']; ?>" class="text-white"><?php echo htmlspecialchars($rol['nombre_rol']); ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div>
                <label class="inline-flex items-center text-[#FD8E00]">
                    <input type="checkbox" name="activo" value="1" checked class="form-checkbox border-[#FD8E00] text-[#FD8E00] focus:ring-[#FD8E00]">
                    <span class="ml-2">Activo</span>
                </label>
            </div>
            <button class="w-full bg-gradient-to-tr from-[#FFB77A] to-[#FD8E00] text-[#131313] px-6 py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 text-lg" type="submit">
                <span class="material-symbols-outlined">person_add</span>
                Agregar Usuario
            </button>
        </form>
    </div>
</main>
</body>
</html>
