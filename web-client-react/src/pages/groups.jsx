import { Header } from "semantic-ui-react"
import { useContext } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import DefaultLayout from "layouts/default"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const Groups = ({ history }) => {
	const { inverted } = useContext(ThemeContext)

	return (
		<div className="notFoundPage">
			<DisplayMetaTags page="notFound" />

			<DefaultLayout
				activeItem=""
				containerClassName="notFoundPage"
				history={history}
				inverted={inverted}
			>
				<Header as="h1" className="notFoundHeader" inverted={inverted} size="large">
					This page does not exist!
				</Header>
			</DefaultLayout>
		</div>
	)
}

Groups.propTypes = {
	history: PropTypes.object
}

export default Groups
