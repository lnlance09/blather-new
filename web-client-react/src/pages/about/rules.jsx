import { Divider, Header } from "semantic-ui-react"
import { useContext } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
// import { Link } from "react-router-dom"
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

			{/*
			<Header as="h2" content="Edits" inverted={inverted} />
			<Header as="p" inverted={inverted}>
				Predictions cannot be edited after they have been submitted. This is meant to
				prevent people from trying to save face after one of their predictions fails to
				materialize.
			</Header>
			*/}

			<Divider hidden />
		</DefaultLayout>
	)
}

Rules.propTypes = {
	history: PropTypes.object
}

export default Rules
