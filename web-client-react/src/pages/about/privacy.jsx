import { Header } from "semantic-ui-react"
import { useContext } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import DefaultLayout from "layouts/default"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const Privacy = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	return (
		<DefaultLayout
			activeItem="privacy"
			containerClassName="privacyPage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="privacy" />

			<Header as="h1" className="massive" content="Privacy" inverted={inverted} />
		</DefaultLayout>
	)
}

Privacy.propTypes = {
	history: PropTypes.object
}

export default Privacy
