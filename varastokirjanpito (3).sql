-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 25.03.2020 klo 10:52
-- Palvelimen versio: 5.7.26
-- PHP Version: 7.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `varastokirjanpito`
--

-- --------------------------------------------------------

--
-- Rakenne taululle `sijainti`
--

DROP TABLE IF EXISTS `sijainti`;
CREATE TABLE IF NOT EXISTS `sijainti` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `nimi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Vedos taulusta `sijainti`
--

INSERT INTO `sijainti` (`ID`, `nimi`) VALUES
(1, 'Puutavara'),
(2, 'Työkaluvarasto'),
(3, 'Metallitavara'),
(4, 'Ruuvit'),
(5, 'Maalit'),
(6, 'Muut');

-- --------------------------------------------------------

--
-- Rakenne taululle `varasto_melalahti`
--

DROP TABLE IF EXISTS `varasto_melalahti`;
CREATE TABLE IF NOT EXISTS `varasto_melalahti` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `nimi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `maara` int(11) NOT NULL,
  `yksikkotyyppi_ID` int(11) NOT NULL,
  `yksikkohinta` double NOT NULL,
  `saldo` double NOT NULL,
  `sijainti_ID` int(11) NOT NULL,
  `kommentit` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `yksikkotyyppi_ID` (`yksikkotyyppi_ID`),
  KEY `sijainti_ID` (`sijainti_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Vedos taulusta `varasto_melalahti`
--

INSERT INTO `varasto_melalahti` (`ID`, `nimi`, `maara`, `yksikkotyyppi_ID`, `yksikkohinta`, `saldo`, `sijainti_ID`, `kommentit`) VALUES
(2, 'porakone', 2, 2, 150, 300, 2, ''),
(3, 'vasara', 10, 2, 10, 100, 2, ''),
(4, 'saha', 2, 2, 2, 4, 2, '');

-- --------------------------------------------------------

--
-- Rakenne taululle `varasto_riistavesi`
--

DROP TABLE IF EXISTS `varasto_riistavesi`;
CREATE TABLE IF NOT EXISTS `varasto_riistavesi` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `nimi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `maara` int(11) NOT NULL,
  `yksikkotyyppi_ID` int(11) NOT NULL,
  `yksikkohinta` double NOT NULL,
  `saldo` double NOT NULL,
  `sijainti_ID` int(11) NOT NULL,
  `kommentit` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `yksikkotyyppi_ID` (`yksikkotyyppi_ID`),
  KEY `sijainti_ID` (`sijainti_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Vedos taulusta `varasto_riistavesi`
--

INSERT INTO `varasto_riistavesi` (`ID`, `nimi`, `maara`, `yksikkotyyppi_ID`, `yksikkohinta`, `saldo`, `sijainti_ID`, `kommentit`) VALUES
(2, 'porakone', 2, 2, 150, 300, 2, ''),
(3, 'vasara', 10, 2, 10, 100, 2, ''),
(4, 'saha', 2, 2, 2, 4, 2, ''),
(5, 'Sahattu 20x100', 100, 1, 0.9, 90, 1, 'Mänty');

-- --------------------------------------------------------

--
-- Rakenne taululle `yksikkotyyppi`
--

DROP TABLE IF EXISTS `yksikkotyyppi`;
CREATE TABLE IF NOT EXISTS `yksikkotyyppi` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `nimi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Vedos taulusta `yksikkotyyppi`
--

INSERT INTO `yksikkotyyppi` (`ID`, `nimi`) VALUES
(1, 'm'),
(2, 'kpl');

--
-- Rajoitteet vedostauluille
--

--
-- Rajoitteet taululle `varasto_riistavesi`
--
ALTER TABLE `varasto_riistavesi`
  ADD CONSTRAINT `sijainti_ID` FOREIGN KEY (`sijainti_ID`) REFERENCES `sijainti` (`ID`),
  ADD CONSTRAINT `yksikkotyyppi_ID` FOREIGN KEY (`yksikkotyyppi_ID`) REFERENCES `yksikkotyyppi` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
