import { Divider, Grid, Header, Image } from "semantic-ui-react"
import { useContext } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { grifters } from "options/grifters"
import DefaultLayout from "layouts/default"
import PlaceholderPic from "images/images/image-square.png"
import PropTypes from "prop-types"
import ReactTooltip from "react-tooltip"
import ThemeContext from "themeContext"

const Grifters = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	const { maga } = grifters

	return (
		<DefaultLayout
			activeItem="grifters"
			containerClassName="griftersPage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="grifters" />

			<Grid>
				<Grid.Column width={16}>
					<Header as="h1">What is a Grifter?</Header>

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
						failed comedians/musicians/actors etc. And it’s easy. Super easy. It’s
						literally reciting scripted talking points and telling your audience what
						they already believe, but doing it as a one dimensional personality brand.
						Extra points in one is a member of a marginalized group.
					</p>

					<div className="gallery-wrapper">
						<div className="tiles">
							{maga.map((m, i) => (
								<div className="tile">
									<Image
										data-for={`groupsMember${i}`}
										data-iscapture="true"
										data-tip={m.name}
										onClick={() =>
											history.push(`/pages/${m.network}/${m.username}`)
										}
										onError={(e) => (e.target.src = PlaceholderPic)}
										rounded
										src={m.src}
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
					<p></p>

					<Header as="h1">Anti-Vaxx Grifters</Header>
					<p></p>

					<Header as="h1">Cryptocurrency Grifters</Header>
					<p>
						Grifting in the cryptocurrency realm is a lot like grifting as a psychic.
						What does a psychic do when they perform a cold reading? Basically, just
						play a guessing game. Make a bunch of predictions about stuff. Most will be
						wrong. But some, if you make enough of them, will ultimately come true
						because of pure luck. Take credit for the ones that came true and completely
						ignore the ones that didn't. Rinse and repeat. d
					</p>

					<Header as="h1">Evangelical Grifters</Header>
					<p></p>

					<Header as="h1">Entrepreneurial Grifters</Header>
					<p>
						These are opportunistic grifters of the Ivanka Trump flavor. Usually Ivy
						League educated Forbes 30 under 30 types. I
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
