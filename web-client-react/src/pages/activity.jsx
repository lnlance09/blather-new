import { Divider, Header } from "semantic-ui-react"
import { useContext, useEffect } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import DefaultLayout from "layouts/default"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const Activity = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	useEffect(() => {}, [])

	return (
		<DefaultLayout
			activeItem="activity"
			containerClassName="activityPage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="activity" />

			<Header as="h1" content="About" inverted={inverted} />

			<Header as="p" inverted={inverted}></Header>

			<Header as="h2" content="Supported Coins" inverted={inverted} />

			<Divider hidden />
		</DefaultLayout>
	)
}

Activity.propTypes = {
	history: PropTypes.object
}

export default Activity
