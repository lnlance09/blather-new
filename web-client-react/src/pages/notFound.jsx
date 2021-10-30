import { Header } from "semantic-ui-react"
import { useContext } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import DefaultLayout from "layouts/default"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const NotFound = ({ history }) => {
	const { inverted } = useContext(ThemeContext)

	return (
		<DefaultLayout
			activeItem=""
			containerClassName="notFoundPage"
			history={history}
			inverted={inverted}
		>
			<DisplayMetaTags page="notFound" />
			<Header as="h1" className="notFoundHeader" inverted={inverted} size="large">
				This page does not exist!
			</Header>
		</DefaultLayout>
	)
}

NotFound.propTypes = {
	history: PropTypes.object
}

export default NotFound
