<?php
require 'bd.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? null;

    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM usuarios WHERE id = ?");
        if ($stmt->execute([$id])) {
            header('Location: gestusuarios.php?mensaje=Usuario eliminado exitosamente');
            exit;
        }
    }
}

header('Location: gestusuarios.php');
?>