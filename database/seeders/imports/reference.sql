# ************************************************************
# Sequel Ace SQL dump
# Version 3041
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: 127.0.0.1 (MySQL 8.0.23)
# Database: blather
# Generation Time: 2021-11-11 03:17:20 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table reference
# ------------------------------------------------------------

LOCK TABLES `reference` WRITE;
/*!40000 ALTER TABLE `reference` DISABLE KEYS */;

INSERT INTO `reference` (`id`, `name`, `description`, `example`, `created_at`, `updated_at`)
VALUES
	(1,'Ad Hominem','This is an insult that is given instead of a reason.','',NULL,NULL),
	(3,'Tu Quoque','Discrediting an argument by attacking the opponent\'s own personal behavior and actions as being inconsistent with their argument, therefore accusing hypocrisy.','',NULL,NULL),
	(4,'Bandwagoning','Where something is believed to be good because lots of other people believe it to be good.','',NULL,NULL),
	(5,'Appeal to Authority','Inflating the argument by associating it with a well known authority who is not an actual authority on the subject at hand.','',NULL,NULL),
	(6,'Appeal to Force','This is really just a threat.','',NULL,NULL),
	(7,'Appeal to Nature','When judgment is based solely on whether or not the subject is \"natural\" or \"unnatural.\"','',NULL,NULL),
	(8,'Appeal to Tradition','When something is believed to be good because it has existed for a long time.','',NULL,NULL),
	(11,'Baseless Claim','Making a claim without offering any proof to substantiate it.','',NULL,NULL),
	(12,'Black-or-white','The arguer gives the impression that there are only two extreme positions that are possible. This does not allow for moderate, middle grounds or grey areas.','',NULL,NULL),
	(14,'Burden of Proof','Shifting the burden of proof from the person who is making the claim to the person who is asking for evidence.','',NULL,NULL),
	(15,'Cherry Picking','Pointing to isolated examples that confirm a position while ignoring the overwhelming evidence that contradicts it.','',NULL,NULL),
	(16,'Begging the question','Providing what is essentially the conclusion of the argument as a premise. Circular Reasoning.','',NULL,NULL),
	(21,'Doublethink','Holding two contradictory beliefs and accepting both of them.','',NULL,NULL),
	(22,'Exploiting Tragedies','Walking over the graves of victims of crimes in order to advance an agenda, usually for personal gain.','',NULL,NULL),
	(23,'Factual Inaccuracy','An inaccurate fact that is used to advance an argument.','',NULL,NULL),
	(25,'False Equivalence','Presenting two situations as if they\'re logically equivalant, when in fact they\'re not.','',NULL,NULL),
	(26,'Galileo\'s Gambit','A rhetorical tactic that asserts that if your ideas are ridiculed, then they must be valid.','',NULL,NULL),
	(27,'Gambler\'s Fallacy','The mistaken belief that a random event must be due to happen soon if it has not happened in an unusually long time.','',NULL,NULL),
	(28,'Genetic Fallacy','Discrediting the source or origin of an argument instead of the argument itself.','',NULL,NULL),
	(30,'Hasty Generalization','Attributing a property to an entire group based solely on observing that property in an individual.','',NULL,NULL),
	(31,'Loaded Question','A question posed that implies an unstated major premise such that any answer will trap the answerer into appearing to agree with the unstated premise.','',NULL,NULL),
	(32,'Luddite Fallacy','The belief that technological progress that be slowed down or even halted so that jobs will not be lost.','',NULL,NULL),
	(33,'Middle Ground','Assuming that the compromise between two extreme positions is correct.','',NULL,NULL),
	(34,'Moral High Ground','In which one assumes a \'holier-than-thou\' attitude in an attempt to make oneself look good to win an argument.','',NULL,NULL),
	(35,'Moving the Goalposts','When criteria are met that falsify the arguer\'s position, the arguer changes the criteria and claims that their position is still valid.','',NULL,NULL),
	(36,'Nirvana Fallacy','All or nothing. Essentially, if it isn\'t perfect, then it\'s useless.','',NULL,NULL),
	(37,'No True Scotsman','An appeal to purity, in which one attempts to protect their universal generalization from a counterexample by excluding the counterexample improperly.','',NULL,NULL),
	(38,'Post Hoc Fallacy','A precedes B, therefore A caused B.','',NULL,NULL),
	(39,'Quota Fallacy','A type of non-sequitir that assumes that if a group doesn\'t contain a certain amount of a certain kind of person, that discrimination and/or bigotry is the culprit.','',NULL,NULL),
	(41,'Red Herring','Deviating from the topic at hand by introducing a separate argument that is unrelated but easier to speak to.','',NULL,NULL),
	(42,'Shill Gambit','Conspiracy theory style reasoning wherein an argument is dismissed because the person who is using it is assumed to be profiting from the position that they\'re taking.','',NULL,NULL),
	(43,'Slippery Slope','The arguer tries to convince others that one action will lead to a series of events that will eventually lead to an ultimate, usually unwanted, consequence.','',NULL,NULL),
	(45,'Strawman','Giving the impression of refuting an argument, while actually refuting an argument that was not advanced by that opponent.','',NULL,NULL),
	(47,'Thought Terminating Cliché','A commonly used phrase, sometimes passing as folk wisdom, used to quell cognitive dissonance, conceal lack of thought-entertainment, move on to other topics etc.','',NULL,NULL),
	(49,'Two Wrongs Make a Right','Justifying an action against another person because the other person did take or would take the same action against them.','',NULL,NULL),
	(50,'Unfalsifiable Claim','A claim that is asserted that cannot be proven wrong. No evidence suffices as valid evidence.','',NULL,NULL),
	(51,'Word Redefinition','This happens when someone changes the definition of a word in such a way that conforms to their biases or lies.','',NULL,NULL),
	(52,'Whataboutism','A deflection tactic that is used to shift the focus of attention away from what is being criticized on to other stuff that is totally irrelevant.','',NULL,NULL),
	(53,'Word Salad','A confused or unintelligible mixture of seemingly random words and phrases.','',NULL,NULL),
	(54,'Zero Sum Fallacy','Assuming that someone else’s gain is a loss to others and that the total amount of the available resources is fixed.','',NULL,NULL),
	(55,'Appeal to the Law','When following the law is assumed to be the morally correct thing to do, without justification, or when breaking the law is assumed to be the morally incorrect thing to do, without justification.','',NULL,NULL),
	(65,'It\'s in the name!','Assuming that something is the way it\'s self-proclaimed to be, despite evidence to the contrary.','',NULL,NULL),
	(67,'Appeal to Suffering','When something is deemed to be the incorrect thing to do because fewer people will suffer as a result.','',NULL,NULL),
	(69,'Non Sequitur','A conclusion or statement that does not logically follow from the previous argument or statement.','',NULL,NULL);

/*!40000 ALTER TABLE `reference` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
