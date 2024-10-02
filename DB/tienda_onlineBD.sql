-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: tienda_online
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carrito`
--

DROP TABLE IF EXISTS `carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `UsuarioID` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UsuarioID` (`UsuarioID`),
  CONSTRAINT `fk_usuario_carrito` FOREIGN KEY (`UsuarioID`) REFERENCES `usuario` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito`
--

LOCK TABLES `carrito` WRITE;
/*!40000 ALTER TABLE `carrito` DISABLE KEYS */;
INSERT INTO `carrito` VALUES (1,1);
/*!40000 ALTER TABLE `carrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carrito_producto`
--

DROP TABLE IF EXISTS `carrito_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito_producto` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `CarritoID` int DEFAULT NULL,
  `ProductoID` int DEFAULT NULL,
  `Cantidad` int DEFAULT NULL,
  `Talle` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_carrito_carrito_producto` (`CarritoID`),
  KEY `fk_producto_carrito_producto` (`ProductoID`),
  CONSTRAINT `fk_carrito_carrito_producto` FOREIGN KEY (`CarritoID`) REFERENCES `carrito` (`ID`),
  CONSTRAINT `fk_producto_carrito_producto` FOREIGN KEY (`ProductoID`) REFERENCES `producto` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito_producto`
--

LOCK TABLES `carrito_producto` WRITE;
/*!40000 ALTER TABLE `carrito_producto` DISABLE KEYS */;
INSERT INTO `carrito_producto` VALUES (9,1,1,1,'S');
/*!40000 ALTER TABLE `carrito_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `descuento`
--

DROP TABLE IF EXISTS `descuento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `descuento` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Codigo` varchar(50) DEFAULT NULL,
  `Descuento` decimal(5,2) DEFAULT NULL,
  `FechaExpiracion` date DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Codigo` (`Codigo`),
  CONSTRAINT `fk_direccion_usuario` FOREIGN KEY (`ID`) REFERENCES `usuario` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `descuento`
--

LOCK TABLES `descuento` WRITE;
/*!40000 ALTER TABLE `descuento` DISABLE KEYS */;
/*!40000 ALTER TABLE `descuento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `direccion`
--

DROP TABLE IF EXISTS `direccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `direccion` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `UsuarioID` int DEFAULT NULL,
  `Direccion` varchar(255) DEFAULT NULL,
  `Ciudad` varchar(100) DEFAULT NULL,
  `Provincia` varchar(100) DEFAULT NULL,
  `CodigoPostal` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `UsuarioID` (`UsuarioID`),
  CONSTRAINT `` FOREIGN KEY (`UsuarioID`) REFERENCES `usuario` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direccion`
--

LOCK TABLES `direccion` WRITE;
/*!40000 ALTER TABLE `direccion` DISABLE KEYS */;
INSERT INTO `direccion` VALUES (1,1,'Av Manuel Navarro 2737','Catamarca','Catamarca','4700'),(2,2,'Av Manuel Navarro 2737','Catamarca','Catamarca','4700');
/*!40000 ALTER TABLE `direccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listadeseos`
--

DROP TABLE IF EXISTS `listadeseos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listadeseos` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `UsuarioID` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_usuario_listadeseos` (`UsuarioID`),
  CONSTRAINT `fk_usuario_listadeseos` FOREIGN KEY (`UsuarioID`) REFERENCES `usuario` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listadeseos`
--

LOCK TABLES `listadeseos` WRITE;
/*!40000 ALTER TABLE `listadeseos` DISABLE KEYS */;
/*!40000 ALTER TABLE `listadeseos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listadeseos_producto`
--

DROP TABLE IF EXISTS `listadeseos_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listadeseos_producto` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ListaDeseosID` int DEFAULT NULL,
  `ProductoID` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_listadeseos_listadeseos_producto` (`ListaDeseosID`),
  KEY `fk_producto_listadeseos_producto` (`ProductoID`),
  CONSTRAINT `fk_listadeseos_listadeseos_producto` FOREIGN KEY (`ListaDeseosID`) REFERENCES `listadeseos` (`ID`),
  CONSTRAINT `fk_producto_listadeseos_producto` FOREIGN KEY (`ProductoID`) REFERENCES `producto` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listadeseos_producto`
--

LOCK TABLES `listadeseos_producto` WRITE;
/*!40000 ALTER TABLE `listadeseos_producto` DISABLE KEYS */;
/*!40000 ALTER TABLE `listadeseos_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metodopago`
--

DROP TABLE IF EXISTS `metodopago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metodopago` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Tipo` varchar(50) DEFAULT NULL,
  `Detalles` text,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metodopago`
--

LOCK TABLES `metodopago` WRITE;
/*!40000 ALTER TABLE `metodopago` DISABLE KEYS */;
/*!40000 ALTER TABLE `metodopago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opinion`
--

DROP TABLE IF EXISTS `opinion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `opinion` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `UsuarioID` int DEFAULT NULL,
  `ProductoID` int DEFAULT NULL,
  `Calificacion` int DEFAULT NULL,
  `Comentario` text,
  `Fecha` date DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_usuario_opinion` (`UsuarioID`),
  KEY `fk_producto_opinion` (`ProductoID`),
  CONSTRAINT `fk_producto_opinion` FOREIGN KEY (`ProductoID`) REFERENCES `producto` (`ID`),
  CONSTRAINT `fk_usuario_opinion` FOREIGN KEY (`UsuarioID`) REFERENCES `usuario` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opinion`
--

LOCK TABLES `opinion` WRITE;
/*!40000 ALTER TABLE `opinion` DISABLE KEYS */;
/*!40000 ALTER TABLE `opinion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `UsuarioID` int DEFAULT NULL,
  `FechaPedido` date DEFAULT NULL,
  `Estado` varchar(50) DEFAULT NULL,
  `DireccionEnvioID` int DEFAULT NULL,
  `MetodoPagoID` int DEFAULT NULL,
  `DescuentoID` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `UsuarioID` (`UsuarioID`),
  KEY `DireccionEnvioID` (`DireccionEnvioID`),
  KEY `MetodoPagoID` (`MetodoPagoID`),
  KEY `DescuentoID` (`DescuentoID`),
  CONSTRAINT `fk_descuento_pedido` FOREIGN KEY (`DescuentoID`) REFERENCES `descuento` (`ID`),
  CONSTRAINT `fk_direccion_pedido` FOREIGN KEY (`DireccionEnvioID`) REFERENCES `direccion` (`ID`),
  CONSTRAINT `fk_metodopago_pedido` FOREIGN KEY (`MetodoPagoID`) REFERENCES `metodopago` (`ID`),
  CONSTRAINT `fk_usuario_pedido` FOREIGN KEY (`UsuarioID`) REFERENCES `usuario` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_producto`
--

DROP TABLE IF EXISTS `pedido_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido_producto` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `PedidoID` int DEFAULT NULL,
  `ProductoID` int DEFAULT NULL,
  `Cantidad` int DEFAULT NULL,
  `Precio` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_pedido_pedido_producto` (`PedidoID`),
  KEY `fk_producto_pedido_producto` (`ProductoID`),
  CONSTRAINT `fk_pedido_pedido_producto` FOREIGN KEY (`PedidoID`) REFERENCES `pedido` (`ID`),
  CONSTRAINT `fk_producto_pedido_producto` FOREIGN KEY (`ProductoID`) REFERENCES `producto` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_producto`
--

LOCK TABLES `pedido_producto` WRITE;
/*!40000 ALTER TABLE `pedido_producto` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(250) DEFAULT NULL,
  `Descripcion` text,
  `Precio` int DEFAULT NULL,
  `Genero` varchar(10) DEFAULT NULL,
  `ImagenUrl` varchar(300) DEFAULT NULL,
  `Marca` varchar(50) DEFAULT NULL,
  `Tipo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,'Remera Nike Big Swoosh Lbr Hombre','Con la Remera Nike Big Swoosh Lbr Hombre, tus rutinas diarias tienen un nuevo sentido. Confeccionada con algodón supersuave que te brinda confort en cada uso, convirtiéndola en tu remera favorita. Su diseño moderno permite que se adapte a todos tus planes sin importar a donde vayas. Usala y viví en estilo que Nike tiene para vos.',58499,'Hombre','https://res.cloudinary.com/dzxxndbzu/image/upload/v1727584104/yumwm3fftbsqf5k7nkpy.jpg','Nike','Remera'),(2,'Remera Básquet Puma Core Hombre','Dominá la cancha con esta Remera Básquet Puma Core Hombre de algodón transpirable diseñada para un alto rendimiento. Con un ajuste regular pero atlético, harás triples y superarás a los defensores con facilidad. Cuando suene el timbre final, habrás llevado a tu equipo a la victoria.',48999,'Hombre','https://res.cloudinary.com/dzxxndbzu/image/upload/v1727585620/xh0xdinvuwf0rd7qfhvv.jpg','Puma','Remera'),(3,'Remera adidas Flames Concert Hombre Algodón','La Remera adidas Flames Concert Hombre Algodón estará siempre lista para cualquiera de tus aventuras. El llamativo estampado y el tejido de algodón suave le dan la bienvenida a la vida diaria. Holgada y extragrande, la camiseta crea una vibra descomplicada perfecta para pasar el rato con amigos y vivir la vida bajo tus propios términos.',61999,'Hombre','https://res.cloudinary.com/dzxxndbzu/image/upload/v1727585684/nacml2rg6njjdoqkgrzt.jpg','Adidas','Remera'),(4,'Remera Nike Big Swoosh Lbr Hombre','Experimentá la comodidad excepcional la Remera Nike Big Swoosh Lbr Hombre. Su tejido de algodón proporciona una sensación suave y ligera, perfecta para cada día. Diseñada con un ajuste relajado en los hombros, el pecho y el cuerpo, esta remera ofrece una apariencia atlética que se adapta a tu estilo de vida activo. Ideal para usar en capas, esta prenda versátil combina estilo y confort para que te sientas genial en cualquier ocasión. Elevá tu vestuario diario con la calidad y el rendimiento característicos de Nike.',58499,'Hombre','https://res.cloudinary.com/dzxxndbzu/image/upload/v1727585877/b2leh3am7ewcvqljq32y.jpg','Nike','Remera'),(5,'Remera Puma BMW Statement Hombre','La Remera Puma BMW Statement Hombre cuenta con un diseño moderno y detalles de la marca BMW y está confeccionada en algodón para una comodidad elegante.',64999,'Hombre','https://res.cloudinary.com/dzxxndbzu/image/upload/v1727585986/u7isfhinwsvvmf1eamt8.jpg','Puma','Remera'),(6,'Remera adidas Flames Logo para Hombre','Haz una declaración de moda con la Remera adidas Flames Logo Hombre que irradia audacia. Presenta un llamativo diseño con el logo en llamas que cubre todo el Trifolio, ideal para lucir bajo una campera o por sí sola. Fabricada totalmente en algodón y con un corte holgado, te garantiza comodidad en cualquier ocasión. Preparada para destacar, esta remera refleja seguridad y determinación.',50999,'Hombre','https://res.cloudinary.com/dzxxndbzu/image/upload/v1727586039/xddkjzc9c1ogqljefggz.jpg','Adidas','Remera'),(7,'Remera Nike M90 6mo Futura Hombre','Con un diseño clásico e impecable, la Remera Nike M90 6mo Futura Hombre posee un algodón de densidad media que cuenta con un estilo más holgado en los hombros, el pecho y el cuerpo para que puedas moverte y usarla encima de otras prendas con facilidad. Los nuevos gráficos de Nike mantienen tu estilo.',63999,'Hombre','https://res.cloudinary.com/dzxxndbzu/image/upload/v1727586129/t3pbyt4q5b98zjxbk9lu.jpg','Nike','Remera');
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promocion`
--

DROP TABLE IF EXISTS `promocion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promocion` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Descripcion` text,
  `FechaInicio` date DEFAULT NULL,
  `FechaFin` date DEFAULT NULL,
  `Tipo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promocion`
--

LOCK TABLES `promocion` WRITE;
/*!40000 ALTER TABLE `promocion` DISABLE KEYS */;
/*!40000 ALTER TABLE `promocion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `soportecliente`
--

DROP TABLE IF EXISTS `soportecliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `soportecliente` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `UsuarioID` int DEFAULT NULL,
  `Asunto` varchar(255) DEFAULT NULL,
  `Mensaje` text,
  `Fecha` date DEFAULT NULL,
  `Estado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_usuario_soportecliente` (`UsuarioID`),
  CONSTRAINT `fk_usuario_soportecliente` FOREIGN KEY (`UsuarioID`) REFERENCES `usuario` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `soportecliente`
--

LOCK TABLES `soportecliente` WRITE;
/*!40000 ALTER TABLE `soportecliente` DISABLE KEYS */;
/*!40000 ALTER TABLE `soportecliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ProductoID` int DEFAULT NULL,
  `Talle` varchar(10) DEFAULT NULL,
  `Stock` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `ProductoID` (`ProductoID`),
  CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`ProductoID`) REFERENCES `producto` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
INSERT INTO `stock` VALUES (1,1,'S',29),(2,1,'M',35),(3,1,'L',40),(4,1,'XL',35),(5,2,'S',25),(6,2,'M',25),(7,2,'L',30),(8,2,'XL',35),(9,3,'S',20),(10,3,'M',15);
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarjeta`
--

DROP TABLE IF EXISTS `tarjeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarjeta` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `NumTarjeta` varchar(16) NOT NULL,
  `FVencimiento` date NOT NULL,
  `Cvv` int NOT NULL,
  `UsuarioID` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_usuario` (`UsuarioID`),
  CONSTRAINT `fk_usuario` FOREIGN KEY (`UsuarioID`) REFERENCES `usuario` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarjeta`
--

LOCK TABLES `tarjeta` WRITE;
/*!40000 ALTER TABLE `tarjeta` DISABLE KEYS */;
/*!40000 ALTER TABLE `tarjeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(50) DEFAULT NULL,
  `Apellido` varchar(50) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Contrasena` varchar(255) DEFAULT NULL,
  `NombreUsuario` varchar(150) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  `Estado` enum('pendiente','activo') DEFAULT 'pendiente',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Maximiliano','Bazan','fmbazan@institutosanmartin.edu.ar','1234','MaxiBazan1',NULL,NULL,'activo'),(2,'Felix','Bazan','bazanmaximiliano15@gmail.com','123','FxBazan',NULL,NULL,'activo');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-01 22:40:15
