<?php
require 'bd.php';

// Contar stats
$total_result = mysqli_query($conexionBd, "SELECT COUNT(*) as total FROM usuarios");
$total = mysqli_fetch_assoc($total_result)['total'];

$activos_result = mysqli_query($conexionBd, "SELECT COUNT(*) as activos FROM usuarios WHERE activo = 1");
$activos = mysqli_fetch_assoc($activos_result)['activos'];

// Query usuarios
$usuarios_query = mysqli_query($conexionBd, "
    SELECT u.*, r.nombre_rol 
    FROM usuarios u 
    LEFT JOIN roles r ON u.id_rol = r.id_rol 
    ORDER BY u.fecha_creacion DESC
");

$usuarios = [];
while ($row = mysqli_fetch_assoc($usuarios_query)) {
  $usuarios[] = $row;
}

function getInitials($nombre)
{
  $palabras = explode(' ', trim($nombre));
  $iniciales = '';
  foreach (array_slice($palabras, 0, 2) as $palabra) {
    if (isset($palabra[0])) {
      $iniciales .= strtoupper($palabra[0]);
    }
  }
  return $iniciales ?: 'US';
}

// Msg delete?
$mensaje = $_GET['mensaje'] ?? '';
?>
<!DOCTYPE html>
<html class="dark" lang="es">

<head>
  <meta charset="utf-8" />
  <meta content="width=device-width, initial-scale=1.0" name="viewport" />
  <link rel="stylesheet" href="style.css">
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <link
    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&#38;family=Inter:wght@400;500;600&#38;display=swap"
    rel="stylesheet" />
  <link
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&#38;display=swap"
    rel="stylesheet" />
  <script id="tailwind-config">
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "inverse-surface": "#e5e2e1",
            "outline": "#a48c7a",
            "on-surface-variant": "#ddc1ae",
            "primary-container": "#fd8e00",
            "on-error": "#690005",
            "secondary": "#78dc77",
            "on-primary-fixed": "#2e1500",
            "secondary-fixed-dim": "#78dc77",
            "inverse-primary": "#8f4e00",
            "surface-container-lowest": "#0e0e0e",
            "surface": "#131313",
            "on-primary-fixed-variant": "#6d3a00",
            "on-primary-container": "#613300",
            "surface-container": "#201f1f",
            "secondary-fixed": "#94f990",
            "primary-fixed-dim": "#ffb77a",
            "tertiary-container": "#d7a200",
            "surface-container-low": "#1c1b1b",
            "surface-dim": "#131313",
            "surface-tint": "#ffb77a",
            "on-tertiary-fixed": "#261a00",
            "on-error-container": "#ffdad6",
            "on-secondary": "#00390a",
            "on-background": "#e5e2e1",
            "secondary-container": "#00761f",
            "surface-container-highest": "#353534",
            "on-secondary-fixed": "#002204",
            "on-secondary-container": "#95fb92",
            "surface-bright": "#393939",
            "inverse-on-surface": "#313030",
            "on-tertiary-container": "#513b00",
            "on-secondary-fixed-variant": "#005313",
            "surface-container-high": "#2a2a2a",
            "primary": "#ffb77a",
            "on-primary": "#4c2700",
            "error-container": "#93000a",
            "primary-fixed": "#ffdcc2",
            "error": "#ffb4ab",
            "outline-variant": "#564334",
            "background": "#131313",
            "tertiary-fixed-dim": "#fabd00",
            "tertiary": "#fabd00",
            "on-tertiary-fixed-variant": "#5b4300",
            "on-surface": "#e5e2e1",
            "tertiary-fixed": "#ffdf9e",
            "surface-variant": "#353534",
            "on-tertiary": "#3f2e00"
          },
          fontFamily: {
            "headline": ["Plus Jakarta Sans"],
            "body": ["Inter"],
            "label": ["Inter"]
          },
          borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
        },
      },
    }
  </script>
  <style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
</head>

