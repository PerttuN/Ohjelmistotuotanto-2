-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 22.04.2020 klo 14:55
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
CREATE DATABASE IF NOT EXISTS `varastokirjanpito` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `varastokirjanpito`;

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
(5, 'Maalit ja lakat'),
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Vedos taulusta `varasto_melalahti`
--

INSERT INTO `varasto_melalahti` (`ID`, `nimi`, `maara`, `yksikkotyyppi_ID`, `yksikkohinta`, `saldo`, `sijainti_ID`, `kommentit`) VALUES
(2, 'Porakone', 5, 2, 120, 600, 2, ''),
(6, 'Sahattu 20X100', 100, 1, 0.8, 80, 1, ''),
(7, 'Sahattu 22X125', 20, 1, 1.16, 23.2, 1, 'Kuusi'),
(9, 'Höylätty 18X95', 20, 1, 1.3, 26, 1, ''),
(10, 'Yleis Uppokanta 4,0X20', 10, 2, 3.95, 39.5, 4, '20 kpl/pkt'),
(11, 'Helmi 30 Remonttimaali', 3, 2, 20, 60, 5, '0,9L/kpl valkoinen'),
(12, 'Vasara', 10, 2, 15, 150, 2, '');

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
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Vedos taulusta `varasto_riistavesi`
--

INSERT INTO `varasto_riistavesi` (`ID`, `nimi`, `maara`, `yksikkotyyppi_ID`, `yksikkohinta`, `saldo`, `sijainti_ID`, `kommentit`) VALUES
(3, 'Vasara', 12, 2, 10, 120, 2, ''),
(5, 'Sahattu 20x100', 100, 1, 0.9, 90, 1, 'Mänty'),
(47, 'Ruuvimeisseli', 12, 2, 10, 120, 2, ''),
(48, 'Sahattu 22X125', 20, 1, 1.16, 23.2, 1, 'Kuusi'),
(49, 'Höylätty 18X95', 30, 1, 1.26, 37.8, 1, 'Kuusi'),
(50, 'Yleis Uppokanta 4,0X20', 10, 2, 3.95, 39.5, 4, '20kpl/pkt'),
(51, 'Yleis Kupukanta 5X80', 10, 2, 26.95, 269.5, 4, '200kpl/pkt'),
(52, 'Helmi 30 Kalustemaali', 3, 2, 30.95, 92.85, 5, '0,9L/kpl Valkoinen'),
(53, 'Helmi 30 Kalustemaali', 2, 2, 17.95, 35.9, 5, '0,3 L/kpl Sininen'),
(54, 'Porakone Bosch', 3, 2, 150, 450, 2, '12V'),
(55, 'Käsisaha', 5, 2, 7.95, 39.75, 2, ''),
(56, 'Rautasaha', 5, 2, 9.95, 49.75, 2, ''),
(57, 'Kuulonsuojain Peltor', 5, 2, 12.95, 64.75, 6, ''),
(58, 'Suojalasit kirkas', 10, 2, 12.95, 129.5, 6, ''),
(59, 'Akseliteräs 6mm', 20, 1, 2.59, 51.8, 3, '');

-- --------------------------------------------------------

--
-- Rakenne taululle `yksikkotyyppi`
--

DROP TABLE IF EXISTS `yksikkotyyppi`;
CREATE TABLE IF NOT EXISTS `yksikkotyyppi` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `nimi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Vedos taulusta `yksikkotyyppi`
--

INSERT INTO `yksikkotyyppi` (`ID`, `nimi`) VALUES
(1, 'm'),
(2, 'kpl'),
(3, 'm²');

--
-- Rajoitteet vedostauluille
--

--
-- Rajoitteet taululle `varasto_melalahti`
--
ALTER TABLE `varasto_melalahti`
  ADD CONSTRAINT `sijainti_ID_2` FOREIGN KEY (`sijainti_ID`) REFERENCES `sijainti` (`ID`),
  ADD CONSTRAINT `yksikkotyyppi_ID_2` FOREIGN KEY (`yksikkotyyppi_ID`) REFERENCES `yksikkotyyppi` (`ID`);

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
