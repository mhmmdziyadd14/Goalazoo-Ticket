-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for matchticket_db
CREATE DATABASE IF NOT EXISTS `matchticket_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `matchticket_db`;

-- Dumping structure for table matchticket_db.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table matchticket_db.categories: ~4 rows (approximately)
INSERT INTO `categories` (`id`, `name`, `description`, `created_at`) VALUES
	(1, 'Premier League', NULL, '2025-06-10 07:14:30'),
	(2, 'Liga 1', NULL, '2025-06-10 07:14:30'),
	(3, 'Liga Champions', NULL, '2025-06-10 07:14:30'),
	(4, 'FA Cup', 'wfefea', '2025-06-10 07:14:30'),
	(5, 'AFC 2', 'Kompetisi tingkat 2 di asia.', '2025-06-10 07:36:23');

-- Dumping structure for table matchticket_db.events
CREATE TABLE IF NOT EXISTS `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text,
  `date` datetime NOT NULL,
  `location` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `team1_name` varchar(100) NOT NULL DEFAULT 'Tim 1',
  `team2_name` varchar(100) NOT NULL DEFAULT 'Tim 2',
  `team1_logo_url` varchar(255) DEFAULT NULL,
  `team2_logo_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table matchticket_db.events: ~0 rows (approximately)
INSERT INTO `events` (`id`, `description`, `date`, `location`, `created_at`, `team1_name`, `team2_name`, `team1_logo_url`, `team2_logo_url`) VALUES
	(3, 'big match', '2025-06-29 22:00:00', 'GBLA Stadium', '2025-06-04 11:31:44', 'Persib Bandung', 'Manchester United', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCuxrxSR3HJVPGDfEZKnWsT_KYwExwzefU3Q&s', 'https://icon2.cleanpng.com/20171220/lyq/avj1f2i0v.webp'),
	(4, '', '2025-06-30 11:30:00', 'GBLA', '2025-06-14 03:51:57', 'Persib Bandung', 'Persis Solo', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCuxrxSR3HJVPGDfEZKnWsT_KYwExwzefU3Q&s', 'https://logowik.com/content/uploads/images/persis-solo3902.logowik.com.webp');

-- Dumping structure for table matchticket_db.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  `quantity` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','paid','cancelled') DEFAULT 'pending',
  `tribune_id` int DEFAULT NULL,
  `booking_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_code` (`booking_code`),
  KEY `user_id` (`user_id`),
  KEY `event_id` (`event_id`),
  KEY `fk_tribune_id` (`tribune_id`),
  CONSTRAINT `fk_tribune_id` FOREIGN KEY (`tribune_id`) REFERENCES `tribunes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table matchticket_db.orders: ~1 rows (approximately)
INSERT INTO `orders` (`id`, `user_id`, `event_id`, `quantity`, `total_price`, `order_date`, `status`, `tribune_id`, `booking_code`) VALUES
	(12, 2, 3, 1, 120000.00, '2025-06-13 13:01:30', 'paid', 7, NULL);

-- Dumping structure for table matchticket_db.tribunes
CREATE TABLE IF NOT EXISTS `tribunes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `available_seats` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `event_id` (`event_id`,`name`),
  CONSTRAINT `tribunes_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table matchticket_db.tribunes: ~4 rows (approximately)
INSERT INTO `tribunes` (`id`, `event_id`, `name`, `price`, `available_seats`, `created_at`) VALUES
	(6, 3, 'Timur', 120000.00, 12000, '2025-06-04 11:33:11'),
	(7, 3, 'Selatan', 120000.00, 9999, '2025-06-04 11:34:06'),
	(8, 3, 'Utara', 120000.00, 10000, '2025-06-04 11:34:28'),
	(9, 3, 'VBU & VBS', 150000.00, 80000, '2025-06-04 11:34:57'),
	(10, 3, 'Barat Atas', 150000.00, 2001, '2025-06-04 11:35:15');

-- Dumping structure for table matchticket_db.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table matchticket_db.users: ~5 rows (approximately)
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES
	(1, 'admin_user', 'admin@example.com', 'admin_password', 'admin', '2025-06-04 05:00:46'),
	(2, 'normal_user', 'user@example.com', 'user_password', 'user', '2025-06-04 05:00:46'),
	(3, 'ziyad14', 'ziyad@gmail.com', 'ziyad123', 'admin', '2025-06-04 05:27:55'),
	(4, 'Ramdhan Rullyansyah', 'Ramdhan@gmail.com', '112233344', 'user', '2025-06-05 12:49:31'),
	(5, 'dden', 'dden@gmail.com', '11223344', 'user', '2025-06-05 12:50:13'),
	(6, 'mamang21', 'mamang@g.com', 'mamang_216', 'user', '2025-06-05 13:02:26'),
	(7, 'tio', 'tioazza@gmail.com', 'tio123', 'user', '2025-06-05 16:04:03'),
	(8, 'aqil', 'aqil@gmail.com', '12345678', 'user', '2025-06-10 07:58:03'),
	(9, 'Muhammad Ziyad', 'muhammadziyad810@gmail.com', 'jiyadun810', 'user', '2025-06-13 16:15:52');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
