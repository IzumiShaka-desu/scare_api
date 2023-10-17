-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Oct 15, 2023 at 07:09 AM
-- Server version: 5.7.34
-- PHP Version: 7.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rentaldb`
--

DELIMITER $$
--
-- Functions
--
CREATE DEFINER=`root`@`localhost` FUNCTION `geodistkm` (`lat1` DOUBLE, `lon1` DOUBLE, `lat2` DOUBLE, `lon2` DOUBLE) RETURNS FLOAT BEGIN
 DECLARE pi, q1, q2, q3 DOUBLE;
 DECLARE rads FLOAT DEFAULT 0;
 SET pi = PI();
 SET lat1 = lat1 * pi / 180;
 SET lon1 = lon1 * pi / 180;
 SET lat2 = lat2 * pi / 180;
 SET lon2 = lon2 * pi / 180;
 SET q1 = COS(lon1-lon2);
 SET q2 = COS(lat1-lat2);
 SET q3 = COS(lat1+lat2);
 SET rads = ACOS( 0.5*((1.0+q1)*q2 - (1.0-q1)*q3) ); 
 RETURN 6378.388 * rads;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `geodistkms` (`lat1` DOUBLE, `lon1` DOUBLE, `lat2` DOUBLE, `lon2` DOUBLE) RETURNS DOUBLE BEGIN
 DECLARE pi, q1, q2, q3 DOUBLE;
 DECLARE rads DOUBLE DEFAULT 0;
 SET pi = PI();
 SET lat1 = lat1 * pi / 180;
 SET lon1 = lon1 * pi / 180;
 SET lat2 = lat2 * pi / 180;
 SET lon2 = lon2 * pi / 180;
 SET q1 = COS(lon1-lon2);
 SET q2 = COS(lat1-lat2);
 SET q3 = COS(lat1+lat2);
 SET rads = ACOS( 0.5*((1.0+q1)*q2 - (1.0-q1)*q3) ); 
 RETURN 6378.388 * rads;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `geodistm` (`lat1` DOUBLE, `lon1` DOUBLE, `lat2` DOUBLE, `lon2` DOUBLE) RETURNS DOUBLE BEGIN
 DECLARE pi, q1, q2, q3 DOUBLE;
 DECLARE rads DOUBLE DEFAULT 0;
 SET pi = PI();
 SET lat1 = lat1 * pi / 180;
 SET lon1 = lon1 * pi / 180;
 SET lat2 = lat2 * pi / 180;
 SET lon2 = lon2 * pi / 180;
 SET q1 = COS(lon1-lon2);
 SET q2 = COS(lat1-lat2);
 SET q3 = COS(lat1+lat2);
 SET rads = ACOS( 0.5*((1.0+q1)*q2 - (1.0-q1)*q3) ); 
 RETURN 6378140 * rads;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `geodistms` (`lat1` DOUBLE, `lon1` DOUBLE, `lat2` DOUBLE, `lon2` DOUBLE) RETURNS DOUBLE BEGIN
 DECLARE pi, q1, q2, q3 DOUBLE;
 DECLARE rads DOUBLE DEFAULT 0;
 SET pi = PI();
 SET lat1 = lat1 * pi / 180;
 SET lon1 = lon1 * pi / 180;
 SET lat2 = lat2 * pi / 180;
 SET lon2 = lon2 * pi / 180;
 SET q1 = COS(lon1-lon2);
 SET q2 = COS(lat1-lat2);
 SET q3 = COS(lat1+lat2);
 SET rads = ACOS( 0.5*((1.0+q1)*q2 - (1.0-q1)*q3) ); 
 RETURN 6378140 * rads;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `chatrooms`
--

CREATE TABLE `chatrooms` (
  `id_room` int(11) NOT NULL,
  `members` json NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `chatrooms`
--

INSERT INTO `chatrooms` (`id_room`, `members`, `createdAt`, `updatedAt`) VALUES
(3, '[4, 3]', '2023-09-26 15:25:31', '2023-09-26 15:25:31'),
(6, '[3, 4]', '2023-09-26 15:31:50', '2023-09-26 15:31:50'),
(11, '[4, 6]', '2023-10-01 15:22:47', '2023-10-01 15:22:47'),
(12, '[3, 6]', '2023-10-03 03:35:46', '2023-10-03 03:35:46');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id_message` int(11) NOT NULL,
  `id_room` int(11) NOT NULL,
  `message` varchar(900) NOT NULL,
  `id_sender` int(11) NOT NULL,
  `sent_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id_message`, `id_room`, `message`, `id_sender`, `sent_at`, `createdAt`, `updatedAt`) VALUES