<body class="bg-surface text-on-surface font-body selection:bg-primary-container/30">
  <!-- TopAppBar (copied from current) -->
  <header
    class="bg-[#131313] text-[#FF8C00] font-['Plus_Jakarta_Sans'] font-bold tracking-tight docked full-width top-0 fixed w-full z-50">
    <div class="flex justify-between items-center w-full px-10 h-20">
      <div class="flex items-center gap-4">
        <button class="hover:bg-[#393939] transition-colors p-2 rounded-full active:scale-95 duration-200">
          <span class="material-symbols-outlined text-2xl">menu</span>
        </button>
        <span class="text-xl font-black text-[#FF8C00] tracking-widest">HAKUNA MATATA</span>
      </div>
      <div class="flex items-center gap-6">
        <div class="hidden md:flex gap-8 text-[#E5E2E1] font-medium">
          <span class="hover:bg-[#393939] px-4 py-2 rounded-xl transition-colors cursor-pointer"
            onclick="location.href='gestion_mesas.html'">Distribución de Mesas</span>
          <span class="hover:bg-[#393939] px-4 py-2 rounded-xl transition-colors cursor-pointer"
            onclick="location.href='toma_pedidos.html'">Pedidos</span>
          <span class="text-[#FF8C00] px-4 py-2 rounded-xl transition-colors cursor-pointer">Gestión de Personal</span>
          <span class="hover:bg-[#393939] px-4 py-2 rounded-xl transition-colors cursor-pointer"
            onclick="location.href='facturacion.html'">Configuración</span>
        </div>
        <div class="w-10 h-10 rounded-full bg-surface-container-high border-2 border-[#FF8C00] overflow-hidden">
          <img alt="Staff Profile" class="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuASusyeQuT060vmsoxSp0DxAxD4-Bt-KwTII6a0E7CnTTuLO61BIwMzH-P5uAWyVULjGjtQRXlc2HBGNeI10RBBkRH_u98l83BA3xIhNC0gp8FINt9xcY30ZFNzSqA7tC7YbXjKh_spczGPCLTz1q8c64qPighczj3rQBvLZ8pQxGwzFDa0ZEqu4w0zGjYZ8lo_qVsxZOvcTI6wpHgL2FvOSxNPyOgtQ17H48t3diik9Kz4HdAcUeytk3JtBXaCOJQ0hAbMEH-0d6g" />
        </div>
      </div>
    </div>
  </header>
  <!-- Sidebar same as current -->
  <aside
    class="hidden md:flex fixed left-0 top-0 h-full z-40 p-6 flex-col bg-[#1C1B1B] font-['Plus_Jakarta_Sans'] font-medium h-full w-72 rounded-r-2xl shadow-[12px_0_32px_rgba(0,0,0,0.5)]">
    <div class="text-2xl font-black text-[#FF8C00] mb-8">HAKUNA MATATA</div>
    <nav class="space-y-2">
      <a class="flex items-center gap-4 px-4 py-3 text-[#DDC1AE] hover:bg-[#201F1F] rounded-xl hover:translate-x-1 transition-transform active:scale-[0.98]"
        href="gestion_mesas.html">
        <span class="material-symbols-outlined">grid_view</span><span>Distribución de Mesas</span>
      </a>
      <a class="flex items-center gap-4 px-4 py-3 text-[#DDC1AE] hover:bg-[#201F1F] rounded-xl hover:translate-x-1 transition-transform active:scale-[0.98]"
        href="toma_pedidos.html">
        <span class="material-symbols-outlined">receipt_long</span><span>Pedidos</span>
      </a>
      <a class="flex items-center gap-4 px-4 py-3 bg-gradient-to-r from-[#FFB77A] to-[#FF8C00] text-[#131313] rounded-xl font-bold active:scale-[0.98]"
        href="#">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">badge</span><span>Gestión de
          Personal</span>
      </a>
      <a class="flex items-center gap-4 px-4 py-3 text-[#DDC1AE] hover:bg-[#201F1F] rounded-xl hover:translate-x-1 transition-transform active:scale-[0.98]"
        href="facturacion.html">
        <span class="material-symbols-outlined">settings</span><span>Configuración</span>
      </a>
    </nav>
  </aside>
  <main class="pt-24 pb-32 px-6 md:pl-80 md:pr-10 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <?php if ($mensaje): ?>
        <div class="bg-error/20 text-error p-4 rounded-lg mb-6 border border-error/20">
          <?php echo htmlspecialchars($mensaje); ?></div>
      <?php endif; ?>
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div class="space-y-2">
          <h1 class="text-4xl font-headline font-extrabold tracking-tight text-on-surface">Administración de Usuarios
          </h1>
          <p class="text-on-surface-variant font-body">Gestiona el personal, roles y permisos del sistema.</p>
        </div>
        <div class="flex items-center gap-3 bg-surface-container-low p-2 rounded-xl">
          <div
            class="px-4 py-2 bg-surface-container-high rounded-lg text-sm font-medium border border-outline-variant/20">
            Total: <?php echo $total; ?>
          </div>
          <div class="px-4 py-2 bg-secondary/10 text-secondary rounded-lg text-sm font-medium">
            Activos: <?php echo $activos; ?>
          </div>
        </div>
      </div>
      <!-- Bento Grid (static for now) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="bg-surface-container-low p-6 rounded-xl border-l-4 border-primary">
          <span class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Último Acceso</span>
          <p class="text-xl font-bold mt-1 text-on-surface">Admin - Hace 2min</p>
        </div>
        <div class="bg-surface-container-low p-6 rounded-xl border-l-4 border-secondary">
          <span class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Roles Activos</span>
          <p class="text-xl font-bold mt-1 text-on-surface">Mesero (12)</p>
        </div>
        <div class="bg-surface-container-low p-6 rounded-xl border-l-4 border-tertiary">
          <span class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Turno Actual</span>
          <p class="text-xl font-bold mt-1 text-on-surface">Vespertino</p>
        </div>
      </div>
      <!-- Dynamic Table -->
      <div class="bg-surface-container rounded-2xl overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="bg-surface-container-high/50 text-on-surface-variant text-xs uppercase tracking-widest font-bold">
                <th class="px-8 py-5">Usuario</th>
                <th class="px-6 py-5">Rol</th>
                <th class="px-6 py-5">Estado</th>
                <th class="px-6 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/10">
              <?php if (empty($usuarios)): ?>
                <tr>
                  <td colspan="4" class="px-8 py-12 text-center text-on-surface-variant italic">No hay usuarios
                    registrados.</td>
                </tr>
              <?php else: ?>
                <?php foreach ($usuarios as $user): ?>
                  <tr class="hover:bg-surface-bright/20 transition-colors">
                    <td class="px-8 py-5">
                      <div class="flex items-center gap-4">
                        <div
                          class="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center font-bold text-primary bg-gradient-to-br from-primary to-primary-container text-on-primary">
                          <?php echo getInitials($user['nombre']); ?>
                        </div>
                        <div>
                          <div class="font-bold text-on-surface text-base"><?php echo htmlspecialchars($user['nombre']); ?>
                          </div>
                          <?php if ($user['telefono']): ?>
                            <div class="text-sm text-on-surface-variant"><?php echo htmlspecialchars($user['email']); ?> •
                              <?php echo htmlspecialchars($user['telefono']); ?></div>
                          <?php else: ?>
                            <div class="text-sm text-on-surface-variant"><?php echo htmlspecialchars($user['email']); ?></div>
                          <?php endif; ?>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-5">
                      <span
                        class="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold border border-primary/20 uppercase">
                        <?php echo htmlspecialchars($user['nombre_rol'] ?? 'Sin asignar'); ?>
                      </span>
                    </td>
                    <td class="px-6 py-5">
                      <div class="flex items-center gap-2">
                        <div
                          class="w-2 h-2 rounded-full <?php echo $user['activo'] ? 'bg-secondary animate-pulse' : 'bg-outline'; ?>">
                        </div>
                        <span
                          class="text-sm font-medium <?php echo $user['activo'] ? 'text-on-surface' : 'text-on-surface-variant'; ?>">
                          <?php echo $user['activo'] ? 'Activo' : 'Inactivo'; ?>
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-5 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <a href="editar_usuario.php?id_usuario=<?php echo (int) $user['id_usuario']; ?>" title="Editar"
                          class="p-2 hover:bg-surface-container-highest rounded-lg transition-all text-on-surface-variant hover:text-primary hover:shadow-md">
                          <span class="material-symbols-outlined text-lg">edit</span>
                        </a>
                        <form method="POST" action="eliminar.php" class="inline"
                          onsubmit="return confirm('¿Eliminar permanentemente a <?php echo addslashes($user['nombre']); ?>?');">
                          <input type="hidden" name="id_usuario" value="<?php echo (int) $user['id_usuario']; ?>">
                          <button type="submit" title="Eliminar"
                            class="p-2 hover:bg-error/10 rounded-lg transition-all text-on-surface-variant hover:text-error hover:shadow-md">
                            <span class="material-symbols-outlined text-lg">person_off</span>
                          </button>
                        </form>
                        <a href="javascript:void(0)"
                          onclick="navigator.clipboard.writeText('<?php echo addslashes($user['email']); ?>')"
                          title="Copiar email"
                          class="p-2 hover:bg-secondary/10 rounded-lg transition-all text-on-surface-variant hover:text-secondary">
                          <span class="material-symbols-outlined text-lg">content_copy</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                <?php endforeach; ?>
              <?php endif; ?>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
  <!-- FAB -->
  <button
    class="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-16 h-16 bg-gradient-to-br from-[#FFB77A] to-[#FD8E00] text-[#131313] rounded-2xl shadow-[0_12px_32px_rgba(253,142,0,0.4)] flex items-center justify-center active:scale-90 transition-transform z-[60]"
    onclick="window.location.href='agregar_usuario.php'" title="Nuevo Usuario">
    <span class="material-symbols-outlined text-3xl font-bold">add</span>
  </button>
  <!-- BottomNavBar same -->
  <nav
    class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-6 pb-4 bg-[#131313]/90 backdrop-blur-xl rounded-t-[1.5rem] shadow-[0_-8px_24px_rgba(0,0,0,0.3)] md:hidden">
    ... same as current ...
  </nav>
</body>

</html>