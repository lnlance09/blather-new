import { Header, List } from "semantic-ui-react"
import { useContext, useEffect } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import DefaultLayout from "layouts/default"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const About = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	useEffect(() => {}, [])

	return (
		<DefaultLayout activeItem="about" containerClassName="aboutPage" history={history}>
			<DisplayMetaTags page="about" />

			<Header as="h1" content="About" inverted={inverted} />

			<p className="description">
				Blather is an educational tool that allows users to analyze and pinpoint the
				accuracy of claims made on social media. This site is meant to help people spot out
				erroneous logic so that similar arguments will not be made in the future. However,
				there are a number of factors that make this a difficult task.
			</p>

			<List bulleted inverted={inverted} size="large">
				<List.Item>Cognitive dissonance</List.Item>
				<List.Item>Confirmation bias</List.Item>
				<List.Item>Conspiratorial thinking</List.Item>
				<List.Item>Ego</List.Item>
				<List.Item>Fear or a reluctance to admit when we’re wrong</List.Item>
				<List.Item>Groupthink</List.Item>
				<List.Item>Ideology</List.Item>
				<List.Item>Ignorance</List.Item>
				<List.Item>Intellectual laziness</List.Item>
				<List.Item>Lack of self-awareness</List.Item>
				<List.Item>Political partisanship</List.Item>
				<List.Item>Style over substance</List.Item>
				<List.Item>Tradition</List.Item>
				<List.Item>Tribalism</List.Item>
			</List>

			<p className="description">
				Unfortunately, all of those are baked into the human psyche and they help contribute
				to a toxic landscape that hinders perfectly sane people from engaging in honest,
				fact-based discussions. In essence, Blather is about restoring what it means to have
				a discussion; which is to change minds.
			</p>
		</DefaultLayout>
	)
}

About.propTypes = {
	history: PropTypes.object
}

export default About