(1, 3, 'halooooo', 3, '2023-09-27 02:40:32', '2023-09-27 02:40:32', '2023-09-27 02:40:32'),
(2, 3, 'halooooo', 3, '2023-09-27 02:42:26', '2023-09-27 02:42:26', '2023-09-27 02:42:26'),
(3, 3, 'halooooo', 3, '2023-09-27 02:42:55', '2023-09-27 02:42:55', '2023-09-27 02:42:55'),
(4, 3, 'halooooo', 3, '2023-09-27 02:44:20', '2023-09-27 02:44:20', '2023-09-27 02:44:20'),
(5, 3, 'halooooo', 3, '2023-09-27 02:45:04', '2023-09-27 02:45:04', '2023-09-27 02:45:04'),
(6, 3, 'halooooo', 3, '2023-09-27 02:45:39', '2023-09-27 02:45:39', '2023-09-27 02:45:39'),
(7, 3, 'halooooo', 3, '2023-09-27 02:47:34', '2023-09-27 02:47:34', '2023-09-27 02:47:34'),
(8, 3, 'halooooo', 3, '2023-09-27 02:48:11', '2023-09-27 02:48:11', '2023-09-27 02:48:11'),
(9, 3, 'halooooo', 3, '2023-09-27 02:49:00', '2023-09-27 02:49:00', '2023-09-27 02:49:00'),
(10, 3, 'halooooo', 4, '2023-09-27 03:16:23', '2023-09-27 03:16:23', '2023-09-27 03:16:23'),
(11, 3, 'halooooo 2222', 4, '2023-09-27 03:16:36', '2023-09-27 03:16:36', '2023-09-27 03:16:36'),
(17, 11, 'halo kak', 6, '2023-10-01 15:22:47', '2023-10-01 15:22:47', '2023-10-01 15:22:47'),
(18, 11, 'halo kak', 6, '2023-10-01 15:28:41', '2023-10-01 15:28:41', '2023-10-01 15:28:41'),
(19, 11, 'halo kak', 6, '2023-10-01 15:28:43', '2023-10-01 15:28:43', '2023-10-01 15:28:43'),
(20, 11, 'halo kak', 6, '2023-10-01 15:28:44', '2023-10-01 15:28:44', '2023-10-01 15:28:44'),
(21, 11, 'halo kak', 6, '2023-10-01 15:28:44', '2023-10-01 15:28:44', '2023-10-01 15:28:44'),
(22, 11, 'halo kak', 6, '2023-10-01 15:28:45', '2023-10-01 15:28:45', '2023-10-01 15:28:45'),
(23, 11, 'halo kak', 6, '2023-10-01 15:28:45', '2023-10-01 15:28:45', '2023-10-01 15:28:45'),
(24, 11, 'halo kak', 6, '2023-10-01 15:28:46', '2023-10-01 15:28:46', '2023-10-01 15:28:46'),
(25, 11, 'halo kak', 6, '2023-10-02 09:21:45', '2023-10-02 09:21:45', '2023-10-02 09:21:45'),
(26, 11, 'plessss kak jawa', 6, '2023-10-02 09:23:34', '2023-10-02 09:23:34', '2023-10-02 09:23:34'),
(27, 11, 'plssss', 6, '2023-10-02 09:23:50', '2023-10-02 09:23:50', '2023-10-02 09:23:50'),
(28, 11, 'plssssssssssssssssssss', 6, '2023-10-02 09:24:14', '2023-10-02 09:24:13', '2023-10-02 09:24:13'),
(29, 11, 'kakkkkkkkkkkk', 6, '2023-10-02 09:24:31', '2023-10-02 09:24:31', '2023-10-02 09:24:31'),
(30, 12, 'halo kak', 6, '2023-10-03 03:35:46', '2023-10-03 03:35:46', '2023-10-03 03:35:46'),
(31, 11, 'halo kak', 6, '2023-10-03 03:39:00', '2023-10-03 03:39:00', '2023-10-03 03:39:00');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id_review` int(11) NOT NULL,
  `comment` varchar(30) NOT NULL,
  `rating` double NOT NULL,
  `id_transaction` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id_review`, `comment`, `rating`, `id_transaction`, `createdAt`, `updatedAt`) VALUES
