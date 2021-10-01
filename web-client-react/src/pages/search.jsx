import { Divider, Header, List } from "semantic-ui-react"
import { useContext, useEffect, useReducer } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { Link } from "react-router-dom"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/search"
import logger from "use-reducer-logger"
import PropTypes from "prop-types"
import reducer from "reducers/search"
import ThemeContext from "themeContext"

const Search = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { fallacies, pages, users } = internalState
	console.log("fallacies", fallacies)

	useEffect(() => {
		getFallacies()
	}, [])

	const getFallacies = async () => {
		axios
			.get(`${process.env.REACT_APP_BASE_URL}fallacies`)
			.then((response) => {
				const fallacies = response.data.data
				dispatch({
					type: "SEARCH_FALLACIES",
					fallacies
				})
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	return (
		<DefaultLayout
			activeItem="search"
			containerClassName="searchPage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="search" />

			<Divider hidden />
		</DefaultLayout>
	)
}

Search.propTypes = {
	history: PropTypes.object
}

export default Search
