# ************************************************************
# Sequel Ace SQL dump
# Version 3030
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: 127.0.0.1 (MySQL 8.0.23)
# Database: blather
# Generation Time: 2021-10-08 04:56:18 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table argument_images
# ------------------------------------------------------------

LOCK TABLES `argument_images` WRITE;
/*!40000 ALTER TABLE `argument_images` DISABLE KEYS */;

INSERT INTO `argument_images` (`id`, `argument_id`, `caption`, `s3_link`, `created_at`, `updated_at`)
VALUES
	(1,1,'','arguments/w9iNDemOVeBIIcIGIPHW59MP.jpg','2021-10-08 04:54:42','2021-10-08 04:54:42'),
	(2,1,'','arguments/wIIQge1tqfoVc3UBqEQi7sVF.jpg','2021-10-08 04:54:42','2021-10-08 04:54:42'),
	(3,16,'','arguments/CVp8LFBejb2YS1JgMsGnq93K.jpg','2021-10-08 04:54:51','2021-10-08 04:54:51'),
	(4,16,'','arguments/UvrDl3qFUTkSrJwy08yKvxdl.jpg','2021-10-08 04:54:51','2021-10-08 04:54:51'),
	(5,16,'','arguments/6drR03XmBD1v82MH2SxREARR.jpg','2021-10-08 04:54:53','2021-10-08 04:54:53'),
	(6,24,'','arguments/LGqgVeUn8YpUjlLH9JgQMrG1.jpg','2021-10-08 04:54:56','2021-10-08 04:54:56'),
	(7,24,'','arguments/ra6G2j2HabAnpmKS8QKOzbgL.jpg','2021-10-08 04:54:56','2021-10-08 04:54:56'),
	(8,30,'','arguments/2ymwUzssujfgSWVlJ880OnLH.jpg','2021-10-08 04:54:59','2021-10-08 04:54:59'),
	(9,31,'','arguments/pSzttvnaKA54LgKWp4ve847h.jpg','2021-10-08 04:55:00','2021-10-08 04:55:00'),
	(10,31,'','arguments/3OlTTMOKGlRRwr11tjQTmMI9.jpg','2021-10-08 04:55:00','2021-10-08 04:55:00'),
	(11,41,'','arguments/2r0aDX8RUYjHbH4H7Wo3FXx8.jpg','2021-10-08 04:55:06','2021-10-08 04:55:06'),
	(12,47,'','arguments/uMaqhZ4ViuyyroMVUNDkigGb.jpg','2021-10-08 04:55:08','2021-10-08 04:55:08'),
	(13,47,'','arguments/dVYhmwWaqDR452pplVB7FNZi.jpg','2021-10-08 04:55:09','2021-10-08 04:55:09'),
	(14,51,'','arguments/ycF9lqi80B2nSoyKMwLAYcGT.jpg','2021-10-08 04:55:10','2021-10-08 04:55:10'),
	(15,51,'','arguments/5QVtprRRHPQoNawMvPllTYxy.jpg','2021-10-08 04:55:10','2021-10-08 04:55:10'),
	(16,55,'','arguments/H2X5qUOh7LR7tIja3jtg0koA.jpg','2021-10-08 04:55:13','2021-10-08 04:55:13'),
	(17,55,'','arguments/I9F0lURKIElMnVghFGszZ33U.jpg','2021-10-08 04:55:13','2021-10-08 04:55:13'),
	(18,57,'','arguments/vXvNy0s0uTW9YiR9WSISSM68.jpg','2021-10-08 04:55:14','2021-10-08 04:55:14'),
	(19,57,'','arguments/1GoOfvm5wrLFZkPxYVvZjFjG.jpg','2021-10-08 04:55:15','2021-10-08 04:55:15'),
	(20,68,'','arguments/u5bsNc2eRJKOdwCje5Vo9k2g.jpg','2021-10-08 04:55:20','2021-10-08 04:55:20'),
	(21,82,'','arguments/qkosRrz7L1OzE7RILz0GhZPN.jpg','2021-10-08 04:55:24','2021-10-08 04:55:24');

/*!40000 ALTER TABLE `argument_images` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
