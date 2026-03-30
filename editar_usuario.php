<?php
require 'bd.php';

$id_usuario = $_GET['id_usuario'] ?? null;
if (!$id_usuario || !is_numeric($id_usuario)) {
    header('Location: gestusuarios.php');
    exit;
}

// Fetch user
$stmt = mysqli_prepare($conexionBd, "SELECT * FROM usuarios WHERE id_usuario = ?");
mysqli_stmt_bind_param($stmt, 'i', $id_usuario);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$usuario = mysqli_fetch_assoc($result);
if (!$usuario) {
    header('Location: gestusuarios.php');
    exit;
}

function getInitials($nombre) {
    $palabras = explode(' ', trim($nombre));
    $iniciales = '';
    foreach (array_slice($palabras, 0, 2) as $palabra) {
        if (isset($palabra[0])) {
            $iniciales .= strtoupper($palabra[0]);
        }
    }
    return $iniciales ?: 'US';
}

// Fetch roles
$roles_result = mysqli_query($conexionBd, "SELECT id_rol, nombre_rol FROM roles ORDER BY nombre_rol");

$roles = [];
while ($row = mysqli_fetch_assoc($roles_result)) {
    $roles[] = $row;
}

$mensaje = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = trim($_POST['nombre'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $telefono = trim($_POST['telefono'] ?? '');
    $id_rol = (int)($_POST['id_rol'] ?? 0);
    $activo = isset($_POST['activo']) ? 1 : 0;
    $password = trim($_POST['password'] ?? '');

    if (empty($nombre) || empty($email)) {
        $error = 'Nombre y email obligatorios.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Email inválido.';
    } elseif ($id_rol < 1) {
        $error = 'Selecciona un rol válido.';
    } else {
        if (!empty($password)) {
            $password_hash = md5($password);
            $update_stmt = mysqli_prepare($conexionBd, "UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, id_rol = ?, activo = ?, contrasena_hash = ? WHERE id_usuario = ?");
            mysqli_stmt_bind_param($update_stmt, 'sssissi', $nombre, $email, $telefono, $id_rol, $activo, $password_hash, $id_usuario);
        } else {
            $update_stmt = mysqli_prepare($conexionBd, "UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, id_rol = ?, activo = ? WHERE id_usuario = ?");
            mysqli_stmt_bind_param($update_stmt, 'sssisi', $nombre, $email, $telefono, $id_rol, $activo, $id_usuario);
        }

        if (mysqli_stmt_execute($update_stmt)) {
            $mensaje = 'Usuario actualizado correctamente.';
            // Refresh user
            mysqli_stmt_close($update_stmt);
            $refresh_stmt = mysqli_prepare($conexionBd, "SELECT * FROM usuarios WHERE id_usuario = ?");
            mysqli_stmt_bind_param($refresh_stmt, 'i', $id_usuario);
            mysqli_stmt_execute($refresh_stmt);
            $result = mysqli_stmt_get_result($refresh_stmt);
            $usuario = mysqli_fetch_assoc($result);
        } else {
            $error = 'Error al actualizar: ' . mysqli_error($conexionBd);
        }
    }
}
?>
<!DOCTYPE html>
<html class="dark" lang="es">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link rel="stylesheet" href="style.css">
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<script id="tailwind-config">
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "inverse-surface": "#e5e2e1","outline": "#a48c7a","on-surface-variant": "#ddc1ae","primary-container": "#fd8e00","on-error": "#690005","secondary": "#78dc77","on-primary-fixed": "#2e1500","secondary-fixed-dim": "#78dc77","inverse-primary": "#8f4e00","surface-container-lowest": "#0e0e0e","surface": "#131313","on-primary-fixed-variant": "#6d3a00","on-primary-container": "#613300","surface-container": "#201f1f","secondary-fixed": "#94f990","primary-fixed-dim": "#ffb77a","tertiary-container": "#d7a200","surface-container-low": "#1c1b1b","surface-dim": "#131313","surface-tint": "#ffb77a","on-tertiary-fixed": "#261a00","on-error-container": "#ffdad6","on-secondary": "#00390a","on-background": "#e5e2e1","secondary-container": "#00761f","surface-container-highest": "#353534","on-secondary-fixed": "#002204","on-secondary-container": "#95fb92","surface-bright": "#393939","inverse-on-surface": "#313030","on-tertiary-container": "#513b00","on-secondary-fixed-variant": "#005313","surface-container-high": "#2a2a2a","primary": "#ffb77a","on-primary": "#4c2700","error-container": "#93000a","primary-fixed": "#ffdcc2","error": "#ffb4ab","outline-variant": "#564334","background": "#131313","tertiary-fixed-dim": "#fabd00","tertiary": "#fabd00","on-tertiary-fixed-variant": "#5b4300","on-surface": "#e5e2e1","tertiary-fixed": "#ffdf9e","surface-variant": "#353534","on-tertiary": "#3f2e00"
            },
            fontFamily: {
                "headline": ["Plus Jakarta Sans"],
                "body": ["Inter"],
                "label": ["Inter"]
            },
            borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"}
        }
    }
}
</script>
<style>body { min-height: max(884px, 100dvh); }</style>
</head>
<body class="bg-surface text-on-surface font-body selection:bg-primary-container/30">
<!-- Header same as gestusuarios.php -->
<header class="bg-[#131313] text-[#FF8C00] font-headline font-bold tracking-tight fixed top-0 w-full z-50 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
<div class="flex justify-between items-center w-full px-10 h-20">
<div class="flex items-center gap-4">
<button class="hover:bg-[#393939] p-2 rounded-full active:scale-95 duration-200">
<span class="material-symbols-outlined text-2xl">menu</span>
</button>
<span class="text-xl font-black text-[#FF8C00] tracking-widest">HAKUNA MATATA</span>
</div>
<div class="flex items-center gap-6">
<div class="hidden md:flex gap-8 text-[#E5E2E1] font-medium">
<span class="hover:bg-[#393939] px-4 py-2 rounded-xl cursor-pointer" onclick="location.href='gestion_mesas.html'">Mesas</span>
<span class="hover:bg-[#393939] px-4 py-2 rounded-xl cursor-pointer" onclick="location.href='toma_pedidos.html'">Pedidos</span>
<span class="text-[#FF8C00] px-4 py-2 rounded-xl cursor-pointer">Personal</span>
<span class="hover:bg-[#393939] px-4 py-2 rounded-xl cursor-pointer" onclick="location.href='facturacion.html'">Config</span>
</div>
<div class="w-10 h-10 rounded-full bg-surface-container-high border-2 border-[#FF8C00] overflow-hidden">
<img alt="Profile" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASusyeQuT060vmsoxSp0DxAxD4-Bt-KwTII6a0E7CnTTuLO61BIwMzH-P5uAWyVULjGjtQRXlc2HBGNeI10RBBkRH_u98l83BA3xIhNC0gp8FINt9xcY30ZFNzSqA7tC7YbXjKh_spczGPCLTz1q8c64qPighczj3rQBvLZ8pQxGwzFDa0ZEqu4w0zGjYZ8lo_qVsxZOvcTI6wpHgL2FvOSxNPyOgtQ17H48t3diik9Kz4HdAcUeytk3JtBXaCOJQ0hAbMEH-0d6g"/>
</div>
</div>
</div>
</header>
<aside class="hidden md:flex fixed left-0 top-0 h-full z-40 p-6 flex-col bg-[#1C1B1B] font-headline font-medium h-full w-72 rounded-r-2xl shadow-[12px_0_32px_rgba(0,0,0,0.5)]">
<div class="text-2xl font-black text-[#FF8C00] mb-8">HAKUNA MATATA</div>
<nav class="space-y-2">
<a class="flex items-center gap-4 px-4 py-3 text-[#DDC1AE] hover:bg-[#201F1F] rounded-xl hover:translate-x-1 transition-all active:scale-[0.98]" href="gestion_mesas.html">
<span class="material-symbols-outlined">grid_view</span><span>Mesas</span>
</a>
<a class="flex items-center gap-4 px-4 py-3 text-[#DDC1AE] hover:bg-[#201F1F] rounded-xl hover:translate-x-1 transition-all active:scale-[0.98]" href="toma_pedidos.html">
<span class="material-symbols-outlined">receipt_long</span><span>Pedidos</span>
</a>
<a class="flex items-center gap-4 px-4 py-3 bg-gradient-to-r from-[#FFB77A] to-[#FF8C00] text-[#131313] rounded-xl font-bold active:scale-[0.98]" href="gestusuarios.php">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">badge</span><span>Personal</span>
</a>
<a class="flex items-center gap-4 px-4 py-3 text-[#DDC1AE] hover:bg-[#201F1F] rounded-xl hover:translate-x-1 transition-all active:scale-[0.98]" href="facturacion.html">
<span class="material-symbols-outlined">settings</span><span>Config</span>
</a>
</nav>
</aside>
<main class="pt-24 pb-32 px-6 md:pl-80 md:pr-10 min-h-screen">
<div class="max-w-4xl mx-auto">
<?php if ($mensaje): ?>
<div class="bg-secondary/20 border border-secondary/20 text-secondary p-6 rounded-2xl mb-8 animate-pulse">
<span class="material-symbols-outlined mr-2">check_circle</span><?php echo $mensaje; ?>
</div>
<?php endif; ?>
<?php if ($error): ?>
<div class="bg-error/20 border border-error/20 text-error p-6 rounded-2xl mb-8">
<span class="material-symbols-outlined mr-2">error</span><?php echo $error; ?>
</div>
<?php endif; ?>
<div class="space-y-8">
<!-- Header -->
<div class="flex items-start justify-between gap-6">
<div>
<h1 class="text-4xl font-headline font-extrabold tracking-tight text-on-surface">Editar Usuario</h1>
<p class="text-on-surface-variant mt-2">Modifica los datos de <strong class="text-primary"><?php echo htmlspecialchars($usuario['nombre']); ?></strong></p>
</div>
<div class="flex gap-3">
<a href="gestusuarios.php" class="px-6 py-3 bg-surface-container-high hover:bg-surface-bright text-on-surface rounded-xl font-medium transition-all border border-outline-variant/50">
<span class="material-symbols-outlined mr-2">arrow_back</span>Volver
</a>
</div>
</div>
<!-- User Card Preview -->
<div class="bg-gradient-to-r from-primary/5 to-primary-container/10 border border-primary/20 p-8 rounded-3xl">
<div class="flex items-center gap-6">
<div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center font-bold text-2xl text-on-primary shadow-2xl">
<?php echo getInitials($usuario['nombre']); ?>
</div>
<div class="flex-1 min-w-0">
<h3 class="text-2xl font-bold text-on-surface mb-1"><?php echo htmlspecialchars($usuario['nombre']); ?></h3>
<p class="text-lg text-on-surface-variant mb-1"><?php echo htmlspecialchars($usuario['email']); ?></p>
<?php if ($usuario['telefono']): ?>
<p class="text-on-surface-variant"><?php echo htmlspecialchars($usuario['telefono']); ?></p>
<?php endif; ?>
<div class="flex items-center gap-4 mt-4 pt-4 border-t border-outline-variant/30">
<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
<span class="material-symbols-outlined text-xs">badge</span><?php echo htmlspecialchars($usuario['nombre_rol'] ?? 'Sin rol'); ?>
</span>
<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold <?php echo $usuario['activo'] ? 'bg-secondary/10 text-secondary' : 'bg-outline-variant/30 text-on-surface-variant'; ?>">
<span class="material-symbols-outlined text-xs"><?php echo $usuario['activo'] ? 'check_circle' : 'schedule'; ?></span><?php echo $usuario['activo'] ? 'Activo' : 'Inactivo'; ?>
</span>
</div>
</div>
</div>
</div>
<!-- Form -->
<div class="bg-surface-container rounded-3xl p-8 shadow-2xl border border-outline-variant/20">
<form method="POST" class="space-y-8">
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
<div>
<label class="block text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-3">Nombre Completo</label>
<div class="relative">
<input type="text" name="nombre" value="<?php echo htmlspecialchars($usuario['nombre']); ?>" required class="w-full px-5 py-4 bg-surface-container-high border border-outline-variant rounded-2xl text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium" placeholder="Ej: Carlos Mendoza">
<span class="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">person</span>
</div>
</div>
<div>
<label class="block text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-3">Email</label>
<div class="relative">
<input type="email" name="email" value="<?php echo htmlspecialchars($usuario['email']); ?>" required class="w-full px-5 py-4 bg-surface-container-high border border-outline-variant rounded-2xl text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium" placeholder="usuario@hakuna.com">
<span class="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">email</span>
</div>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
<div>
<label class="block text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-3">Teléfono (opcional)</label>
<div class="relative">
<input type="tel" name="telefono" value="<?php echo htmlspecialchars($usuario['telefono'] ?? ''); ?>" class="w-full px-5 py-4 bg-surface-container-high border border-outline-variant rounded-2xl text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium" placeholder="+51 999 123 456">
<span class="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">phone</span>
</div>
</div>
<div>
<label class="block text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-3">Rol</label>
<div class="relative">
<select name="id_rol" required class="w-full px-5 py-4 bg-surface-container-high border border-outline-variant rounded-2xl text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium appearance-none">
<option value="">Selecciona rol</option>
<?php foreach ($roles as $rol): ?>
<option value="<?php echo $rol['id_rol']; ?>" <?php echo ($usuario['id_rol'] == $rol['id_rol']) ? 'selected' : ''; ?>><?php echo htmlspecialchars($rol['nombre_rol']); ?></option>
<?php endforeach; ?>
</select>
<span class="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">arrow_drop_down</span>
</div>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
<div>
<label class="flex items-center">
<input type="checkbox" name="activo" <?php echo $usuario['activo'] ? 'checked' : ''; ?> class="w-5 h-5 text-primary bg-surface-container-high border-outline-variant rounded focus:ring-primary focus:ring-2">
<span class="ml-3 block text-sm font-bold uppercase tracking-wider text-on-surface-variant">Activo</span>
</label>
</div>
<div>
<label class="block text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-3">Nueva Contraseña (opcional)</label>
<div class="relative">
<input type="password" name="password" class="w-full px-5 py-4 bg-surface-container-high border border-outline-variant rounded-2xl text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium" placeholder="Dejar vacío para mantener actual">
<span class="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">lock</span>
</div>
<p class="text-xs text-on-surface-variant mt-1">Si cambias la contraseña, será hasheada con MD5 (como login).</p>
</div>
</div>
<div class="flex gap-4 pt-4">
<button type="submit" class="flex-1 bg-gradient-to-r from-primary to-primary-container hover:from-primary/90 text-on-primary-container font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all uppercase tracking-wider text-sm active:scale-[0.98]">
<span class="material-symbols-outlined mr-2">save</span>Actualizar Usuario
</button>
<a href="gestusuarios.php" class="flex-1 bg-surface-container-high hover:bg-surface-bright text-on-surface font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all uppercase tracking-wider text-sm text-center flex items-center justify-center">
<span class="material-symbols-outlined mr-2">arrow_back</span>Cancelar
</a>
</div>
</form>
</div>
</div>
</main>
<!-- Bottom nav same as gestusuarios -->
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-6 pb-4 bg-[#131313]/90 backdrop-blur-xl rounded-t-[1.5rem] shadow-[0_-8px_24px_rgba(0,0,0,0.3)] md:hidden">
<a class="flex flex-col items-center justify-center text-[#DDC1AE] opacity-60 hover:opacity-100 active:scale-90 transition-all" href="#">
<span class="material-symbols-outlined">restaurant</span><span class="text-[10px] font-label uppercase tracking-widest mt-1">Service</span>
</a>
<a class="flex flex-col items-center justify-center text-[#DDC1AE] opacity-60 hover:opacity-100 active:scale-90 transition-all" href="#">
<span class="material-symbols-outlined">table_bar</span><span class="text-[10px] font-label uppercase tracking-widest mt-1">Tables</span>
</a>
<a class="flex flex-col items-center justify-center text-[#FF8C00] scale-110 active:scale-90 transition-all" href="gestusuarios.php">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">group</span><span class="text-[10px] font-label uppercase tracking-widest mt-1">Users</span>
</a>
<a class="flex flex-col items-center justify-center text-[#DDC1AE] opacity-60 hover:opacity-100 active:scale-90 transition-all" href="#">
<span class="material-symbols-outlined">history</span><span class="text-[10px] font-label uppercase tracking-widest mt-1">History</span>
</a>
</nav>
<script>
// Copy to clipboard feedback
</script>
</body>
</html>
