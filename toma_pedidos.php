<?php
require 'bd.php';

// Obtener los 6 primeros productos activos
$productos = [];
$res = mysqli_query($conexionBd, "SELECT id_producto, nombre, precio, imagen_url FROM productos WHERE activo = 1 ORDER BY id_producto ASC LIMIT 6");
while ($row = mysqli_fetch_assoc($res)) {
    $productos[] = $row;
}

$mensaje = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['productos'])) {
    $productos_seleccionados = $_POST['productos']; // [id_producto => cantidad]
    $total = 0;
    $detalles = [];
    foreach ($productos_seleccionados as $id => $cantidad) {
        $id = (int)$id;
        $cantidad = (int)$cantidad;
        if ($cantidad > 0) {
            $res = mysqli_query($conexionBd, "SELECT precio FROM productos WHERE id_producto = $id");
            $row = mysqli_fetch_assoc($res);
            $precio = $row ? (float)$row['precio'] : 0;
            $subtotal = $precio * $cantidad;
            $total += $subtotal;
            $detalles[] = ['id_producto' => $id, 'cantidad' => $cantidad, 'precio' => $precio];
        }
    }
    if ($total > 0) {
        // Insertar pedido anónimo
        $query = "INSERT INTO pedidos (id_usuario, total, estado, direccion_entrega) VALUES (3, $total, 'pendiente', '')";
        if (mysqli_query($conexionBd, $query)) {
            $id_pedido = mysqli_insert_id($conexionBd);
            foreach ($detalles as $d) {
                $q = "INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES ($id_pedido, {$d['id_producto']}, {$d['cantidad']}, {$d['precio']})";
                mysqli_query($conexionBd, $q);
            }
            $mensaje = '<div class="bg-secondary/20 text-secondary p-4 rounded-lg mb-6">✓ Pedido enviado correctamente</div>';
        } else {
            $mensaje = '<div class="bg-error/20 text-error p-4 rounded-lg mb-6">✗ Error al enviar pedido</div>';
        }
    } else {
        $mensaje = '<div class="bg-error/20 text-error p-4 rounded-lg mb-6">✗ Selecciona al menos un producto</div>';
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
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <title>Toma de Pedidos</title>
    <script>
    // Productos PHP a JS
    const productos = [
        <?php foreach ($productos as $p): ?>
        {
            id: <?php echo (int)$p['id_producto']; ?>,
            nombre: <?php echo json_encode($p['nombre']); ?>,
            precio: <?php echo (float)$p['precio']; ?>
        },
        <?php endforeach; ?>
    ];

    function actualizarPedidoActual() {
        let total = 0;
        let lista = '';
        productos.forEach(function(p) {
            let input = document.getElementById('prod-' + p.id);
            let cantidad = parseInt(input.value) || 0;
            if (cantidad > 0) {
                let subtotal = p.precio * cantidad;
                total += subtotal;
                lista += `<div class="flex justify-between"><span>${p.nombre} <span class='text-xs text-[#FD8E00]'>x${cantidad}</span></span><span>S/ ${subtotal.toFixed(2)}</span></div>`;
            }
        });
        document.getElementById('pedido-actual-lista').innerHTML = lista || '<span class="text-sm text-gray-400">No hay productos seleccionados</span>';
        document.getElementById('total').textContent = total.toFixed(2);
    }

    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.cantidad-input').forEach(function(input) {
            input.addEventListener('input', actualizarPedidoActual);
        });
        actualizarPedidoActual();
    });
    </script>
</head>
<body class="bg-[#131313] text-[#e5e2e1] font-body min-h-screen">
<main class="pt-24 pb-32 px-6 max-w-3xl mx-auto">
    <h1 class="text-4xl font-headline font-extrabold tracking-tight mb-8 text-center">Toma de Pedidos</h1>
    <?php if ($mensaje) echo $mensaje; ?>
    <form method="POST" class="space-y-10">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <?php foreach ($productos as $p): ?>
            <div class="bg-surface-container-high rounded-xl p-6 shadow-lg flex flex-col items-center">
                <?php if (!empty($p['imagen_url'])): ?>
                    <img src="<?php echo htmlspecialchars($p['imagen_url']); ?>" alt="<?php echo htmlspecialchars($p['nombre']); ?>" class="w-32 h-32 object-contain mb-4 rounded-lg bg-[#201f1f]">
                <?php endif; ?>
                <div class="font-bold text-lg mb-2"><?php echo htmlspecialchars($p['nombre']); ?></div>
                <div class="text-primary font-bold mb-2">S/ <?php echo number_format($p['precio'], 2); ?></div>
                <label class="block text-sm mb-1" for="prod-<?php echo $p['id_producto']; ?>">Cantidad:</label>
                <input type="number" min="0" max="99" value="0" name="productos[<?php echo $p['id_producto']; ?>]" id="prod-<?php echo $p['id_producto']; ?>" class="cantidad-input w-20 px-3 py-2 rounded-lg bg-[#131313] text-[#FD8E00] border border-[#FD8E00] text-center" data-precio="<?php echo $p['precio']; ?>" data-id="<?php echo $p['id_producto']; ?>">
                <div class="mt-2 text-xs">Subtotal: <span id="subtotal-<?php echo $p['id_producto']; ?>">0.00</span></div>
            </div>
            <?php endforeach; ?>
        </div>
        <div class="bg-surface-container-high rounded-xl p-6 shadow-lg flex flex-col items-center">
            <div class="text-xl font-bold mb-2">Pedido Actual</div>
            <div id="pedido-actual-lista" class="w-full flex flex-col gap-2 mb-4"></div>
            <div class="text-lg font-bold mt-4">Total: S/ <span id="total">0.00</span></div>
            <button type="submit" class="mt-6 bg-gradient-to-tr from-[#FFB77A] to-[#FD8E00] text-[#131313] px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                <span class="material-symbols-outlined">send</span> Enviar Pedido
            </button>
        </div>
    </form>
</main>
</body>
</html>
