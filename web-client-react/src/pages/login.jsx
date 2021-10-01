import { useContext } from "react"
import { Container } from "semantic-ui-react"
import { DisplayMetaTags } from "utils/metaFunctions"
import Authentication from "components/Authentication"
import DefaultLayout from "layouts/default"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const SignIn = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const params = new URLSearchParams(window.location.search)
	const type = params.get("type")

	return (
		<DefaultLayout
			containerClassName="signInPage"
			history={history}
			inverted={state.inverted}
			simpleHeader
		>
			<DisplayMetaTags page="signin" />
			<Container className="authContainer" textAlign="center">
				<Authentication
					history={history}
					inverted={state.inverted}
					showLogin={type !== "join"}
				/>
			</Container>
		</DefaultLayout>
	)
}

SignIn.propTypes = {
	history: PropTypes.object
}

export default SignIn
