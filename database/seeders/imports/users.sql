# ************************************************************
# Sequel Ace SQL dump
# Version 3030
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: 127.0.0.1 (MySQL 8.0.23)
# Database: blather
# Generation Time: 2021-10-09 03:27:56 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table users
# ------------------------------------------------------------

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `api_token`, `bio`, `code`, `email`, `email_verified_at`, `forgot_code`, `image`, `name`, `password`, `raw_password`, `remember_token`, `username`, `created_at`, `updated_at`)
VALUES
	(1,'zBDqEjLnlLY9oj7WNVU9ekwO8omiByD2vFezmJgCVYslkMNoePTP2ONDU2f1','Bipartisan. I call out nonsense on all ends of the political spectrum. Left, right and everything in between. ','raxktrj7cl','lnlance09@gmail.com','2021-10-09 03:26:09',NULL,'users/1_trzy-strzaly-back.jpg','Chris Peterson','f409f9617b3444f0d01ab8eb217e3ff2b45cd43b','',NULL,'cpeterson09','2018-09-30 00:50:41','2021-10-09 03:19:29'),
	(2,NULL,'a very friendly domestic cat.','f3dtfffdoi','atalantakatze@gmail.com','2021-10-09 03:26:09',NULL,'dl.jpg','yishthecat','03f1fd055564915bf7beca546f6aa8162890fb42','',NULL,'yishthecat','2018-10-26 03:23:22',NULL),
	(3,NULL,NULL,'dzay1jt2k0','zhuay740@newschool.edu','2021-10-09 03:26:09',NULL,'','yi','b37b0252d0716198c6450bfacf372e8eaf0fda02','',NULL,'yi','2018-10-26 03:47:42',NULL),
	(4,NULL,NULL,'cryxgvdevu','turbocapitalist1987@yahoo.com','2021-10-09 03:26:09',NULL,'users/4_maru.jpg','Jason Carter','f409f9617b3444f0d01ab8eb217e3ff2b45cd43b','',NULL,'turbocapitalist','2018-11-18 01:00:46',NULL),
	(5,NULL,NULL,'bgmafmdqqk','prestonhprice@gmail.com','2021-10-09 03:26:09',NULL,'','Preston Price','c7e332813f68a8ff1e78bf01f97757f3fcd90b26','',NULL,'prestonhprice','2018-12-25 17:53:22',NULL),
	(6,NULL,NULL,NULL,'',NULL,NULL,'','Anonymous','','',NULL,'anonymous','2018-09-30 00:50:41',NULL),
	(7,NULL,'Breaking up echo chambers. Calling out bullshit on the left, the right, and everything in between.',NULL,'',NULL,NULL,'users/1230606690.jpg','Blather','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'blatherIO','2019-04-11 00:39:15',NULL),
	(8,NULL,'World citizen like everyone else. Key words: Climate changes, int. politics and indifferent people. B.A. in Organizational Leadership. All in for the US blue 🌊🌊',NULL,'',NULL,NULL,'','Jeanette','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'Jeanette_EU','2019-04-16 11:46:19',NULL),
	(9,NULL,'',NULL,'',NULL,NULL,'','Jason Wong','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'jasonale','2019-04-23 14:47:58',NULL),
	(10,NULL,'',NULL,'',NULL,NULL,'','Hasan Aktaş','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'hsnkts77','2019-06-05 01:52:57',NULL),
	(11,NULL,NULL,'0d861886bs','dbarns999@gmail.com','2021-10-09 03:26:09',NULL,'','Danny Bart','e331b72617e2a02b6a8d9f24065d1a293b6f99bb','ABCD1234',NULL,'Thatoneguy44','2019-07-09 19:18:24',NULL),
	(12,NULL,NULL,'w7woof6g79','tanmoydas86@gmail.com','2021-10-09 03:26:09',NULL,'','Tanmoy Das','f7c3bc1d808e04732adf679965ccc34ca7ae3441','123456789',NULL,'tanmoydas86','2019-08-03 16:42:37',NULL),
	(13,NULL,'',NULL,'',NULL,NULL,'','Confirmation Bias','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'capitalist87','2019-08-18 02:34:57',NULL),
	(14,NULL,NULL,NULL,'lgnewman@buffalo.edu','2021-10-09 03:26:09',NULL,'users/116302125305611848393.jpg','Lance Newman','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'LanceNewman9427','2019-08-18 17:47:04',NULL),
	(15,NULL,NULL,'5fzr55s8lv','thaines961@gmail.com','2021-10-09 03:26:09',NULL,'','Thomas Haines','cb5dd944112546819f30f6e9aaee88d62cdb623d','Ryan@1995!!',NULL,'THaines','2019-09-10 06:10:21',NULL),
	(16,NULL,'Global speaker. Senior advisor on stuff that matters. Business angel. Head of Internet emeritus. Gör #ensakidag varje dag, på svenska.',NULL,'',NULL,NULL,'users/5976.jpg','Joakim Jardenberg 🔕','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'jocke','2019-09-28 15:14:28',NULL),
	(17,NULL,NULL,'ke17kvcmca','Captain_Linux@Yahoo.com','2021-10-09 03:26:09',NULL,'','Matt','95370cdc3d6048dbfcef7dd052912d6f040de006','blth00lie13',NULL,'MichiganRN','2019-10-04 02:05:08',NULL),
	(18,NULL,NULL,'5puq0pek3c','jerakantz@gmail.com','2021-10-09 03:26:09',NULL,'users/18_download20190906072344.png','Jeremy Kantz','93b663446a5ce78b01cfbff964c149429867a782','EVILCOW9',NULL,'M00NL0RD36','2019-10-11 11:51:50',NULL),
	(19,NULL,NULL,'39c0orotn9','cameron.takahashi@gmail.com','2021-10-09 03:26:09',NULL,'','C. Takahashi','9f067fe1e4e6f129b25ff7c7e41c54216936aa9a','dismiss2blueblue',NULL,'ForPsionics','2019-10-29 17:47:26',NULL),
	(20,NULL,'',NULL,'',NULL,NULL,'users/2492041951.jpg','J.T.H','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'thomascollins92','2019-11-26 14:38:53',NULL),
	(21,NULL,'Someone told me I\'m condescending. (That means I talk down to people).',NULL,'',NULL,NULL,'users/1031688392122068992.jpg','Earl','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'Sandwich_Rtist','2020-01-09 10:06:07',NULL),
	(22,NULL,NULL,'gfh4kakm42','ekke.viira@gmail.com','2021-10-09 03:26:09',NULL,'','Ugo Verev','f21ecb7051573e51e65b293a7931bb9aca3fa303','4tlAnt1s',NULL,'verevubin','2020-01-18 12:42:11',NULL),
	(23,NULL,NULL,'l5cwvnmp4j','rce8899@gmail.com','2021-10-09 03:26:09',NULL,'','Robert C. Engebretson','1cdadd39959da4714cb6c3bfec940a73439579cd','Annie999',NULL,'RCE','2020-01-20 23:23:52',NULL),
	(24,NULL,NULL,'buyrgcs28v','S.ho.m.pa468.755.44islam@gmail.com','2021-10-09 03:26:09',NULL,'','Viverito','260e198cd636e08af6b7dc8b60cbdf80a9448acd','dEDyQFqv8?@',NULL,'Viverito2727','2020-01-23 14:09:27',NULL),
	(25,NULL,'🐐. Sulonian. Indian. Human. he/him. El pueblo unido, jamás será vencido.',NULL,'',NULL,NULL,'users/600190993.jpg','چنماے۔','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'chirpingphoenix','2020-01-27 23:07:53',NULL),
	(26,NULL,NULL,'21nubgj2a8','runtisz@gmail.com','2021-10-09 03:26:09',NULL,'','Ryan Untisz','a9ac104b227ea88c8f4423086b989b7418819c01','ry4490an!',NULL,'ohhryan303','2020-02-10 18:44:39',NULL),
	(27,NULL,NULL,'jh9kgpu5rw','hughjorgan94@gmail.com','2021-10-09 03:26:09',NULL,'','Hugh Jorgan','1fb98a63b6e89d2635446e25e96418ba706b6ed4','jason4771',NULL,'Hugh','2020-02-19 03:24:28',NULL),
	(28,NULL,'News History Politics Technology World News Music Classic Rock Travel World News Science Memes Humor Photography',NULL,'',NULL,NULL,'users/983727715613212678.jpg','Hugh Jorgan','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'HughJor04665568','2020-02-19 19:00:11',NULL),
	(29,NULL,'Skeptic, humanist, science-lover, atheist, movie fan, sports fan...in that order.  1 Cor. 13:11',NULL,'',NULL,NULL,'users/752538636680359936.jpg','Nick Lester','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'TheNickLester','2020-03-01 04:55:08',NULL),
	(30,NULL,'',NULL,'',NULL,NULL,'users/869627822205267968.jpg','Not THAT Ninja','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'ANinjaInTheDark','2020-03-02 06:20:55',NULL),
	(31,NULL,NULL,'ouivweh3hy','noblejay@icloud.com','2021-10-09 03:26:09',NULL,'','JASEN Cartwright','8de5ddfce84345804b62c33249508aee83c33bb2','loki3482',NULL,'QISFORCLOWN','2020-03-29 22:31:46',NULL),
	(32,NULL,NULL,'dlxvsgbqca','Christopherson2801@gmail.com','2021-10-09 03:26:09',NULL,'','chris','8bedfede7efb4af491d6f5367962c1d5a2ce03d8','chris28',NULL,'chrisy','2020-04-08 17:52:58',NULL),
	(33,NULL,NULL,'vt9449ai06','thelifeofthelambily64@gmail.com','2021-10-09 03:26:09',NULL,'','Ethan Maxwell','30281f9c87737f9c47ed200ac2236847b679d65b','ICE BREAKER haha',NULL,'Yeehaw','2020-04-12 13:19:15',NULL),
	(34,NULL,'',NULL,'',NULL,NULL,'users/1234948695382204420.jpg','paulina Anna','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'paulina57096695','2020-04-12 20:54:15',NULL),
	(35,NULL,'',NULL,'',NULL,NULL,'users/1249825539520630785.jpg','Ryan','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'Ryan97922134','2020-04-13 22:35:25',NULL),
	(37,NULL,NULL,'1ph1oa44v4','jamestomhayward@gmail.com','2021-10-09 03:26:09',NULL,'','James Hayward','79a3de2eb9c0c3eb52fedb3d6588b0f1bf544918','Astr0d0m3!',NULL,'Extintor','2020-04-23 15:25:58',NULL),
	(38,NULL,'',NULL,'',NULL,NULL,'users/2992836883.jpg','JustForFollows','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'JustForFollows2','2020-04-24 09:50:22',NULL),
	(39,NULL,NULL,'isv60qtjoi','Kveldson@gmail.com','2021-10-09 03:26:09',NULL,'','Kveld Son','4ac900fc83e4378a23cc6308fe17751fb6ce3d77','blather',NULL,'Kveldson','2020-04-30 23:43:09',NULL),
	(42,NULL,NULL,'3nkphnyujy','saw6892@gmail.com','2021-10-09 03:26:09',NULL,'','Scott Wyckoff','1e23f311bdf648d75f3093ce7078364a9629f2e3','paper56@#',NULL,'saw6892','2020-05-10 14:38:06',NULL),
	(43,NULL,NULL,'4ywuuyew6b','burnsie205@yahoo.com','2021-10-09 03:26:09',NULL,'','Randolph Leigh burns','4d14b2eb510737f75dad77b9380f1d55ee4aeb20','cbusartist58',NULL,'Leighmann','2020-05-31 19:32:15',NULL),
	(44,NULL,'The goodest boy. Allergic to dairy and morons. Don\'t tell Barack and Michelle I\'m on here.',NULL,'',NULL,NULL,'users/1221261353714884609.jpg','Not Bo Obama','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'BoObama3','2020-06-02 00:30:33',NULL),
	(45,NULL,'',NULL,'',NULL,NULL,'users/1247526723349966848.jpg','Nostromo Crew','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'RipleyISfierce','2020-06-19 07:25:44',NULL),
	(46,NULL,NULL,'r452l4dwzh','maervin33@gmail.com','2021-10-09 03:26:09',NULL,'','Mel Erv ','2f9f242b172d87107cbc565be484aadbc05d8c9a','theused33',NULL,'maervin33','2020-06-24 02:40:20',NULL),
	(47,NULL,NULL,'w85y5bs5vk','j.ae.eunjung.so.on.hannah@gmail.com','2021-10-09 03:26:09',NULL,'','Esgar','f90a3894c4dd72066c6df650afc64c5bc5abc823','SfD0X4HY6#!',NULL,'Esgar6666','2020-07-06 08:54:42',NULL),
	(48,NULL,NULL,'r6oeo05krl','Hnryshpprd.1912@gmail.com','2021-10-09 03:26:09',NULL,'','Henry','b857eaec80b6674cbd8e6e2293dfbe9b4dbb954e','Mahanta23',NULL,'SeedSaver','2020-08-03 23:57:49',NULL),
	(49,NULL,'Documenting police brutality',NULL,'',NULL,NULL,'users/1276263320862015488.jpg','Allies Only','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'OnlyAllies','2020-08-12 19:29:59',NULL),
	(50,NULL,'NOT A CUCK!!',NULL,'notacuck@mail.com','2021-10-09 03:26:09',NULL,'users/50_american-flag-etiquette.jpg','Alpha Male','f409f9617b3444f0d01ab8eb217e3ff2b45cd43b','',NULL,'AlphaMale99','2020-08-12 19:29:59',NULL),
	(51,NULL,'MAGA 4 Lyfe',NULL,'notacuck1@mail.com','2021-10-09 03:26:09',NULL,'users/51_rocky.jpeg','MAGA Babbyyy','f409f9617b3444f0d01ab8eb217e3ff2b45cd43b','',NULL,'realMagaFan','2020-08-12 19:29:59',NULL),
	(52,NULL,'High IQ and very Intellectually gifted',NULL,'notacuck2@mail.com','2021-10-09 03:26:09',NULL,'users/52_petersen.jpg','Ray Stepsen','f409f9617b3444f0d01ab8eb217e3ff2b45cd43b','',NULL,'rstepsten','2020-08-12 19:29:59',NULL),
	(53,NULL,'God fearing and Gun loving Patriot',NULL,'notacuck3@mail.com','2021-10-09 03:26:09',NULL,'users/53_jesus-christ-cross_SI_1.jpg','Kevin Rodham','f409f9617b3444f0d01ab8eb217e3ff2b45cd43b','',NULL,'krod','2020-08-12 19:29:59',NULL),
	(54,NULL,'Reject victimhood. Never make Excuses!',NULL,'notacuck4@mail.com','2021-10-09 03:26:09',NULL,'users/54_candace.jpeg','Lauren Heath','f409f9617b3444f0d01ab8eb217e3ff2b45cd43b','',NULL,'heathbar','2020-08-12 19:29:59',NULL),
	(55,NULL,'MAGA Babe. Trump 2020!!',NULL,'notacuck5@mail.com','2021-10-09 03:26:09',NULL,'users/55_1q4qpz.jpg','Karen Cole','f409f9617b3444f0d01ab8eb217e3ff2b45cd43b','',NULL,'kcole79','2020-08-12 19:29:59',NULL),
	(56,NULL,'Party of Lincoln!! Party of Trump!! Proud to be a Republican!!! Proud to be on the right side of History!!',NULL,'notacuck6@mail.com','2021-10-09 03:26:09',NULL,'users/56_confederate.jpg','Dennis Slater','f409f9617b3444f0d01ab8eb217e3ff2b45cd43b','',NULL,'rebelrocker89','2020-08-12 19:29:59',NULL),
	(57,NULL,'Reformed  • Trump Campaign Field Organizer • Jordan Peterson’s Biggest Fan',NULL,'notacuck7@mail.com','2021-10-09 03:26:09',NULL,'users/57_monarchy.jpg','Ryan Covan','f409f9617b3444f0d01ab8eb217e3ff2b45cd43b','',NULL,'covanryan','2020-08-12 19:29:59',NULL),
	(58,NULL,'',NULL,'notacuck8@mail.com','2021-10-09 03:26:09',NULL,'users/58_sf.png','Joe Schwinn','f409f9617b3444f0d01ab8eb217e3ff2b45cd43b','',NULL,'yaboijoe','2020-08-12 19:29:59',NULL),
	(59,NULL,NULL,'2108','turbocapitalist1988@yahoo.com','2021-10-09 03:26:09',NULL,'','Jared Fuchs','e38ad214943daad1d64c102faec29de4afe9da3d','password1',NULL,'fuchs202','2020-08-25 14:50:35',NULL),
	(60,NULL,NULL,'0084','konradborkowicz@gmail.com','2021-10-09 03:26:09',NULL,'','Ashe Borkowicz','cf0ceb98d6e44c2c13095108609cadff0d4e778a','loler222',NULL,'ashe','2020-09-01 21:23:06',NULL),
	(61,NULL,'',NULL,'',NULL,NULL,'users/2394315947.jpg','ember','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'BorkowiczKonrad','2020-09-02 05:57:03',NULL),
	(62,NULL,'Weary of Trump Cult Members.',NULL,'',NULL,NULL,'users/1157567149197516800.jpg','The Pillory','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'ThePiIIory','2020-09-09 09:19:52',NULL),
	(63,NULL,'Free Speech Absolutist. Militia Man. strong Consitionalist. Down with the Political Dynasties like the Bush\'s and Clintons.',NULL,'notacuck9@mail.com','2021-10-09 03:26:09',NULL,'users/63_monarchy.jpg','Leo Grandola','f409f9617b3444f0d01ab8eb217e3ff2b45cd43b','',NULL,'firstandgrand','2020-08-19 19:29:59',NULL),
	(64,NULL,'former astrophysicist turned software developer let\'s make some awesome🤓',NULL,'',NULL,NULL,'users/50677359.jpg','cece hedrick','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'piqueen314','2020-09-30 21:30:15',NULL),
	(65,NULL,'Hi, i\'m irrelevant\nGrowth Mindset.\n\nRIP Emily and Sophie - You are going to live forever\n\nhttps://t.co/JLKjX6reaE',NULL,'',NULL,NULL,'users/4071416271.jpg','Bookish.','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'Bookish_YT','2020-12-02 18:14:27',NULL),
	(66,NULL,'',NULL,'',NULL,NULL,'users/1245063403.jpg','Riley Sickler','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'RileySickler','2020-12-22 05:40:58',NULL),
	(67,NULL,'LIVE Social Media PLProductionsLLC. @NicoleSandler Show; Radio Personality. Past: @SFGN; @RandiRhodes Show; @WLRN @WXELTV #Progressive #Comedy (NOT  @Learymon )',NULL,'',NULL,NULL,'users/14973915.jpg','Paul Leary','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'paulleary','2021-01-10 08:34:16',NULL),
	(68,NULL,'Humorist/Satirist/Humanoid \n\"Sometimes you just gotta suck your own toe.\"',NULL,'',NULL,NULL,'users/1308202541054861313.jpg','Jofuri Bobagu','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'JBobagu','2021-01-10 17:36:49',NULL),
	(69,NULL,NULL,'5980','papadolphin@hotmail.com','2021-10-09 03:26:09',NULL,'','Randolph L Burns','dfb9845042e1e13a52b9c031136a006c57a6ab51','leighmann',NULL,'Leighmann19','2021-01-19 03:51:23',NULL),
	(71,NULL,NULL,'9816','kristenfram@gmail.com','2021-10-09 03:26:09',NULL,'','kristen fram','143835401ab76d5c02f5876e5d7498f3711eaea2','bbbbbb2',NULL,'freethink','2021-02-13 17:46:32',NULL),
	(72,NULL,NULL,'9980','cvsansxd@gmail.com','2021-10-09 03:26:09',NULL,'','Bookish Bruv','1717903d5c321712da4a0aee6989b86c1aae4d01','Hcrayert12',NULL,'Bookish','2021-03-09 12:46:07',NULL),
	(73,NULL,NULL,'6978','martinchelsi@gmail.com','2021-10-09 03:26:09',NULL,'','Chelsi','eccd68734113bf942d92b23e47e7503fba15df8d','Tristin@02',NULL,'Martin','2021-03-23 00:20:47',NULL),
	(74,NULL,NULL,'5026','enteledont2000@gmail.com','2021-10-09 03:26:09',NULL,'','The Serum','7c91a05b7bdc41113b3eeb794a75014a9a5d8289','billyfish',NULL,'Chalicothere','2021-04-13 07:32:59',NULL),
	(75,NULL,NULL,'6489','darrenconlon1972@icloud.com','2021-10-09 03:26:09',NULL,'','Darren','798b0b4a2eee28f220b4927f66dd2c648ef83c97','Cooper8125',NULL,'Conlon','2021-04-24 04:48:29',NULL),
	(76,NULL,'Calling out logical fallacies & throwing them in the trash where they belong. I\'d really like for my Republic not to crumble before my very eyes.',NULL,'',NULL,NULL,'users/1348725259898408961.jpg','Mark D’Bête','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'ap0lly0n666','2021-05-15 18:44:29',NULL),
	(77,NULL,'bRuH',NULL,'',NULL,NULL,'users/792465806529597440.jpg','Nejc Lango','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'nejclango','2021-07-07 12:57:24',NULL),
	(78,NULL,'',NULL,'',NULL,NULL,'users/1021531574125379585.jpg','Benjamin Kent','da39a3ee5e6b4b0d3255bfef95601890afd80709','',NULL,'BenjaminKent16','2021-07-18 16:54:13',NULL);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
