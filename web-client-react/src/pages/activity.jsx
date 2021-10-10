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

			<Header as="h1" content="Activity" inverted={inverted} />

			<Divider hidden />
		</DefaultLayout>
	)
}

Activity.propTypes = {
	history: PropTypes.object
}

export default Activity