(1, 'good choice', 5, 1, '2023-09-27 04:10:53', '2023-09-27 04:10:53'),
(3, 'mantap', 5, 7, '2023-10-03 03:33:33', '2023-10-03 03:33:33'),
(4, 'kerennnnn', 5, 9, '2023-10-03 03:39:43', '2023-10-03 03:39:43');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id_transaction` int(11) NOT NULL,
  `id_vehicle` int(11) NOT NULL,
  `id_renter` int(11) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `status` enum('booked','rented','returned','canceled') NOT NULL DEFAULT 'booked',
  `total_price` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id_transaction`, `id_vehicle`, `id_renter`, `start_date`, `end_date`, `status`, `total_price`, `createdAt`, `updatedAt`) VALUES
(1, 2, 4, '2023-09-26 12:55:46', '2023-09-26 12:55:46', 'rented', 160000, '2023-09-26 12:57:39', '2023-09-27 04:08:08'),
(2, 4, 3, '2023-09-26 12:55:46', '2023-09-26 12:55:46', 'booked', 160000, '2023-09-30 05:28:37', '2023-09-30 05:28:37'),
(3, 5, 6, '2023-10-02 08:34:43', '2023-10-03 08:34:43', 'canceled', 80000, '2023-10-01 08:39:08', '2023-10-01 09:55:10'),
(4, 4, 6, '2023-10-02 08:34:43', '2023-10-03 08:34:43', 'canceled', 80000, '2023-10-01 10:00:53', '2023-10-01 10:01:33'),
(5, 4, 6, '2023-10-02 08:34:43', '2023-10-03 08:34:43', 'canceled', 80000, '2023-10-01 10:02:52', '2023-10-01 10:03:43'),
(6, 5, 6, '2023-10-02 08:34:43', '2023-10-03 08:34:43', 'canceled', 80000, '2023-10-01 11:00:07', '2023-10-01 11:04:00'),
(7, 4, 6, '2023-10-02 08:34:43', '2023-10-03 08:34:43', 'returned', 80000, '2023-10-01 11:04:10', '2023-10-01 11:08:10'),
(8, 4, 6, '2023-10-02 08:34:43', '2023-10-03 08:34:43', 'booked', 80000, '2023-10-01 11:08:19', '2023-10-01 11:08:19'),
(9, 5, 6, '2023-10-02 17:00:00', '2023-10-04 17:00:00', 'returned', 160000, '2023-10-03 03:35:31', '2023-10-03 03:35:54'),
(10, 4, 6, '2023-10-02 17:00:00', '2023-10-05 17:00:00', 'canceled', 240000, '2023-10-03 03:38:46', '2023-10-03 03:39:27');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id_user` int(11) NOT NULL,
  `level` enum('admin','user') NOT NULL DEFAULT 'user',
  `email` varchar(50) NOT NULL,
  `phone` varchar(16) NOT NULL,
  `name` varchar(25) NOT NULL,
  `password` varchar(260) NOT NULL,
  `profile-photo` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id_user`, `level`, `email`, `phone`, `name`, `password`, `profile-photo`, `createdAt`, `updatedAt`) VALUES
