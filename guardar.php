<?php
    header("Content-type: application/json");

    require __DIR__ . "/bd.php";

    $username = trim($_POST['username'] ?? "");
    $email  = trim($_POST['email'] ?? "");

    if ($username === "" || $email === "") {
        echo json_encode(["ok" => false, "mensaje"=> "Nombre de usuario y el email son obligatorios"]);
        exit;
    }

    try {
        
        $consulta = mysqli_prepare($conexionBd, "INSERT INTO contactos (nombre, email) VALUES (?, ?)");

        mysqli_stmt_bind_param($consulta, "ss", $username, $email);
        mysqli_stmt_execute($consulta);
        mysqli_stmt_close($consulta);
       

        echo json_encode(["ok"=> true, "mensaje" => "Contacto guardado correctamente"]);
    

    } catch (mysqli_sql_exception $error) {
       echo json_encode(["ok"=> false, "mensaje" => "Error al guardar" . $error->getMessage()]);
    }