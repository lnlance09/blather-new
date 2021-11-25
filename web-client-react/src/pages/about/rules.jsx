import { Divider, Header } from "semantic-ui-react"
import { useContext } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import DefaultLayout from "layouts/default"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const Rules = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	return (
		<DefaultLayout activeItem="rules" containerClassName="rulesPage" history={history}>
			<DisplayMetaTags page="rules" />

			<Header as="h1" content="Rules" inverted={inverted} />

			<p className="description">
				Rules are pretty simple. Just try to understand what the fallacies are before you
				assign them. Keep in mind that while uncommon, it does occassionally happen that
				someone genuinely changes their mind.
			</p>

			<Divider hidden />
		</DefaultLayout>
	)
}

Rules.propTypes = {
	history: PropTypes.object
}

export default Rules
