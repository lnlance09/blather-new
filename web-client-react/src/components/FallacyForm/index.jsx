import "./style.scss"
import { Button, Divider, Dropdown, Form, Header, Label, Transition } from "semantic-ui-react"
import { useEffect, useReducer, useRef, useState } from "react"
import { getGroupsOptions } from "options/group"
import { getDropdownOptions } from "options/page"
import { getReferenceOptions } from "options/reference"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import _ from "underscore"
import axios from "axios"
import initialState from "./state"
import logger from "use-reducer-logger"
import PropTypes from "prop-types"
import reducer from "./reducer"

const toastConfig = getConfig()
toast.configure(toastConfig)

const FallacyForm = ({
	auth,
	cTweetId = null,
	groupId = null,
	history,
	inverted,
	pageId = null,
	showPageSelection = false,
	tweetId = null
}) => {
	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)

	const { groupOptions, pageOptions, refOptions } = internalState

	const explanationRef = useRef(null)

	const [groupValue, setGroupValue] = useState(1)
	const [loading, setLoading] = useState(false)
	const [pageValue, setPageValue] = useState(pageId ? pageId : 6)
	const [refValue, setRefValue] = useState(1)

	const activeRef =
		refOptions.length > 0 ? refOptions.filter((ref) => ref.value === refValue)[0] : null

	const onChangePage = (e, { value }) => {
		setPageValue(value)
	}

	const onChangeRef = (e, { value }) => {
		setRefValue(value)
	}

	const onChangeGroup = (e, { value }) => {
		setGroupValue(value)
	}

	const submitFallacy = async () => {
		const explanation = _.isEmpty(explanationRef.current) ? "" : explanationRef.current.value
		setLoading(true)
		await axios
			.post(
				`${process.env.REACT_APP_BASE_URL}fallacies/create`,
				{
					cTweet: cTweetId,
					explanation,
					refId: refValue,
					tweet: tweetId
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("bearer")}`
					}
				}
			)
			.then((response) => {
				const { data } = response.data
				history.push(`/fallacies/${data.slug}`)
			})
			.catch((error) => {
				let errorMsg = ""
				const { errors } = error.response.data

				if (!_.isEmpty(errors.explanation)) {
					errorMsg = errors.explanation[0]
				}

				if (!_.isEmpty(errors.tweet)) {
					errorMsg = errors.tweet[0]
				}

				setLoading(false)
				toast.error(errorMsg)
			})
	}

	useEffect(() => {
		const getPageOptions = async (groupId) => {
			const options = await getDropdownOptions(groupId)
			dispatch({
				type: "SET_PAGE_OPTIONS",
				options
			})
		}
		getPageOptions(groupId)
		setGroupValue(groupId)
	}, [groupId])

	useEffect(() => {
		setPageValue(pageId)
	}, [pageId])

	useEffect(() => {
		const getRefOptions = async () => {
			const options = await getReferenceOptions()
			dispatch({
				type: "SET_REFERENCE_OPTIONS",
				options
			})
		}

		const getGroupOptions = async () => {
			const options = await getGroupsOptions()
			dispatch({
				type: "SET_GROUP_OPTIONS",
				options
			})
		}

		getGroupOptions()
		getRefOptions()
	}, [])

	return (
		<div className={`fallacyFormComponent ${inverted ? "inverted" : null}`}>
			<Form inverted onSubmit={submitFallacy} size="large">
				{showPageSelection && (
					<Form.Group>
						<Form.Field width={8}>
							<Dropdown
								clearable
								disabled={groupId === null}
								fluid
								loading={groupOptions.length === 0}
								onChange={onChangeGroup}
								options={groupOptions}
								placeholder="Group"
								search
								selection
								value={groupValue}
							/>
						</Form.Field>
						<Form.Field width={8}>
							<Dropdown
								clearable
								disabled={groupId === null && pageId !== null}
								fluid
								loading={pageOptions.length === 0}
								onChange={onChangePage}
								options={pageOptions}
								placeholder="Page"
								search
								selection
								value={pageValue}
							/>
						</Form.Field>
					</Form.Group>
				)}
				<Form.Field>
					<div style={{ minHeight: "210px" }}>
						<Transition
							animation="pulse"
							duration={400}
							visible={refOptions.length > 0}
						>
							<>
								<Label.Group color="blue" size="large">
									{refOptions.map((ref, i) => (
										<Label
											className={`${refValue === ref.value ? "active" : ""}`}
											color={refValue === ref.value ? "orange" : "blue"}
											key={`refLabel${i}`}
											onClick={() => setRefValue(ref.value)}
										>
											{ref.name}
										</Label>
									))}
								</Label.Group>
								<Divider inverted />
								{activeRef && (
									<>
										<Header as="p" inverted size="small" textAlign="center">
											{activeRef.description}
										</Header>
										<Divider inverted section />
									</>
								)}
							</>
						</Transition>
					</div>
				</Form.Field>
				<Form.Field>
					<textarea
						id="explanation"
						placeholder="Please explain how this is fallacious."
						ref={explanationRef}
						rows={7}
					/>
				</Form.Field>
				<Form.Field>
					<Button color="blue" content="Submit" fluid loading={loading} size="large" />
				</Form.Field>
			</Form>
		</div>
	)
}

FallacyForm.propTypes = {
	auth: PropTypes.bool,
	cTweetId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
	groupId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
	inverted: PropTypes.bool,
	pageId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
	showPageSelection: PropTypes.bool,
	tweetId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
}

export default FallacyForm
