import { Divider, Header, Segment } from "semantic-ui-react"
import { useContext, useEffect, useReducer } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
// import { Link } from "react-router-dom"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/reference"
import logger from "use-reducer-logger"
import PropTypes from "prop-types"
import reducer from "reducers/reference"
import ThemeContext from "themeContext"

const Reference = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { reference } = internalState

	useEffect(() => {
		getReference()
	}, [])

	const getReference = async () => {
		axios
			.get(`${process.env.REACT_APP_BASE_URL}reference`)
			.then((response) => {
				const ref = response.data.data
				dispatch({
					type: "GET_REFERENCE",
					ref
				})
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	return (
		<DefaultLayout
			activeItem="reference"
			containerClassName="referencePage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="reference" />

			<Header as="h1">Reference</Header>

			{reference.map((item) => {
				return (
					<Segment>
						<Header as="h3">{item.name}</Header>
						<p>{item.description}</p>
					</Segment>
				)
			})}
			<Divider hidden />
		</DefaultLayout>
	)
}

Reference.propTypes = {
	history: PropTypes.object
}

export default Reference
