-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3307
-- Generation Time: Feb 09, 2026 at 07:22 AM
-- Server version: 5.7.33
-- PHP Version: 7.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `2025_ecommerce_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`) VALUES
(1, 'Electronics', 'electronics'),
(2, 'Clothing', 'Clothing'),
(3, 'Food', 'Food'),
(4, 'Drinks', 'Drinks'),
(12, 'Sports', 'sports'),
(14, 'Books', 'books'),
(15, 'Home & Garden', 'home-garden'),
(16, 'Sports & Outdoors', 'sports-outdoors'),
(17, 'Toys & Games', 'toys-games'),
(18, 'Food & Beverages', 'food-beverages'),
(19, 'Health & Beauty', 'health-beauty');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `products` text NOT NULL,
  `totalAmount` decimal(10,0) NOT NULL,
  `shippingAddress` varchar(255) NOT NULL,
  `paymentMethod` varchar(255) NOT NULL DEFAULT 'COD',
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `products`, `totalAmount`, `shippingAddress`, `paymentMethod`, `status`, `createdAt`, `updatedAt`, `userId`) VALUES
(1, '[{\"product\":{\"id\":1,\"name\":\"Tshirt\",\"price\":\"100\"},\"quantity\":1,\"price\":\"100\"}]', '100', 'THimi', 'COD', 'shipped', '2026-01-20 08:06:38', '2026-01-20 11:32:46', 1),
(2, '[{\"product\":{\"id\":2,\"name\":\"Shirt\",\"price\":\"100\"},\"quantity\":4,\"price\":\"100\"}]', '400', 'THimi', 'COD', 'shipped', '2026-01-20 08:09:46', '2026-01-20 11:32:50', 2),
(3, '[{\"product\":{\"id\":1,\"name\":\"Tshirt\",\"price\":\"100\"},\"quantity\":1,\"price\":\"100\"}]', '100', '123 Main St, City', 'COD', 'shipped', '2026-01-20 08:14:16', '2026-01-20 11:32:51', 1),
(4, '[{\"product\":{\"id\":1,\"name\":\"Tshirt\",\"price\":\"100\",\"images\":\"https://picsum.photos/200/300\"},\"quantity\":1,\"price\":\"100\"}]', '100', 'THimi', 'COD', 'processing', '2026-01-20 08:45:34', '2026-01-20 11:32:54', 1),
(5, '[{\"product\":{\"id\":1,\"name\":\"Tshirt\",\"price\":\"100\",\"images\":\"https://picsum.photos/200/300\"},\"quantity\":2,\"price\":\"100\"}]', '200', 'THimi', 'COD', 'processing', '2026-01-20 09:04:52', '2026-01-20 11:32:53', 2),
(6, '[{\"product\":{\"id\":1,\"name\":\"Tshirt\",\"price\":\"100\",\"images\":\"https://picsum.photos/200/300\"},\"quantity\":4,\"price\":\"100\"}]', '400', 'THimi', 'COD', 'shipped', '2026-01-20 09:08:47', '2026-01-20 11:44:08', 1);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `stock` int(11) NOT NULL,
  `images` text,
  `categoryId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `stock`, `images`, `categoryId`) VALUES
(1, 'Tshirt', 'tshirt', ' this is short description', '100', 4, 'https://picsum.photos/200/300', 1),
(2, 'Shirt', 'shirt', ' this is description for shirt edye', '100', 10, 'https://picsum.photos/200', 3),
(3, 'Wireless Bluetooth Headphones', 'wireless-bluetooth-headphones', 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.', '100', 50, 'headphones-1.jpg,headphones-2.jpg', 1),
(4, 'Smartphone 128GB', 'smartphone-128gb', 'Latest generation smartphone with 128GB storage, dual camera system, and fast charging capability.', '600', 30, 'phone-1.jpg,phone-2.jpg', 1),
(5, 'Laptop Stand Aluminum', 'laptop-stand-aluminum', 'Ergonomic aluminum laptop stand that improves posture and provides better airflow for your laptop.', '50', 75, 'stand-1.jpg', 1),
(6, 'Running Shoes', 'running-shoes', 'Lightweight running shoes with cushioned sole and breathable mesh upper. Perfect for daily runs.', '90', 45, 'shoes-1.jpg,shoes-2.jpg', 16),
(7, 'JavaScript: The Definitive Guide', 'javascript-definitive-guide', 'Comprehensive guide to JavaScript programming. Covers ES6+ features and modern web development.', '50', 25, 'book-js.jpg', 14),
(8, 'Clean Code: A Handbook', 'clean-code-handbook', 'Learn how to write clean, maintainable code. Essential reading for every developer.', '40', 30, 'book-clean.jpg', 14),
(9, 'Coffee Maker', 'coffee-maker', 'Programmable coffee maker with 12-cup capacity and auto-shutoff feature.', '70', 40, 'coffee-1.jpg', 15),
(10, 'Yoga Mat Premium', 'yoga-mat-premium', 'Non-slip yoga mat with extra cushioning. Perfect for yoga, pilates, and exercise routines.', '35', 55, 'mat-1.jpg', 16),
(11, 'Board Game Collection', 'board-game-collection', 'Family-friendly board game collection with 5 popular games. Hours of fun for all ages.', '60', 20, '1768988062084-788818537.png', 17),
(12, 'Organic Green Tea', 'organic-green-tea', 'Premium organic green tea leaves. Rich in antioxidants and naturally caffeine-free.', '20', 80, 'tea-1.jpg', 18),
(13, 'Face Moisturizer', 'face-moisturizer', 'Hydrating face moisturizer with SPF 30. Suitable for all skin types.', '30', 65, 'moisturizer-1.jpg', 19),
(14, 'Wireless Mouse', 'wireless-mouse', 'Ergonomic wireless mouse with precision tracking and long battery life.', '25', 90, 'mouse-1.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `address`, `phone`, `role`) VALUES
(1, 'Suja', 'suja@test.com', '$2a$10$a4GVNX5HcC3g6iQWoDbcUej1zbYdcJusFEKbNNm6ZxqEaqnxL3u2.', '123 Main St, City', '123-456-7890', 'admin'),
(2, 'Sanjay Prajapati', 'snj@gmail.com', '$2a$10$8uyLrNnG97UMCtZGTzFqke3KTVUXrOcXhjT6TDfF8qVruOWWVV1PO', 'THimi', '9841670255', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_420d9f679d41281f282f5bc7d0` (`slug`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_151b79a83ba240b0cb31b2302d1` (`userId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_464f927ae360106b783ed0b410` (`slug`),
  ADD KEY `FK_ff56834e735fa78a15d0cf21926` (`categoryId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `FK_151b79a83ba240b0cb31b2302d1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `FK_ff56834e735fa78a15d0cf21926` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
