-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 29, 2026 at 08:51 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `restaurantehakmata`
--

-- --------------------------------------------------------

--
-- Table structure for table `auditoria`
--

CREATE TABLE `auditoria` (
  `id_auditoria` int NOT NULL,
  `id_usuario` int NOT NULL,
  `tabla_afectada` varchar(100) NOT NULL,
  `accion` varchar(50) NOT NULL,
  `descripcion` text,
  `fecha_hora` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `auditoria`
--

INSERT INTO `auditoria` (`id_auditoria`, `id_usuario`, `tabla_afectada`, `accion`, `descripcion`, `fecha_hora`) VALUES
(1, 1, 'productos', 'INSERT', 'Se agregó nuevo producto: Monitor LG 24\"', '2026-03-29 20:51:22'),
(2, 1, 'usuarios', 'INSERT', 'Se creó nuevo usuario vendedor: Juan Pérez', '2026-03-29 20:51:22'),
(3, 2, 'productos', 'UPDATE', 'Se actualizó precio del producto Laptop Dell XPS 13', '2026-03-29 20:51:22'),
(4, 1, 'pedidos', 'UPDATE', 'Se cambió estado de pedido 1 a entregado', '2026-03-29 20:51:22'),
(5, 2, 'inventario', 'UPDATE', 'Se actualizó stock de Monitor LG 24\" a 45 unidades', '2026-03-29 20:51:22'),
(6, 1, 'proveedores', 'INSERT', 'Se agregó nuevo proveedor: Tech Solutions Perú', '2026-03-29 20:51:22'),
(7, 3, 'carrito', 'INSERT', 'Se agregó producto al carrito del usuario', '2026-03-29 20:51:22'),
(8, 2, 'compras_proveedor', 'INSERT', 'Se creó nueva compra a proveedor', '2026-03-29 20:51:22');

-- --------------------------------------------------------

--
-- Table structure for table `carrito`
--

CREATE TABLE `carrito` (
  `id_carrito` int NOT NULL,
  `id_usuario` int NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `carrito`
--

INSERT INTO `carrito` (`id_carrito`, `id_usuario`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 4, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(2, 5, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(3, 6, '2026-03-29 20:51:22', '2026-03-29 20:51:22');

-- --------------------------------------------------------

--
-- Table structure for table `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `activa` tinyint(1) DEFAULT '1',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre`, `descripcion`, `activa`, `fecha_creacion`) VALUES
(1, 'Electrónica', 'Dispositivos y equipos electrónicos', 1, '2026-03-29 20:51:21'),
(2, 'Informática', 'Computadoras, laptops y accesorios', 1, '2026-03-29 20:51:21'),
(3, 'Smartphones', 'Teléfonos móviles y tablets', 1, '2026-03-29 20:51:21'),
(4, 'Audio', 'Auriculares, parlantes y sistemas de sonido', 1, '2026-03-29 20:51:21'),
(5, 'Ropa', 'Prendas de vestir para hombre y mujer', 1, '2026-03-29 20:51:21'),
(6, 'Accesorios', 'Billeteras, mochilas, sombreros', 1, '2026-03-29 20:51:21'),
(7, 'Deportes', 'Artículos deportivos y fitness', 1, '2026-03-29 20:51:21'),
(8, 'Libros', 'Libros físicos y material educativo', 1, '2026-03-29 20:51:21');

-- --------------------------------------------------------

--
-- Table structure for table `compras_proveedor`
--

CREATE TABLE `compras_proveedor` (
  `id_compra` int NOT NULL,
  `id_proveedor` int NOT NULL,
  `id_usuario` int NOT NULL,
  `fecha_compra` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `total` decimal(12,2) DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'pendiente',
  `observaciones` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `compras_proveedor`
--

INSERT INTO `compras_proveedor` (`id_compra`, `id_proveedor`, `id_usuario`, `fecha_compra`, `total`, `estado`, `observaciones`) VALUES
(1, 1, 1, '2026-03-29 20:51:22', 5999.95, 'recibido', 'Compra inicial de electrónica'),
(2, 1, 1, '2026-03-29 20:51:22', 3599.97, 'recibido', 'Segunda orden de laptops'),
(3, 2, 1, '2026-03-29 20:51:22', 2899.95, 'recibido', 'Smartphones importados'),
(4, 3, 1, '2026-03-29 20:51:22', 1899.90, 'recibido', 'Ropa de temporada'),
(5, 4, 1, '2026-03-29 20:51:22', 1500.00, 'pendiente', 'Orden en tránsito');

-- --------------------------------------------------------

--
-- Table structure for table `detalle_carrito`
--

CREATE TABLE `detalle_carrito` (
  `id_detalle` int NOT NULL,
  `id_carrito` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `fecha_agregado` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `detalle_carrito`
--

INSERT INTO `detalle_carrito` (`id_detalle`, `id_carrito`, `id_producto`, `cantidad`, `precio_unitario`, `fecha_agregado`) VALUES
(1, 1, 1, 1, 299.99, '2026-03-29 20:51:22'),
(2, 1, 9, 1, 399.99, '2026-03-29 20:51:22'),
(3, 1, 12, 2, 49.99, '2026-03-29 20:51:22'),
(4, 2, 5, 1, 1199.99, '2026-03-29 20:51:22'),
(5, 2, 19, 1, 129.99, '2026-03-29 20:51:22'),
(6, 3, 10, 1, 149.99, '2026-03-29 20:51:22'),
(7, 3, 13, 1, 89.99, '2026-03-29 20:51:22');

-- --------------------------------------------------------

--
-- Table structure for table `detalle_compra_proveedor`
--

CREATE TABLE `detalle_compra_proveedor` (
  `id_detalle` int NOT NULL,
  `id_compra` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(12,2) GENERATED ALWAYS AS ((`cantidad` * `precio_unitario`)) STORED
) ;

--
-- Dumping data for table `detalle_compra_proveedor`
--

INSERT INTO `detalle_compra_proveedor` (`id_detalle`, `id_compra`, `id_producto`, `cantidad`, `precio_unitario`) VALUES
(1, 1, 1, 20, 250.00),
(2, 1, 2, 5, 999.99),
(3, 1, 4, 10, 599.99),
(4, 2, 3, 8, 1799.99),
(5, 2, 4, 12, 599.99),
(6, 3, 5, 10, 999.99),
(7, 3, 6, 20, 399.99),
(8, 3, 7, 25, 249.99),
(9, 4, 12, 40, 39.99),
(10, 4, 13, 30, 69.99),
(11, 5, 9, 15, 350.00),
(12, 5, 10, 25, 119.99);

-- --------------------------------------------------------

--
-- Table structure for table `detalle_pedido`
--

CREATE TABLE `detalle_pedido` (
  `id_detalle` int NOT NULL,
  `id_pedido` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(12,2) GENERATED ALWAYS AS ((`cantidad` * `precio_unitario`)) STORED
) ;

--
-- Dumping data for table `detalle_pedido`
--

INSERT INTO `detalle_pedido` (`id_detalle`, `id_pedido`, `id_producto`, `cantidad`, `precio_unitario`) VALUES
(1, 1, 1, 1, 299.99),
(2, 1, 9, 1, 399.99),
(3, 1, 12, 2, 49.99),
(4, 2, 5, 1, 1199.99),
(5, 2, 19, 1, 129.99),
(6, 2, 16, 1, 129.99),
(7, 3, 10, 1, 149.99),
(8, 3, 13, 1, 89.99),
(9, 3, 21, 1, 49.99),
(10, 4, 3, 1, 1899.99),
(11, 4, 20, 2, 149.99),
(12, 5, 15, 1, 59.99),
(13, 5, 18, 1, 69.99);

-- --------------------------------------------------------

--
-- Table structure for table `entregas`
--

CREATE TABLE `entregas` (
  `id_entrega` int NOT NULL,
  `id_pedido` int NOT NULL,
  `id_usuario_transportista` int DEFAULT NULL,
  `fecha_inicio_entrega` timestamp NULL DEFAULT NULL,
  `fecha_entrega_real` timestamp NULL DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'pendiente',
  `ubicacion_actual` varchar(255) DEFAULT NULL,
  `observaciones` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `entregas`
--

INSERT INTO `entregas` (`id_entrega`, `id_pedido`, `id_usuario_transportista`, `fecha_inicio_entrega`, `fecha_entrega_real`, `estado`, `ubicacion_actual`, `observaciones`) VALUES
(1, 1, 7, '2026-03-20 13:00:00', '2026-03-22 20:30:00', 'entregado', 'Miraflores, Lima', 'Entregado en puerta del cliente'),
(2, 2, 8, '2026-03-25 14:00:00', NULL, 'en_transito', 'Cerro Colorado, Arequipa', 'En camino a Arequipa'),
(3, 3, 7, NULL, NULL, 'pendiente', 'Almacén Central', 'Pendiente de asignación de transportista'),
(4, 4, 8, '2026-03-27 15:00:00', NULL, 'en_transito', 'Centro, Trujillo', 'Recogida completada'),
(5, 5, 7, '2026-03-28 12:30:00', NULL, 'en_transito', 'Centro, Chiclayo', 'En ruta a Chiclayo');

-- --------------------------------------------------------

--
-- Table structure for table `inventario`
--

CREATE TABLE `inventario` (
  `id_inventario` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` int DEFAULT '0',
  `cantidad_minima` int DEFAULT '10',
  `cantidad_maxima` int DEFAULT '1000',
  `ubicacion` varchar(100) DEFAULT NULL,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `inventario`
--

INSERT INTO `inventario` (`id_inventario`, `id_producto`, `cantidad`, `cantidad_minima`, `cantidad_maxima`, `ubicacion`, `fecha_actualizacion`) VALUES
(1, 1, 45, 10, 100, 'Pasillo A - Estante 1', '2026-03-29 20:51:22'),
(2, 2, 12, 5, 50, 'Pasillo B - Estante 3', '2026-03-29 20:51:22'),
(3, 3, 8, 2, 30, 'Almacén Principal - Zona 1', '2026-03-29 20:51:22'),
(4, 4, 20, 5, 60, 'Almacén Principal - Zona 2', '2026-03-29 20:51:22'),
(5, 5, 15, 5, 40, 'Vitrina - Sección Premium', '2026-03-29 20:51:22'),
(6, 6, 35, 15, 100, 'Almacén Principal - Zona 3', '2026-03-29 20:51:22'),
(7, 7, 50, 20, 150, 'Almacén Principal - Zona 4', '2026-03-29 20:51:22'),
(8, 8, 10, 3, 25, 'Vitrina - Sección Tablets', '2026-03-29 20:51:22'),
(9, 9, 22, 10, 60, 'Pasillo C - Estante 2', '2026-03-29 20:51:22'),
(10, 10, 40, 15, 100, 'Pasillo D - Estante 1', '2026-03-29 20:51:22'),
(11, 11, 18, 8, 50, 'Vitrina - Sección Audio', '2026-03-29 20:51:22'),
(12, 12, 100, 30, 200, 'Almacén de Ropa - Zona 1', '2026-03-29 20:51:22'),
(13, 13, 60, 20, 150, 'Almacén de Ropa - Zona 2', '2026-03-29 20:51:22'),
(14, 14, 35, 10, 80, 'Almacén de Ropa - Zona 3', '2026-03-29 20:51:22'),
(15, 15, 75, 25, 150, 'Almacén de Ropa - Zona 4', '2026-03-29 20:51:22'),
(16, 16, 28, 10, 60, 'Pasillo E - Estante 1', '2026-03-29 20:51:22'),
(17, 17, 42, 15, 100, 'Pasillo E - Estante 2', '2026-03-29 20:51:22'),
(18, 18, 55, 20, 120, 'Pasillo E - Estante 3', '2026-03-29 20:51:22'),
(19, 19, 38, 10, 80, 'Pasillo F - Estante 1', '2026-03-29 20:51:22'),
(20, 20, 20, 5, 50, 'Almacén de Deportes - Zona 1', '2026-03-29 20:51:22'),
(21, 21, 85, 30, 200, 'Almacén de Deportes - Zona 2', '2026-03-29 20:51:22'),
(22, 22, 30, 10, 50, 'Pasillo G - Estante 1', '2026-03-29 20:51:22'),
(23, 23, 25, 8, 40, 'Pasillo G - Estante 2', '2026-03-29 20:51:22');

-- --------------------------------------------------------

--
-- Table structure for table `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int NOT NULL,
  `id_usuario` int NOT NULL,
  `fecha_pedido` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_entrega` timestamp NULL DEFAULT NULL,
  `total` decimal(12,2) NOT NULL,
  `estado` varchar(50) DEFAULT 'pendiente',
  `direccion_entrega` text NOT NULL,
  `provincia` varchar(100) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `distrito` varchar(100) DEFAULT NULL,
  `codigo_postal` varchar(20) DEFAULT NULL,
  `observaciones` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `id_usuario`, `fecha_pedido`, `fecha_entrega`, `total`, `estado`, `direccion_entrega`, `provincia`, `ciudad`, `distrito`, `codigo_postal`, `observaciones`) VALUES
(1, 4, '2026-03-29 20:51:22', NULL, 1499.96, 'entregado', 'Av. Principal 123, Apto 456', 'Lima', 'Lima', 'Miraflores', '15074', 'Entrega exitosa'),
(2, 5, '2026-03-29 20:51:22', NULL, 2199.97, 'procesando', 'Jr. Secundaria 789, Casa 10', 'Arequipa', 'Arequipa', 'Cerro Colorado', '04017', 'En preparación'),
(3, 6, '2026-03-29 20:51:22', NULL, 799.97, 'pendiente', 'Calle Libertad 321, Piso 3', 'Cusco', 'Cusco', 'Santiago', '08006', 'Pendiente de confirmación'),
(4, 4, '2026-03-29 20:51:22', NULL, 1599.96, 'pendiente', 'Av. Central 654, Depto 201', 'Trujillo', 'Trujillo', 'Centro', '13001', 'Nuevo pedido'),
(5, 5, '2026-03-29 20:51:22', NULL, 599.98, 'procesando', 'Jr. Amazonas 987, Casa 5', 'Chiclayo', 'Chiclayo', 'Centro', '14001', 'En preparación del envío');

-- --------------------------------------------------------

--
-- Table structure for table `productos`
--

CREATE TABLE `productos` (
  `id_producto` int NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text,
  `id_categoria` int NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int DEFAULT '0',
  `imagen_url` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `id_usuario_creador` int NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `id_categoria`, `precio`, `stock`, `imagen_url`, `activo`, `id_usuario_creador`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Monitor LG 24\" Full HD', 'Monitor LED 24 pulgadas resolución Full HD, ideal para oficina', 1, 299.99, 45, 'img/monitor-lg-24.jpg', 1, 1, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(2, 'Televisor Samsung 55\"', 'Smart TV 55 pulgadas 4K con Android TV integrado', 1, 1299.99, 12, 'img/tv-samsung-55.jpg', 1, 1, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(3, 'Laptop Dell XPS 13', 'Laptop ultradelgada con procesador Intel i7, 16GB RAM', 2, 1899.99, 8, 'img/laptop-dell-xps.jpg', 1, 1, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(4, 'Laptop HP Pavilion 15', 'Laptop 15.6\" AMD Ryzen 5, 8GB RAM, 256GB SSD', 2, 699.99, 20, 'img/laptop-hp-pavilion.jpg', 1, 1, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(5, 'iPhone 14 Pro', 'Apple iPhone 14 Pro 256GB color Space Black', 3, 1199.99, 15, 'img/iphone14-pro.jpg', 1, 1, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(6, 'Samsung Galaxy A53', 'Samsung Galaxy A53 128GB color azul', 3, 449.99, 35, 'img/galaxy-a53.jpg', 1, 1, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(7, 'Xiaomi Redmi Note 12', 'Xiaomi Redmi Note 12 128GB color gris', 3, 299.99, 50, 'img/redmi-note12.jpg', 1, 1, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(8, 'iPad Air 5', 'Apple iPad Air 5 64GB Wi-Fi color verde', 3, 749.99, 10, 'img/ipad-air5.jpg', 1, 1, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(9, 'Sony WH-1000XM5', 'Auriculares inalámbricos con cancelación de ruido', 4, 399.99, 22, 'img/sony-wh1000xm5.jpg', 1, 1, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(10, 'JBL Flip 6', 'Parlante portátil resistente al agua', 4, 149.99, 40, 'img/jbl-flip6.jpg', 1, 1, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(11, 'AirPods Pro', 'Auriculares Apple con cancelación activa de ruido', 4, 299.99, 18, 'img/airpods-pro.jpg', 1, 1, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(12, 'Camiseta Nike Básica', 'Camiseta de algodón 100% color blanco', 5, 49.99, 100, 'img/camiseta-nike.jpg', 1, 2, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(13, 'Jeans Levi\'s 501', 'Jeans clásico color azul oscuro', 5, 89.99, 60, 'img/jeans-levis.jpg', 1, 2, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(14, 'Hoodie Adidas', 'Sudadera Adidas con cierre color gris', 5, 79.99, 35, 'img/hoodie-adidas.jpg', 1, 2, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(15, 'Pantalón Deportivo', 'Pantalón deportivo ajustado color negro', 5, 59.99, 75, 'img/pantalon-deporte.jpg', 1, 2, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(16, 'Mochila Backpack', 'Mochila de viaje con múltiples compartimentos', 6, 129.99, 28, 'img/mochila-backpack.jpg', 1, 2, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(17, 'Billetera Cuero', 'Billetera de cuero genuino color marrón', 6, 89.99, 42, 'img/billetera-cuero.jpg', 1, 2, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(18, 'Cinturón Piel', 'Cinturón de piel auténtica con hebilla de metal', 6, 69.99, 55, 'img/cinturon-piel.jpg', 1, 2, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(19, 'Zapatillas Running Nike', 'Zapatillas Nike para correr color negro', 7, 129.99, 38, 'img/zapatillas-nike.jpg', 1, 2, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(20, 'Mancuerna 10kg', 'Juego de mancuernas de 10kg cada una', 7, 149.99, 20, 'img/mancuerna-10kg.jpg', 1, 2, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(21, 'Colchoneta Yoga', 'Colchoneta antideslizante para yoga', 7, 49.99, 85, 'img/colchoneta-yoga.jpg', 1, 2, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(22, 'El Quijote - Miguel Cervantes', 'Novela clásica edición de bolsillo', 8, 34.99, 30, 'img/quijote.jpg', 1, 2, '2026-03-29 20:51:22', '2026-03-29 20:51:22'),
(23, 'Python para Principiantes', 'Guía completa para aprender Python desde cero', 8, 49.99, 25, 'img/python-libro.jpg', 1, 2, '2026-03-29 20:51:22', '2026-03-29 20:51:22');

-- --------------------------------------------------------

--
-- Table structure for table `proveedores`
--

CREATE TABLE `proveedores` (
  `id_proveedor` int NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `contacto` varchar(80) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(120) DEFAULT NULL,
  `direccion` text,
  `ciudad` varchar(100) DEFAULT NULL,
  `provincia` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `proveedores`
--

INSERT INTO `proveedores` (`id_proveedor`, `nombre`, `contacto`, `telefono`, `email`, `direccion`, `ciudad`, `provincia`, `activo`, `fecha_creacion`) VALUES
(1, 'Tech Solutions Perú', 'Carlos Mendez', '987654321', 'info@techsol.pe', 'Av. Principal 123', 'Lima', 'Lima', 1, '2026-03-29 20:51:22'),
(2, 'Global Electronics', 'Miguel Gonzalez', '956123456', 'ventas@globalelec.pe', 'Jr. Comercio 456', 'Arequipa', 'Arequipa', 1, '2026-03-29 20:51:22'),
(3, 'Fashion Import Co.', 'Patricia Ruiz', '945678901', 'contacto@fashionimport.pe', 'Calle Mayor 789', 'Cusco', 'Cusco', 1, '2026-03-29 20:51:22'),
(4, 'Distribuidora Andina', 'Roberto Chávez', '934567890', 'distribucion@andina.pe', 'Av. Central 234', 'Trujillo', 'Trujillo', 1, '2026-03-29 20:51:22'),
(5, 'Electronics Warehouse', 'Fernando López', '923456789', 'warehouse@elecware.pe', 'Zona Industrial 567', 'Chiclayo', 'Lambayeque', 1, '2026-03-29 20:51:22');

-- --------------------------------------------------------

--
-- Table structure for table `resenas`
--

CREATE TABLE `resenas` (
  `id_resena` int NOT NULL,
  `id_producto` int NOT NULL,
  `id_usuario` int NOT NULL,
  `calificacion` int NOT NULL,
  `comentario` text,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `resenas`
--

INSERT INTO `resenas` (`id_resena`, `id_producto`, `id_usuario`, `calificacion`, `comentario`, `fecha_creacion`) VALUES
(1, 1, 4, 5, 'Excelente monitor, muy buen precio y calidad. Entrega rápida.', '2026-03-29 20:51:22'),
(2, 1, 5, 4, 'Muy bueno, aunque la instalación fue complicada.', '2026-03-29 20:51:22'),
(3, 5, 6, 5, 'El iPhone funciona perfectamente. Recomendado.', '2026-03-29 20:51:22'),
(4, 12, 4, 4, 'Camiseta cómoda y de buena calidad.', '2026-03-29 20:51:22'),
(5, 13, 5, 5, 'Jeans de excelente confección.', '2026-03-29 20:51:22'),
(6, 19, 6, 3, 'Las zapatillas son bonitas pero me vinieron un poco apretadas.', '2026-03-29 20:51:22'),
(7, 9, 4, 5, 'Los auriculares Sony son increíbles, cancelación de ruido perfecta.', '2026-03-29 20:51:22'),
(8, 10, 5, 4, 'Parlante JBL muy bueno, sonido claro.', '2026-03-29 20:51:22'),
(9, 3, 6, 5, 'Laptop Dell excelente para programación y diseño.', '2026-03-29 20:51:22'),
(10, 22, 4, 5, 'Libro muy bien redactado, excelente para aprender Python.', '2026-03-29 20:51:22');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id_rol` int NOT NULL,
  `nombre_rol` varchar(50) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre_rol`, `descripcion`, `creado_en`) VALUES
(1, 'Administrador', 'Control total del sistema', '2026-03-29 20:51:21'),
(2, 'Vendedor', 'Gestión de productos y pedidos', '2026-03-29 20:51:21'),
(3, 'Cliente', 'Comprador de productos', '2026-03-29 20:51:21'),
(4, 'Transportista', 'Encargado de entregas', '2026-03-29 20:51:21');

-- --------------------------------------------------------

--
-- Table structure for table `sesiones`
--

CREATE TABLE `sesiones` (
  `id_sesion` int NOT NULL,
  `id_usuario` int NOT NULL,
  `fecha_inicio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_cierre` timestamp NULL DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `activa` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `email` varchar(120) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `contrasena_hash` varchar(255) NOT NULL,
  `id_rol` int NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `email`, `telefono`, `contrasena_hash`, `id_rol`, `activo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Carlos Mendoza', 'admin@tienda.com', '987654321', '$2y$10$LQv3c1yqBWVHxkd0LHAkCOYvFVzZr90eefqRGMqzFHU8zKFVVKPLi', 1, 1, '2026-03-29 20:51:21', '2026-03-29 20:51:21'),
(2, 'Juan Pérez', 'juan.perez@email.com', '987123456', '$2y$10$LQv3c1yqBWVHxkd0LHAkCOYvFVzZr90eefqRGMqzFHU8zKFVVKPLi', 2, 1, '2026-03-29 20:51:21', '2026-03-29 20:51:21'),
(3, 'María García', 'maria.garcia@email.com', '956234567', '$2y$10$LQv3c1yqBWVHxkd0LHAkCOYvFVzZr90eefqRGMqzFHU8zKFVVKPLi', 2, 1, '2026-03-29 20:51:21', '2026-03-29 20:51:21'),
(4, 'Roberto Silva', 'roberto.silva@email.com', '945123789', '$2y$10$LQv3c1yqBWVHxkd0LHAkCOYvFVzZr90eefqRGMqzFHU8zKFVVKPLi', 3, 1, '2026-03-29 20:51:21', '2026-03-29 20:51:21'),
(5, 'Ana López', 'ana.lopez@email.com', '934567890', '$2y$10$LQv3c1yqBWVHxkd0LHAkCOYvFVzZr90eefqRGMqzFHU8zKFVVKPLi', 3, 1, '2026-03-29 20:51:21', '2026-03-29 20:51:21'),
(6, 'Luis Ramírez', 'luis.ramirez@email.com', '923456789', '$2y$10$LQv3c1yqBWVHxkd0LHAkCOYvFVzZr90eefqRGMqzFHU8zKFVVKPLi', 3, 1, '2026-03-29 20:51:21', '2026-03-29 20:51:21'),
(7, 'Carmen Flores', 'carmen.flores@email.com', '912345678', '$2y$10$LQv3c1yqBWVHxkd0LHAkCOYvFVzZr90eefqRGMqzFHU8zKFVVKPLi', 4, 1, '2026-03-29 20:51:21', '2026-03-29 20:51:21'),
(8, 'Diego Torres', 'diego.torres@email.com', '901234567', '$2y$10$LQv3c1yqBWVHxkd0LHAkCOYvFVzZr90eefqRGMqzFHU8zKFVVKPLi', 4, 1, '2026-03-29 20:51:21', '2026-03-29 20:51:21');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id_auditoria`),
  ADD KEY `idx_usuario` (`id_usuario`),
  ADD KEY `idx_fecha` (`fecha_hora`);

--
-- Indexes for table `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id_carrito`),
  ADD UNIQUE KEY `uq_usuario_activo` (`id_usuario`);

--
-- Indexes for table `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD KEY `idx_nombre` (`nombre`);

--
-- Indexes for table `compras_proveedor`
--
ALTER TABLE `compras_proveedor`
  ADD PRIMARY KEY (`id_compra`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `idx_proveedor` (`id_proveedor`),
  ADD KEY `idx_estado` (`estado`);

--
-- Indexes for table `detalle_carrito`
--
ALTER TABLE `detalle_carrito`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `idx_carrito` (`id_carrito`);

--
-- Indexes for table `detalle_compra_proveedor`
--
ALTER TABLE `detalle_compra_proveedor`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `idx_compra` (`id_compra`);

--
-- Indexes for table `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `idx_pedido` (`id_pedido`);

--
-- Indexes for table `entregas`
--
ALTER TABLE `entregas`
  ADD PRIMARY KEY (`id_entrega`),
  ADD UNIQUE KEY `id_pedido` (`id_pedido`),
  ADD KEY `id_usuario_transportista` (`id_usuario_transportista`),
  ADD KEY `idx_estado` (`estado`);

--
-- Indexes for table `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id_inventario`),
  ADD UNIQUE KEY `uq_producto` (`id_producto`),
  ADD KEY `idx_cantidad` (`cantidad`);

--
-- Indexes for table `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `idx_usuario` (`id_usuario`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_fecha` (`fecha_pedido`);

--
-- Indexes for table `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `id_usuario_creador` (`id_usuario_creador`),
  ADD KEY `idx_categoria` (`id_categoria`),
  ADD KEY `idx_activo` (`activo`),
  ADD KEY `idx_nombre` (`nombre`);

--
-- Indexes for table `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id_proveedor`),
  ADD KEY `idx_nombre` (`nombre`);

--
-- Indexes for table `resenas`
--
ALTER TABLE `resenas`
  ADD PRIMARY KEY (`id_resena`),
  ADD UNIQUE KEY `uq_usuario_producto` (`id_usuario`,`id_producto`),
  ADD KEY `idx_producto` (`id_producto`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre_rol` (`nombre_rol`);

--
-- Indexes for table `sesiones`
--
ALTER TABLE `sesiones`
  ADD PRIMARY KEY (`id_sesion`),
  ADD KEY `idx_usuario` (`id_usuario`),
  ADD KEY `idx_activa` (`activa`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_rol` (`id_rol`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_activo` (`activo`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auditoria`
--
ALTER TABLE `auditoria`
  MODIFY `id_auditoria` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id_carrito` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `compras_proveedor`
--
ALTER TABLE `compras_proveedor`
  MODIFY `id_compra` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `detalle_carrito`
--
ALTER TABLE `detalle_carrito`
  MODIFY `id_detalle` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `detalle_compra_proveedor`
--
ALTER TABLE `detalle_compra_proveedor`
  MODIFY `id_detalle` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  MODIFY `id_detalle` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `entregas`
--
ALTER TABLE `entregas`
  MODIFY `id_entrega` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id_inventario` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedor` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `resenas`
--
ALTER TABLE `resenas`
  MODIFY `id_resena` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sesiones`
--
ALTER TABLE `sesiones`
  MODIFY `id_sesion` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auditoria`
--
ALTER TABLE `auditoria`
  ADD CONSTRAINT `auditoria_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Constraints for table `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Constraints for table `compras_proveedor`
--
ALTER TABLE `compras_proveedor`
  ADD CONSTRAINT `compras_proveedor_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`),
  ADD CONSTRAINT `compras_proveedor_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Constraints for table `detalle_carrito`
--
ALTER TABLE `detalle_carrito`
  ADD CONSTRAINT `detalle_carrito_ibfk_1` FOREIGN KEY (`id_carrito`) REFERENCES `carrito` (`id_carrito`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_carrito_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Constraints for table `detalle_compra_proveedor`
--
ALTER TABLE `detalle_compra_proveedor`
  ADD CONSTRAINT `detalle_compra_proveedor_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compras_proveedor` (`id_compra`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_compra_proveedor_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Constraints for table `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD CONSTRAINT `detalle_pedido_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_pedido_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Constraints for table `entregas`
--
ALTER TABLE `entregas`
  ADD CONSTRAINT `entregas_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`),
  ADD CONSTRAINT `entregas_ibfk_2` FOREIGN KEY (`id_usuario_transportista`) REFERENCES `usuarios` (`id_usuario`);

--
-- Constraints for table `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE;

--
-- Constraints for table `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Constraints for table `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  ADD CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`id_usuario_creador`) REFERENCES `usuarios` (`id_usuario`);

--
-- Constraints for table `resenas`
--
ALTER TABLE `resenas`
  ADD CONSTRAINT `resenas_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `resenas_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Constraints for table `sesiones`
--
ALTER TABLE `sesiones`
  ADD CONSTRAINT `sesiones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Constraints for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
