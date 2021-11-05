# ************************************************************
# Sequel Ace SQL dump
# Version 3041
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: 127.0.0.1 (MySQL 8.0.23)
# Database: blather
# Generation Time: 2021-11-05 02:56:39 +0000
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
	(3,'Tu Quoque','This is an attack on the circumstances of the arguer. May imply ulterior motives or conflict of interests.','',NULL,NULL),
	(4,'Bandwagoning','Where something is claimed to be true or good solely because lots of others believe it to be so.','',NULL,NULL),
	(5,'Appeal to Authority','The arguer tries to inflate the worth of his argument by associating it with a well known authority who is not an actual authority on the subject at hand. The arguer may also try to use his/her own authority to persuade listeners.','',NULL,NULL),
	(6,'Appeal to Force','This is really just a threat. The arguer tries to get others to adopt his/her point of view or else the arguer will cause them harm.','',NULL,NULL),
	(7,'Appeal to Nature','Wherein judgment is based solely on whether the subject of judgment is \"natural\" or \"unnatural.\"','',NULL,NULL),
	(8,'Appeal to Tradition','This form of argument tries to pursued the listener that an idea must be true because it has been believed or practiced for a long time.','',NULL,NULL),
	(11,'Baseless Claim','Making a claim without offering any proof to substantiate it.','',NULL,NULL),
	(12,'Black-or-white','The arguer gives the impression that there are only two extreme positions that are possible. This does not allow for moderate, middle grounds or grey areas.','',NULL,NULL),
	(14,'Burden of Proof','Instead of providing evidence to support a claim, the arguer implies that it is true because his/her opponent has not proved it to be false. Extraordinary claims require extraordinary evidence\' (Carl Sagan).','',NULL,NULL),
	(15,'Cherry Picking','The act of pointing at individual cases or data that seem to confirm a particular position, while ignoring a significant portion of related cases or data that may contradict that position.','',NULL,NULL),
	(16,'Begging the question','Providing what is essentially the conclusion of the argument as a premise.','',NULL,NULL),
	(21,'Doublethink','The power of holding two contradictory beliefs in one\'s mind simultaneously, and accepting both of them.','',NULL,NULL),
	(22,'Exploiting Tragedies','This isn\'t a fallacy; it\'s just a very cruel and dishonest tactic. This happens when someone uses a tragedy to advance their narrative or for their own personal gain. The gains can vary and can range from mere attention on social media to money or favors. This happens a lot after school shooting in the United States. Using this fallacy typically indicates a clear lack of empathy on behalf of the person employing it.','',NULL,NULL),
	(23,'Factual Inaccuracy','An inaccurate fact that is used to advance an argument.','',NULL,NULL),
	(25,'False Equivalence','Describes a situation of logical and apparent equivalence, when in fact there is none.','',NULL,NULL),
	(26,'Galileo\'s Gambit','A rhetorical tactic that asserts that if your ideas are ridiculed, then they must be valid. This fallacy earns its name from Galileo‘s famous persecution at the hands of the Catholic Church for his defense of heliocentrism in the face of the orthodox Biblical literalism of the day.','',NULL,NULL),
	(27,'Gambler\'s Fallacy','The mistaken belief that a random event must be due to happen soon if it has not happened in an unusually long time.','',NULL,NULL),
	(28,'Genetic Fallacy','Discrediting the source or origin of an argument instead of the argument itself.','',NULL,NULL),
	(30,'Hasty Generalization','The arguer attributes a property to an entire group based only on observing that property in an individual.','',NULL,NULL),
	(31,'Loaded Question','A question posed that implies an unstated major premise such that any answer will trap the answerer into appearing to agree with the unstated premise.','',NULL,NULL),
	(32,'Luddite Fallacy','The belief that technological progress that be slowed down or even halted so jobs will not be lost.','',NULL,NULL),
	(33,'Middle Ground','Assuming that the compromise between two positions is correct.','',NULL,NULL),
	(34,'Moral High Ground','In which one assumes a \'holier-than-thou\' attitude in an attempt to make oneself look good to win an argument.','',NULL,NULL),
	(35,'Moving the Goalposts','When criteria are met that falsify the arguer\'s position, the arguer changes the criteria and claims that his/her position is still valid.','',NULL,NULL),
	(36,'Nirvana Fallacy','When arguing against an action or policy, this fallacy is committed if the arguer declares the action to be useless if it does not lead to ideal conditions. It is related to the false dichotomy in that it implies that if the action does not lead to perfection, then it is useless. It does not recognize that simple improvement is worthwhile. Essentially, if it isn\'t perfect, then it is useless.','',NULL,NULL),
	(37,'No True Scotsman','If the premise of the argument is falsified with a counter example, rather than changing the conclusion, the arguer changes the definition of a major premise to make both the premise and the conclusion true. Typically, the arguer makes a sweeping generalization about a an entire group. This is usually done by implying that the group is bound and defined by the arbitrary quality. If an exception to this generalization is pointed out, the arguer dismisses the exception as not truly belonging to the group in the first place.','',NULL,NULL),
	(38,'Post Hoc Fallacy','A precedes B, therefore A caused B.','',NULL,NULL),
	(39,'Quota Fallacy','A type of non-sequitir whereby one asserts that if a group of people doesn\'t have a certain amount of a certain kind of person, that discrimination and/or bigotry is the culprit.','',NULL,NULL),
	(41,'Red Herring','A speaker attempts to distract an audience by deviating from the topic at hand by introducing a separate argument the speaker believes is easier to speak to.','',NULL,NULL),
	(42,'Shill Gambit','Conspiracy theory style reasoning wherein an argument is dismissed because the person who is putting it forth is assumed be profiting from the position that they\'re taking. This can also be an ad hominem attack. It\'s common for the person whose argument has been dismissed to be accused of being on a company\'s payroll. This assumes that the only legitimate reason one can have for taking a certain position is personal gain.','',NULL,NULL),
	(43,'Slippery Slope','The arguer tries to convince others that one action will lead to a series of events that will eventually lead to an ultimate, usually unwanted, consequence. This is fallacious if it is unlikely that each intermediate step will necessarily follow the preceding one.','',NULL,NULL),
	(45,'Strawman','Giving the impression of refuting an opponent\'s argument, while actually refuting an argument that was not advanced by that opponent.','',NULL,NULL),
	(47,'Thought Terminating Cliché','A commonly used phrase, sometimes passing as folk wisdom, used to quell cognitive dissonance, conceal lack of thought-entertainment, move on to other topics etc. but in any case, end the debate with a cliché—not a point.','',NULL,NULL),
	(49,'Two Wrongs Make a Right','When a person attempts to justify an action against another person because the other person did take or would take the same action against him or her.','',NULL,NULL),
	(50,'Unfalsifiable Claim','A claim that is asserted that cannot be proven wrong. No evidence suffices as valid evidence.','',NULL,NULL),
	(51,'Word Redefinition','This happens when someone changes the definition of a word in such a way that reality conforms to their biases or lies.','',NULL,NULL),
	(52,'Whataboutism','A deflection tactic that is used to shift the focus of attention away from what is being criticized on to other stuff that is totally irrelevant.','',NULL,NULL),
	(53,'Word Salad','This isn\'t any sort of coherent argument or rhetoric. However, it often masquerades as one if the person communicating it is well spoken. This is essentially just a confused or unintelligible mixture of seemingly random words and phrases.','',NULL,NULL),
	(54,'Zero Sum Fallacy','When one assumes that someone else’s gain is a loss to other players; and the total amount of the available money or resources is fixed. A logical fallacy often occurs when this particular game theory is applied to economic or political discussions amongst non-economists – leading to false beliefs that the amount of wealth or jobs in the economy is fixed.','',NULL,NULL),
	(55,'Appeal to the Law','When following the law is assumed to be the morally correct thing to do, without justification, or when breaking the law is assumed to be the morally wrong thing to do, without justification. This can also happen when one equates supporting the legalization of something with actually supporting it.','',NULL,NULL),
	(65,'It\'s in the name!','An error in reasoning whereby one believes that someone or something are actually what they self-identify as despite all evidence to the contrary. Anyone can choose to identify as whatever they want to but it doesn\'t necessarily mean that the self-identification is accurate.','',NULL,NULL),
	(67,'Appeal to Suffering','The belief that ending a cruel policy is an insult to all of the people who were previously victimized by it.','',NULL,NULL),
	(69,'Non Sequitur','A conclusion or statement that does not logically follow from the previous argument or statement.','',NULL,NULL);

/*!40000 ALTER TABLE `reference` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
