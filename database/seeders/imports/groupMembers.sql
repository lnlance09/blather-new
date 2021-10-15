# ************************************************************
# Sequel Ace SQL dump
# Version 3030
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: 127.0.0.1 (MySQL 8.0.23)
# Database: blather
# Generation Time: 2021-10-15 03:16:00 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table groups_members
# ------------------------------------------------------------

LOCK TABLES `groups_members` WRITE;
/*!40000 ALTER TABLE `groups_members` DISABLE KEYS */;

INSERT INTO `groups_members` (`id`, `group_id`, `page_id`, `created_at`, `updated_at`)
VALUES
	(1,1,6,NULL,NULL),
	(2,1,24,NULL,NULL),
	(3,1,383,NULL,NULL),
	(4,1,262,NULL,NULL),
	(5,1,1083,NULL,NULL),
	(6,1,573,NULL,NULL),
	(7,1,495,NULL,NULL),
	(8,1,41,NULL,NULL),
	(9,2,510,NULL,NULL),
	(10,2,75,NULL,NULL),
	(11,2,287,NULL,NULL),
	(12,1,1074,NULL,NULL),
	(13,1,892,NULL,NULL),
	(14,2,50,NULL,NULL),
	(15,2,1166,NULL,NULL),
	(16,2,819,NULL,NULL),
	(17,2,2,NULL,NULL),
	(18,2,5,NULL,NULL);

/*!40000 ALTER TABLE `groups_members` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
