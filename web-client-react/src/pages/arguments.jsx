import { Divider, Header } from "semantic-ui-react"
import { useContext, useEffect } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import DefaultLayout from "layouts/default"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const Arguments = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	useEffect(() => {}, [])

	return (
		<DefaultLayout
			activeItem="about"
			containerClassName="aboutPage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="arguments" />

			<Header as="h1" content="About" inverted={inverted} />

			<Header as="p" inverted={inverted}></Header>

			<Header as="h2" content="Supported Coins" inverted={inverted} />

			<Divider hidden />
		</DefaultLayout>
	)
}

Arguments.propTypes = {
	history: PropTypes.object
}

export default Arguments
