-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 30, 2020 at 09:09 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.2.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cinema`
--

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

CREATE TABLE `movies` (
  `movie_id` int(11) NOT NULL,
  `movie_title` varchar(255) DEFAULT NULL,
  `showtimes` time DEFAULT NULL,
  `genre` varchar(255) DEFAULT NULL,
  `ownerlogin` varchar(50) NOT NULL,
  `status` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`movie_id`, `movie_title`, `showtimes`, `genre`, `ownerlogin`, `status`) VALUES
(6, 'Mulan', '13:24:00', 'Comedy', 'hanisa', 0),
(8, 'Snow White', '14:00:00', 'Drama', 'hanisa', 1),
(10, 'The Three Musketeers', '19:50:00', 'Comedy', 'hanisa', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `login` varchar(50) NOT NULL,
  `password` varchar(250) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(250) NOT NULL,
  `mobileno` varchar(15) NOT NULL,
  `photo` varchar(150) NOT NULL DEFAULT 'default.png',
  `addeddate` datetime NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'member'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `login`, `password`, `name`, `email`, `mobileno`, `photo`, `addeddate`, `role`) VALUES
(1, 'hanisa', '$2y$10$4Rm62ahHbnhoFwSj9w1vNOx4uWCUyXcKuRlF2GjtCHf304Xks7vO.', 'Nurhanisa', 'hanisa@gmail.com', '01234567890', 'default.png', '2020-06-29 22:52:47', 'admin'),
(2, 'zara', '$2y$10$/H3v7MMfYMHvAZYAkk9RNO56FEasKrmziEfFyPhZlrPj2iS0j5ETi', 'Rafiqah', 'r@gmail.com', '011226373442', 'default.png', '2020-06-29 22:59:54', 'member'),
(5, 'qud12', '$2y$10$p82HAXgEjpzx16AhWJga3u9/ilY9fEpWkNtOHNdMI9qrs2hjsBapy', '', 'q@gmail.com', '', 'default.png', '2020-06-30 00:51:47', 'member');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`movie_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`login`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `movies`
--
ALTER TABLE `movies`
  MODIFY `movie_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
