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
		<DefaultLayout activeItem="privacy" containerClassName="privacyPage" history={history}>
			<DisplayMetaTags page="privacy" />

			<Header as="h1" className="massive" content="Privacy" inverted={inverted} />

			<p className="description">
				You're asked to sign in with Twitter because that way you'll be able to see tweets
				using your own API token. API requests get limited to a certain amount per hour so
				too many people using the default one can result in some tweets not appearing. No
				data is collected that isn't publicly available on Twitter. However, tweets that are
				later deleted by their authors will still be available on here if they've been
				archived.
			</p>
		</DefaultLayout>
	)
}

Privacy.propTypes = {
	history: PropTypes.object
}

export default Privacy
