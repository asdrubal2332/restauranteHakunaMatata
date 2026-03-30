<?php
require 'bd.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_usuario = $_POST['id_usuario'] ?? null;
    $id = (int)$id_usuario;

    if ($id > 0) {
        $stmt = mysqli_prepare($conexionBd, "UPDATE usuarios SET activo = 0 WHERE id_usuario = ?");
        mysqli_stmt_bind_param($stmt, 'i', $id);
        if (mysqli_stmt_execute($stmt)) {
            header('Location: gestusuarios.php?mensaje=Usuario desactivado exitosamente');
            mysqli_stmt_close($stmt);
            exit;
        } else {
            header('Location: gestusuarios.php?mensaje=Error al desactivar: ' . mysqli_error($conexionBd));
            mysqli_stmt_close($stmt);
            exit;
        }
    }
}

header('Location: gestusuarios.php');
?>

