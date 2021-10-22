# ************************************************************
# Sequel Ace SQL dump
# Version 3030
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: blather.cni5l9jtlymn.us-west-2.rds.amazonaws.com (MySQL 5.7.33-log)
# Database: blather
# Generation Time: 2021-09-28 00:45:29 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table fallacies
# ------------------------------------------------------------

LOCK TABLES `reference` WRITE;
/*!40000 ALTER TABLE `reference` DISABLE KEYS */;

INSERT INTO `reference` (`id`, `description`, `name`)
VALUES
	(1,'This is an insult that is given instead of a reason.','Ad Hominem'),
	(3,'This is an attack on the circumstances of the arguer. May imply ulterior motives or conflict of interests.','Tu Quoque'),
	(4,'Where something is claimed to be true or good solely because lots of others believe it to be so.','Bandwagoning'),
	(5,'The arguer tries to inflate the worth of his argument by associating it with a well known authority who is not an actual authority on the subject at hand. The arguer may also try to use his/her own authority to persuade listeners.','Appeal to Authority'),
	(6,'This is really just a threat. The arguer tries to get others to adopt his/her point of view or else the arguer will cause them harm.','Appeal to Force'),
	(7,'Wherein judgment is based solely on whether the subject of judgment is \"natural\" or \"unnatural.\"','Appeal to Nature'),
	(8,'This form of argument tries to pursued the listener that an idea must be true because it has been believed or practiced for a long time.','Appeal to Tradition'),
	(11,'Making a claim without offering any proof to substantiate it.','Baseless Claim'),
	(12,'The arguer gives the impression that there are only two extreme positions that are possible. This does not allow for moderate, middle grounds or grey areas.','Black-or-white'),
	(14,'Instead of providing evidence to support a claim, the arguer implies that it is true because his/her opponent has not proved it to be false. Extraordinary claims require extraordinary evidence\' (Carl Sagan).','Burden of Proof'),
	(15,'The act of pointing at individual cases or data that seem to confirm a particular position, while ignoring a significant portion of related cases or data that may contradict that position.','Cherry Picking'),
	(16,'Providing what is essentially the conclusion of the argument as a premise.','Begging the question'),
	(21,'The power of holding two contradictory beliefs in one\'s mind simultaneously, and accepting both of them.','Doublethink'),
	(22,'This isn\'t a fallacy; it\'s just a very cruel and dishonest tactic. This happens when someone uses a tragedy to advance their narrative or for their own personal gain. The gains can vary and can range from mere attention on social media to money or favors. This happens a lot after school shooting in the United States. Using this fallacy typically indicates a clear lack of empathy on behalf of the person employing it.','Exploiting Tragedies'),
	(23,'An inaccurate fact that is used to advance an argument.','Factual Inaccuracy'),
	(25,'Describes a situation of logical and apparent equivalence, when in fact there is none.','False Equivalence'),
	(26,'A rhetorical tactic that asserts that if your ideas are ridiculed, then they must be valid. This fallacy earns its name from Galileo‘s famous persecution at the hands of the Catholic Church for his defense of heliocentrism in the face of the orthodox Biblical literalism of the day.','Galileo\'s Gambit'),
	(27,'The mistaken belief that a random event must be due to happen soon if it has not happened in an unusually long time.','The Gambler\'s Fallacy'),
	(28,'Discrediting the source or origin of an argument instead of the argument itself.','Genetic Fallacy'),
	(30,'The arguer attributes a property to an entire group based only on observing that property in an individual.','Hasty Generalization'),
	(31,'A question posed that implies an unstated major premise such that any answer will trap the answerer into appearing to agree with the unstated premise.','Loaded Question'),
	(32,'The belief that technological progress that be slowed down or even halted so jobs will not be lost.','Luddite Fallacy'),
	(33,'Assuming that the compromise between two positions is correct.','Middle Ground'),
	(34,'In which one assumes a \'holier-than-thou\' attitude in an attempt to make oneself look good to win an argument.','Moral High Ground'),
	(35,'When criteria are met that falsify the arguer\'s position, the arguer changes the criteria and claims that his/her position is still valid.','Moving the Goalposts'),
	(36,'When arguing against an action or policy, this fallacy is committed if the arguer declares the action to be useless if it does not lead to ideal conditions. It is related to the false dichotomy in that it implies that if the action does not lead to perfection, then it is useless. It does not recognize that simple improvement is worthwhile. Essentially, if it isn\'t perfect, then it is useless.','Nirvana Fallacy'),
	(37,'If the premise of the argument is falsified with a counter example, rather than changing the conclusion, the arguer changes the definition of a major premise to make both the premise and the conclusion true. Typically, the arguer makes a sweeping generalization about a an entire group. This is usually done by implying that the group is bound and defined by the arbitrary quality. If an exception to this generalization is pointed out, the arguer dismisses the exception as not truly belonging to the group in the first place.','No True Scotsman'),
	(38,'A precedes B, therefore A caused B.','Post Hoc Fallacy'),
	(39,'A type of non-sequitir whereby one asserts that if a group of people doesn\'t have a certain amount of a certain kind of person, that discrimination and/or bigotry is the culprit.','Quota Fallacy'),
	(41,'A speaker attempts to distract an audience by deviating from the topic at hand by introducing a separate argument the speaker believes is easier to speak to.','Red Herring'),
	(42,'Conspiracy theory style reasoning wherein an argument is dismissed because the person who is putting it forth is assumed be profiting from the position that they\'re taking. This can also be an ad hominem attack. It\'s common for the person whose argument has been dismissed to be accused of being on a company\'s payroll. This assumes that the only legitimate reason one can have for taking a certain position is personal gain.','Shill Gambit'),
	(43,'The arguer tries to convince others that one action will lead to a series of events that will eventually lead to an ultimate, usually unwanted, consequence. This is fallacious if it is unlikely that each intermediate step will necessarily follow the preceding one.','Slippery Slope'),
	(45,'Giving the impression of refuting an opponent\'s argument, while actually refuting an argument that was not advanced by that opponent.','Strawman'),
	(46,'Cherry picking data that supports your contention while ignoring data that contradcits it. Basically, confirmation bias.','The Texas Sharpshooter'),
	(47,'A commonly used phrase, sometimes passing as folk wisdom, used to quell cognitive dissonance, conceal lack of thought-entertainment, move on to other topics etc. but in any case, end the debate with a cliché—not a point.','Thought Terminating Cliché'),
	(48,'A type of non-sequitir whereby one attempts to take credit for the deeds of someone else who belongs to the same group of people as the person putting forth the argument.','Tribal Fallacy'),
	(49,'When a person attempts to justify an action against another person because the other person did take or would take the same action against him or her.','Two Wrongs Make a Right'),
	(50,'A claim that is asserted that cannot be proven wrong. No evidence suffices as valid evidence.','Unfalsifiable Claim'),
	(51,'This happens when someone changes the definition of a word in such a way that reality conforms to their biases or lies.','Word Redefinition'),
	(52,'A deflection tactic that is used to shift the focus of attention away from what is being criticized on to other stuff that is totally irrelevant.','Whataboutism'),
	(53,'This isn\'t any sort of coherent argument or rhetoric. However, it often masquerades as one if the person communicating it is well spoken. This is essentially just a confused or unintelligible mixture of seemingly random words and phrases.','Word Salad'),
	(54,'When one assumes that someone else’s gain is a loss to other players; and the total amount of the available money or resources is fixed. A logical fallacy often occurs when this particular game theory is applied to economic or political discussions amongst non-economists – leading to false beliefs that the amount of wealth or jobs in the economy is fixed.','Zero Sum Fallacy'),
	(55,'When following the law is assumed to be the morally correct thing to do, without justification, or when breaking the law is assumed to be the morally wrong thing to do, without justification. This can also happen when one equates supporting the legalization of something with actually supporting it.','Appeal to the Law'),
	(65,'An error in reasoning whereby one believes that someone or something are actually what they self-identify as despite all evidence to the contrary. Anyone can choose to identify as whatever they want to but it doesn\'t necessarily mean that the self-identification is accurate.','It\'s in the name!'),
	(67,'The belief that ending a cruel policy is an insult to all of the people who were previously victimized by it.','Appeal to Suffering'),
	(69,'A conclusion or statement that does not logically follow from the previous argument or statement.','Non Sequitur');

/*!40000 ALTER TABLE `reference` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