(3, 'user', 's@m.com', '9824089', 'akashaka', '$2a$10$KOEscr/zAMKY7k7CECILyeRxXixY3nC7YVTJn2t2KWhOVhi2erehi', NULL, '2023-09-30 11:00:46', '2023-09-26 05:25:42'),
(4, 'user', 'sa@m.com', '9824089', 'nemu', '$2a$10$THc.rS/DMrfOb2x9Jv5AvO1i5Uy5HsNUDakyvLaRW6XGuRSDi76lm', NULL, '2023-09-30 11:00:57', '2023-09-26 12:23:43'),
(5, 'user', 'n@m.com', '64234', 'nawa', '$2a$10$WVfm1dyAd98O9jOIwRSi.eIBUd5jogCOi97v9AxXWIMHidloa7xIO', NULL, '2023-09-30 23:46:31', '2023-09-30 23:46:31'),
(6, 'user', 'na@m.com', '64235', 'nawa w', '$2a$10$r4/ARlX8CPE7jiSiF.5tKeTNceapUpNr0mcyAnbI0eZ.mONLB7NQ.', NULL, '2023-09-30 23:51:58', '2023-09-30 23:51:58');

-- --------------------------------------------------------

--
-- Table structure for table `Vehicles`
--

CREATE TABLE `Vehicles` (
  `id_vehicle` int(11) NOT NULL,
  `id_owner` int(11) NOT NULL,
  `brand` varchar(15) NOT NULL,
  `name` varchar(25) NOT NULL,
  `description` varchar(64) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `images` json NOT NULL,
  `status` enum('available','not available') NOT NULL DEFAULT 'available',
  `type` varchar(25) NOT NULL,
  `price` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Vehicles`
--

INSERT INTO `Vehicles` (`id_vehicle`, `id_owner`, `brand`, `name`, `description`, `latitude`, `longitude`, `images`, `status`, `type`, `price`, `createdAt`, `updatedAt`) VALUES
(2, 3, ' Honda', ' supra X', ' description honda suprafit garang', -6.376974, 105.828506, '[\"uploads/supra-removebg-preview 1 (2) (1).png\", \"uploads/supra-removebg-preview 1 (2).png\", \"uploads/supra-removebg-preview 1.png\", \"uploads/suprax.png\"]', 'not available', ' Classic', 80000, '2023-09-26 12:20:04', '2023-09-27 04:08:08'),
(4, 4, ' Honda', ' supra fit', ' description honda suprafit garang', 1.054507, 104.00412, '[\"uploads/supra-removebg-preview 1 (2) (1).png\", \"uploads/supra-removebg-preview 1 (2).png\", \"uploads/supra-removebg-preview 1.png\", \"uploads/suprax.png\"]', 'available', ' Classic', 80000, '2023-09-26 12:26:05', '2023-09-26 12:26:05'),
(5, 3, ' Honda', ' supra fit', ' description honda suprafit garang', -6.16672, 106.8282843, '[\"uploads/supra-removebg-preview 1 (2) (1).png\", \"uploads/supra-removebg-preview 1 (2).png\"]', 'available', ' Classic', 80000, '2023-10-01 02:59:24', '2023-10-01 02:59:24'),
(6, 6, 'Honda', 'beat', 'Loren ipsum dolor sit amet elit wags nawa me gum in arc wizrdo', -6.166489, -6.166489, '[\"uploads/beat-1696244103422.png\", \"uploads/beat-1696244103425.png\", \"uploads/beat-1696260307535.png\"]', 'available', 'classic', 70000, '2023-10-02 10:55:03', '2023-10-02 15:25:07'),
(7, 6, 'Honda', 'beat', 'Loren ipsum dolor sit amet elit wags nawa me gum in arc wizrdo', -6.166489, -6.166489, '[\"uploads/beat-1696244237046.png\", \"uploads/beat-1696244237047.png\"]', 'available', 'classic', 70000, '2023-10-02 10:57:17', '2023-10-02 10:57:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chatrooms`
--
ALTER TABLE `chatrooms`
  ADD PRIMARY KEY (`id_room`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id_message`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id_review`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id_transaction`),
  ADD UNIQUE KEY `id_transaction` (`id_transaction`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id_user`);

--
-- Indexes for table `Vehicles`
--
ALTER TABLE `Vehicles`
  ADD PRIMARY KEY (`id_vehicle`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chatrooms`
--
ALTER TABLE `chatrooms`
  MODIFY `id_room` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id_message` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id_review` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id_transaction` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Vehicles`
--
ALTER TABLE `Vehicles`
  MODIFY `id_vehicle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
