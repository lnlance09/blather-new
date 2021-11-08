import { Button, Divider, Form, Header, Label, Placeholder, Segment } from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { formatPlural } from "utils/textFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/reference"
import logger from "use-reducer-logger"
import NumberFormat from "react-number-format"
import PropTypes from "prop-types"
import reducer from "reducers/reference"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Reference = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { auth, inverted, user } = state

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { loaded, reference } = internalState

	const [loading, setLoading] = useState(false)

	const canEdit = auth && user.id === 1

	useEffect(() => {
		getReference()
	}, [])

	const getReference = async () => {
		axios
			.get(`${process.env.REACT_APP_BASE_URL}reference`)
			.then((response) => {
				const ref = response.data.data
				dispatch({
					type: "GET_REFERENCES",
					ref
				})
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	const updateRef = async (id, value) => {
		axios
			.post(
				`${process.env.REACT_APP_BASE_URL}reference/${id}/update`,
				{
					value
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("bearer")}`
					}
				}
			)
			.then((response) => {
				const ref = response.data.data
				dispatch({
					type: "UPDATE_REFERENCE",
					ref
				})
				toast.success("Changed!")
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	return (
		<DefaultLayout activeItem="reference" containerClassName="referencePage" history={history}>
			<DisplayMetaTags page="reference" />

			<Header as="h1" inverted={inverted}>
				Reference
			</Header>

			{reference.map((item, i) => {
				return (
					<Segment
						className="refSegment"
						key={`refSegment${i}`}
						onClick={() => {
							if (loaded && !canEdit) {
								history.push(`/search/?type=fallacies&refIds[]=${item.id}`)
							}
						}}
					>
						{loaded ? (
							<>
								<Header as="h3">{item.name}</Header>
								{canEdit ? (
									<Form>
										<Form.Field>
											<textarea
												defaultValue={item.description}
												id={`refText${i}`}
												rows={6}
												placeholder="Enter description"
												style={{
													width: "100%"
												}}
											/>
										</Form.Field>
										<Form.Field>
											<Button
												color="orange"
												content="Save"
												fluid
												loading={loading}
												onClick={async () => {
													setLoading(true)
													const value = document.getElementById(
														`refText${i}`
													).value
													await updateRef(item.id, value)
													setLoading(false)
												}}
											/>
										</Form.Field>
									</Form>
								) : (
									<p>{item.description}</p>
								)}

								{item.fallacyCount > 0 && (
									<>
										<Divider hidden />
										<Label attached="bottom left" color="blue">
											<NumberFormat
												displayType={"text"}
												thousandSeparator
												value={item.fallacyCount}
											/>{" "}
											{formatPlural(item.fallacyCount, "example")}
										</Label>
									</>
								)}
							</>
						) : (
							<Placeholder fluid>
								<Placeholder.Paragraph>
									<Placeholder.Line />
									<Placeholder.Line />
									<Placeholder.Line />
								</Placeholder.Paragraph>
							</Placeholder>
						)}
					</Segment>
				)
			})}
			<Divider hidden section />
		</DefaultLayout>
	)
}

Reference.propTypes = {
	history: PropTypes.object
}

export default Reference
