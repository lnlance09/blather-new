import { Divider, Grid, Header, Image } from "semantic-ui-react"
import { useContext } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { grifters } from "options/grifters"
import { s3Url } from "options/aws"
import DefaultLayout from "layouts/default"
import PlaceholderPic from "images/images/image-square.png"
import PropTypes from "prop-types"
import ReactTooltip from "react-tooltip"
import ThemeContext from "themeContext"

const Grifters = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	const { antiVaxx, blueCheckMark, crypto, evangelicals, maga, mlm } = grifters

	return (
		<DefaultLayout activeItem="grifters" containerClassName="griftersPage" history={history}>
			<DisplayMetaTags page="grifters" />

			<Grid>
				<Grid.Column width={16}>
					<Header as="h1" inverted={inverted}>
						What is a Grifter?
					</Header>

					<p>
						A grifter is someone that has made the conscious decision to earn their
						living by selling empty promises and repeating falsehoods to gullible
						people. Grifters are usually on the path of least resistance and their
						strategies often consist of little more than repeating a handful of tired
						talking points to a naive audience that is very desperate to have their
						pre-existing opinions confirmed.
					</p>

					<Header as="h1">MAGA Grifters</Header>
					<p>
						Political grifting, particularly on the right, has long been the last refuge
						of talentless celebrity wannabes. It’s why so many people in Trump world are
						failed comedians, musicians, actors, models etc. And it’s easy. Super easy.
						It’s literally reciting scripted talking points and telling your audience
						what they already believe, but doing it as a one-dimensional personality
						brand. Bonus points if one is a member of a marginalized group.
					</p>

					<div className="gallery-wrapper">
						<div className="tiles">
							{maga.map((m, i) => (
								<div className="tile" key={`tileKey${i}`}>
									<Image
										data-for={`groupsMember${i}`}
										data-iscapture="true"
										data-tip={m.name}
										onClick={() =>
											history.push(`/pages/${m.network}/${m.username}`)
										}
										onError={(e) => (e.target.src = PlaceholderPic)}
										rounded
										src={`${s3Url}${m.src}`}
									/>
									<ReactTooltip
										className="tooltipClass"
										effect="solid"
										id={`groupsMember${i}`}
										multiline={false}
										place="left"
										type="dark"
									/>
								</div>
							))}
						</div>
					</div>

					<Header as="h1">MLM Grifters</Header>
					<p>
						Here's some financial advice... Don't take financial advice from anyone
						using the words "hustle" or "grind." Or if they're constantly posting vapid
						motivational crap mixed in with their preposterous financial posts. The odds
						of said person wanting to con you into a pyramid scheme are astronomical.
						Similar to cryptocurrency grifters, these vultures take advantage of
						insecure dude bros' desire to get rich quick without having to put in any
						real work.
					</p>
					<div className="gallery-wrapper">
						<div className="tiles">
							{mlm.map((m, i) => (
								<div className="tile" key={`tileKey${i}`}>
									<Image
										data-for={`groupsMember${i}`}
										data-iscapture="true"
										data-tip={m.name}
										onClick={() =>
											history.push(`/pages/${m.network}/${m.username}`)
										}
										onError={(e) => (e.target.src = PlaceholderPic)}
										rounded
										src={`${s3Url}${m.src}`}
									/>
									<ReactTooltip
										className="tooltipClass"
										effect="solid"
										id={`groupsMember${i}`}
										multiline={false}
										place="left"
										type="dark"
									/>
								</div>
							))}
						</div>
					</div>

					<Header as="h1">Anti-Vaxx Grifters</Header>
					<p>
						These are people who exploit the general population's scientific ignorance,
						particuarly in regards to vaccines, for their own personal gain. Prior to
						2020, this group consisted almost entirely of west coast hippie burnouts and
						wealthy suburban soccer mom Gwenyth Paltrow types. However, the temptation
						to own the libz proved to be too strong and this group is now dominated by
						rural Republicans who think that being hospitalized for a preventable
						disease is a cool way to score some political points.
					</p>
					<div className="gallery-wrapper">
						<div className="tiles">
							{antiVaxx.map((m, i) => (
								<div className="tile" key={`tileKey${i}`}>
									<Image
										data-for={`groupsMember${i}`}
										data-iscapture="true"
										data-tip={m.name}
										onClick={() =>
											history.push(`/pages/${m.network}/${m.username}`)
										}
										onError={(e) => (e.target.src = PlaceholderPic)}
										rounded
										src={`${s3Url}${m.src}`}
									/>
									<ReactTooltip
										className="tooltipClass"
										effect="solid"
										id={`groupsMember${i}`}
										multiline={false}
										place="left"
										type="dark"
									/>
								</div>
							))}
						</div>
					</div>

					<Header as="h1">Evangelical Grifters</Header>
					<p>
						Sleazy televangelist types, bible thumpers and hate preachers. Many of the
						more homophobic ones are closeted gay themselves.
					</p>
					<div className="gallery-wrapper">
						<div className="tiles">
							{evangelicals.map((m, i) => (
								<div className="tile" key={`tileKey${i}`}>
									<Image
										data-for={`groupsMember${i}`}
										data-iscapture="true"
										data-tip={m.name}
										onClick={() =>
											history.push(`/pages/${m.network}/${m.username}`)
										}
										onError={(e) => (e.target.src = PlaceholderPic)}
										rounded
										src={`${s3Url}${m.src}`}
									/>
									<ReactTooltip
										className="tooltipClass"
										effect="solid"
										id={`groupsMember${i}`}
										multiline={false}
										place="left"
										type="dark"
									/>
								</div>
							))}
						</div>
					</div>

					<Header as="h1">Cryptocurrency Grifters</Header>
					<p>
						Grifting in the cryptocurrency realm is a lot like grifting as a psychic.
						What does a psychic do when they perform a cold reading? Basically, just
						play a guessing game. Make a bunch of predictions about stuff. Most will be
						wrong. But some, if you make enough of them, will ultimately come true
						because of pure luck. Take credit for the ones that came true and completely
						ignore the ones that didn't. Rinse and repeat. Crypto grifters are financial
						fortune tellers who seize on young and naive peoples' desire to get rich
						quick.
					</p>
					<div className="gallery-wrapper">
						<div className="tiles">
							{crypto.map((m, i) => (
								<div className="tile" key={`tileKey${i}`}>
									<Image
										data-for={`groupsMember${i}`}
										data-iscapture="true"
										data-tip={m.name}
										onClick={() =>
											history.push(`/pages/${m.network}/${m.username}`)
										}
										onError={(e) => (e.target.src = PlaceholderPic)}
										rounded
										src={`${s3Url}${m.src}`}
									/>
									<ReactTooltip
										className="tooltipClass"
										effect="solid"
										id={`groupsMember${i}`}
										multiline={false}
										place="left"
										type="dark"
									/>
								</div>
							))}
						</div>
					</div>

					<Header as="h1">Blue Check Mark Grifters</Header>
					<p>
						These are opportunistic grifters of the Ivanka Trump flavor. Usually Ivy
						League educated Forbes 30 under 30 types. I
					</p>
					<div className="gallery-wrapper">
						<div className="tiles">
							{blueCheckMark.map((m, i) => (
								<div className="tile" key={`tileKey${i}`}>
									<Image
										data-for={`groupsMember${i}`}
										data-iscapture="true"
										data-tip={m.name}
										onClick={() =>
											history.push(`/pages/${m.network}/${m.username}`)
										}
										onError={(e) => (e.target.src = PlaceholderPic)}
										rounded
										src={`${s3Url}${m.src}`}
									/>
									<ReactTooltip
										className="tooltipClass"
										effect="solid"
										id={`groupsMember${i}`}
										multiline={false}
										place="left"
										type="dark"
									/>
								</div>
							))}
						</div>
					</div>

					<Header as="h1">What do all of these grifters have in common?</Header>
					<p>
						They all pull from the same bag of tricks. They all employ the same core
						arguments and take advantage of the same human weaknesses in pursuit of
						either enriching themselves and/or advancing an agenda. Whatever success
						they have had at conning people, it's much more a testament to the
						gullibility and desperation of their audience than it is to any supposed
						skill on their side.
					</p>

					<Header as="h1">What do all of the victims of these grifters in common?</Header>
					<p>
						The MLM capital of the US is Salt Lake City, Utah, which is also the Mormon
						capital of the US, which is also in a deeply red state. When people choose
						to believe conspiracy theories they usually don't believe just one; they
						believe all of them - even if they conflict with each other. There's no
						polite way to say this, but the victims of these grifts are gullible people
						in probably almost every facet of their lives. It's why there's so much
						overlap between the Qanon, Evangelical and MLM communities. If someone has
						made a conscious decision to dedicate their life to an imaginary person, how
						hard could it possibly be to convice that person that they'll get rich quick
						or that JFK Jr. will come back from the dead in Dallas one fall afternoon?
						Probably not that hard. If there's one thing that grifters deserve credit
						for, it's spotting a good mark when they see one.
					</p>

					<Divider hidden />
				</Grid.Column>
			</Grid>
		</DefaultLayout>
	)
}

Grifters.propTypes = {
	history: PropTypes.object
}

export default Grifters
