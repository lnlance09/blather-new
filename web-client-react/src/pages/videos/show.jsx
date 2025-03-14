import { Header } from "semantic-ui-react"
import { useContext, useEffect } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import DefaultLayout from "layouts/default"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const Video = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	useEffect(() => {}, [])

	return (
		<DefaultLayout activeItem="video" containerClassName="videoPage" history={history}>
			<DisplayMetaTags page="video" />

			<Header as="h1" content="" inverted={inverted} />
		</DefaultLayout>
	)
}

Video.propTypes = {
	history: PropTypes.object
}

export default Video
