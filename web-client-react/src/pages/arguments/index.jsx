import {
	Button,
	Card,
	Divider,
	Dropdown,
	Form,
	Header,
	Icon,
	Label,
	Placeholder
} from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { getArgumentOptions } from "options/arguments"
import { DisplayMetaTags } from "utils/metaFunctions"
import { argumentOptions } from "options/arguments"
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
	const { auth, inverted, user } = state

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { argOptions, args, loaded } = internalState

	const [contradictions, setContradictions] = useState([])

	const canEdit = auth && user.id === 1

	const getArgOptions = async () => {
		const options = await getArgumentOptions()
		dispatch({
			type: "SET_ARGUMENT_OPTIONS",
			options
		})
	}

	useEffect(() => {
		const start = async () => {
			await getArgOptions()
			getArguments()
		}

		start()
	}, [])

	const getArguments = async () => {
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}arguments`)
			.then(async (response) => {
				const { data } = response.data
				dispatch({
					type: "GET_ARGUMENTS",
					args: data
				})
			})
			.catch(() => {
				toast.error("Error fetching arguments")
			})
	}

	const updateArg = async (id, description, explanation, contradictions) => {
		await axios
			.post(
				`${process.env.REACT_APP_BASE_URL}arguments/${id}/update`,
				{
					description,
					explanation,
					contradictions
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("bearer")}`
					}
				}
			)
			.then((response) => {
				const args = response.data.data
				dispatch({
					type: "UPDATE_ARGUMENT",
					args
				})
				toast.success("Changed!")
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	const onChangeC = async (e, { value }) => {
		setContradictions(value)
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

			<Dropdown fluid options={argumentOptions} selection value={1} />

			<Header as="p" inverted={inverted}>
				These are some of the most ubiquitous right-wing talking points. These aren't
				particularly good arguments but they're certainly some of the most common. Plenty of
				people have crafted personal brands and built entire careers as pundits by doing
				nothing more than repeating a handful of these tired talking points.
			</Header>

			<Divider hidden />

			{args.map((arg, i) => {
				const { contradictions, description, explanation } = arg
				const hasContradictions = loaded ? !_.isEmpty(contradictions.data) : false
				return (
					<Card fluid>
						{loaded ? (
							<>
								<Card.Content>
									{canEdit ? (
										<>
											<Form>
												<Form.Field>
													<input
														defaultValue={arg.description}
														id={`descText${i}`}
														rows={6}
														placeholder="Enter title"
														style={{
															width: "100%"
														}}
													/>
												</Form.Field>
												<Form.Field>
													<textarea
														defaultValue={arg.explanation}
														id={`expText${i}`}
														rows={6}
														placeholder="Enter description"
														style={{
															width: "100%"
														}}
													/>
												</Form.Field>
												<Form.Field>
													<Dropdown
														fluid
														multiple
														onChange={onChangeC}
														options={argOptions}
														placeholder="Contradictions"
														renderLabel={(item) => {
															return (
																<Label
																	color="blue"
																	content={item.name}
																/>
															)
														}}
														search
														selection
														value={arg.contradictionOptions}
													/>
												</Form.Field>
												<Form.Field>
													<Button
														color="red"
														content="Save"
														fluid
														onClick={() => {
															const explanation =
																document.getElementById(
																	`expText${i}`
																).value
															const description =
																document.getElementById(
																	`descText${i}`
																).value
															updateArg(
																arg.id,
																description,
																explanation
															)
														}}
													/>
												</Form.Field>
											</Form>
										</>
									) : (
										<>
											<Card.Header>{description}</Card.Header>
											<Card.Description>{explanation}</Card.Description>
											{hasContradictions && (
												<>
													<Header
														as="h3"
														content="What this contradicts"
													/>
													{contradictions.data.map((c) => (
														<Card fluid>
															<Card.Content>
																<Card.Header>
																	{c.description}
																</Card.Header>
																<Card.Description>
																	{c.explanation}
																</Card.Description>
															</Card.Content>
														</Card>
													))}
												</>
											)}
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
