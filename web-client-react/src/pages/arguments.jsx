import { Button, Card, Divider, Dropdown, Header, Icon, Placeholder } from "semantic-ui-react"
import { useContext, useEffect, useReducer } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { argOptions } from "options/arguments"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import _ from "underscore"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/arguments"
import logger from "use-reducer-logger"
import PropTypes from "prop-types"
import reducer from "reducers/arguments"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Arguments = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { data, loaded } = internalState

	useEffect(() => {
		getArguments()
	}, [])

	const getArguments = async () => {
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}arguments`)
			.then(async (response) => {
				const { data } = response.data
				dispatch({
					type: "GET_ARGUMENTS",
					arguments: data
				})
			})
			.catch(() => {
				toast.error("Error fetching arguments")
			})
	}

	const PlaceholderContent = (
		<Card.Content>
			<Placeholder fluid inverted={inverted}>
				<Placeholder.Header image>
					<Placeholder.Line />
					<Placeholder.Line />
				</Placeholder.Header>
				<Placeholder.Paragraph>
					<Placeholder.Line length="full" />
					<Placeholder.Line length="long" />
					<Placeholder.Line length="short" />
				</Placeholder.Paragraph>
			</Placeholder>
		</Card.Content>
	)

	return (
		<DefaultLayout
			activeItem="arguments"
			containerClassName="argumentsPage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="arguments" />

			<Header as="h1" content="Arguments" inverted={inverted} />

			<Dropdown fluid options={argOptions} selection value={1} />

			<Header as="p" inverted={inverted}>
				These are some of the most ubiquitous right-wing talking points. These aren't
				particularly good arguments but they're certainly some of the most common. Plenty of
				people have crafted personal brands and built entire careers as pundits by doing
				nothing more than repeating a handful of these tired talking points.
			</Header>

			<Divider hidden />

			{data.map((arg, i) => {
				const { contradictions, description, explanation } = arg
				const hasContradictions = loaded ? !_.isEmpty(contradictions.data) : false
				return (
					<Card fluid>
						{loaded ? (
							<>
								<Card.Content>
									<Card.Header>{description}</Card.Header>
									<Card.Description>{explanation}</Card.Description>
									{hasContradictions && (
										<>
											<Header as="h3" content="What this contradicts" />
											{contradictions.data.map((c) => (
												<Card fluid>
													<Card.Content>
														<Card.Header>{c.description}</Card.Header>
														<Card.Description>
															{c.explanation}
														</Card.Description>
													</Card.Content>
												</Card>
											))}
										</>
									)}
								</Card.Content>
								<Card.Content extra>
									<Button color="blue" compact>
										See examples
										<Icon name="arrow right" />
									</Button>
								</Card.Content>
							</>
						) : (
							<>{PlaceholderContent}</>
						)}
					</Card>
				)
			})}

			<Divider hidden section />
		</DefaultLayout>
	)
}

Arguments.propTypes = {
	history: PropTypes.object
}

export default Arguments
