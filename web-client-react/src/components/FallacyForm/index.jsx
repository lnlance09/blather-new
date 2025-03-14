import "./style.scss"
import {
	Button,
	Divider,
	Dropdown,
	Form,
	Grid,
	Image,
	Label,
	Placeholder,
	Segment,
	Transition
} from "semantic-ui-react"
import { useEffect, useReducer, useRef, useState } from "react"
import { getGroupsOptions } from "options/group"
import { getDropdownOptions } from "options/page"
import { getReferenceOptions } from "options/reference"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import _ from "underscore"
import axios from "axios"
import ImageUpload from "components/ImageUpload"
import initialState from "./state"
import logger from "use-reducer-logger"
import PlaceholderPic from "images/images/image-square.png"
import PropTypes from "prop-types"
import reducer from "./reducer"

const toastConfig = getConfig()
toast.configure(toastConfig)

const FallacyForm = ({
	cTweetId = null,
	cVideoId = null,
	endTime = null,
	endTimeCont = null,
	groupId = null,
	highlightedText = "",
	highlightedTextC = "",
	history,
	inverted,
	pageId = null,
	refId = 1,
	showPageSelection = false,
	startTime = null,
	startTimeCont = null,
	tweetId = null,
	videoId = null
}) => {
	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)

	const { groupOptions, images, imagesLoading, pageOptions, refOptions } = internalState

	const explanationRef = useRef(null)

	const [groupValue, setGroupValue] = useState(1)
	const [loading, setLoading] = useState(false)
	const [pageValue, setPageValue] = useState(pageId ? pageId : 6)
	const [refValue, setRefValue] = useState(refId)

	const activeRef =
		refOptions.length > 0 ? refOptions.filter((ref) => ref.value === refValue)[0] : null

	const onChangePage = (e, { value }) => {
		setPageValue(value)
	}

	const onChangeGroup = (e, { value }) => {
		setGroupValue(value)
	}

	const addImage = async (file) => {
		const formData = new FormData()
		formData.set("file", file)

		const explanation = _.isEmpty(explanationRef.current) ? "" : explanationRef.current.value

		dispatch({
			type: "TOGGLE_IMAGES_LOADING"
		})

		await axios
			.post(`${process.env.REACT_APP_BASE_URL}fallacies/addImage`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					enctype: "multipart/form-data"
				}
			})
			.then((response) => {
				const { image } = response.data
				dispatch({
					type: "SET_IMAGES",
					image
				})

				explanationRef.current.value = `${explanation} \n \n ![Caption](${image} "")`
				explanationRef.current.focus()
			})
			.catch(() => {
				toast.error("Error uploading image")
			})
	}

	const submitFallacy = async () => {
		const explanation = _.isEmpty(explanationRef.current) ? "" : explanationRef.current.value
		setLoading(true)
		await axios
			.post(
				`${process.env.REACT_APP_BASE_URL}fallacies/create`,
				{
					cTweet: cTweetId,
					cVideo: cVideoId,
					endTime,
					endTimeCont,
					explanation,
					highlightedText,
					highlightedTextC,
					groupId,
					refId: refValue,
					startTime,
					startTimeCont,
					tweet: tweetId,
					video: videoId
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
				const { status } = error.response
				const { errors } = error.response.data

				if (status === 401) {
					errorMsg = error.response.data.message
				} else {
					if (!_.isEmpty(errors.explanation)) {
						errorMsg = errors.explanation[0]
					}

					if (!_.isEmpty(errors.tweet)) {
						errorMsg = errors.tweet[0]
					}
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
			const options = await getReferenceOptions(null, false)
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

	useEffect(() => {
		setRefValue(refId)
	}, [refId])

	return (
		<div className={`fallacyFormComponent ${inverted ? "inverted" : ""}`}>
			<Transition animation="fade up" duration={1200} visible={refOptions.length > 0}>
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
						<div className="refWrapper">
							<Label.Group color="blue" size="large">
								{refOptions.map((ref, i) => {
									const { value } = ref
									let disabled = false
									if (value !== 21 && value !== 35) {
										disabled = cTweetId !== null
									}
									const active = refValue === value ? "active" : ""
									return (
										<Label
											className={`ref ${active} ${
												disabled ? "disabled" : ""
											}`}
											key={`refLabel${i}`}
											onClick={() => {
												setRefValue(value)
												document
													.getElementById("refDescSeg")
													.scrollIntoView({
														behavior: "smooth"
													})
											}}
										>
											{ref.name}
										</Label>
									)
								})}
							</Label.Group>
							<Divider hidden />
							{activeRef && (
								<Segment
									id="refDescSeg"
									className="refDescSeg"
									placeholder
									textAlign="center"
								>
									{activeRef.description}
								</Segment>
							)}
						</div>
					</Form.Field>
					<Form.Field>
						<textarea
							id="explanation"
							placeholder="👉 Please explain how this is fallacious."
							ref={explanationRef}
							rows={7}
						/>

						{(images.length > 0 || imagesLoading) && <Divider inverted />}

						<Image.Group size="small">
							{images.map((img, i) => (
								<Image
									key={img}
									label={{
										as: "a",
										color: "red",
										corner: "right",
										icon: "close",
										onClick: () => {
											dispatch({
												type: "REMOVE_IMAGE",
												key: i
											})

											const explanation = _.isEmpty(explanationRef.current)
												? ""
												: explanationRef.current.value
											explanationRef.current.value = explanation.replace(
												`![Caption](${img} "")`,
												""
											)
											explanationRef.current.focus()
										}
									}}
									onLoad={(e) => (e.target.src = img)}
									rounded
									src={PlaceholderPic}
								/>
							))}
							{imagesLoading && (
								<Placeholder as={Image} rounded size="large">
									<Placeholder.Image
										onError={(i) => (i.target.src = PlaceholderPic)}
									/>
								</Placeholder>
							)}
						</Image.Group>

						{(images.length > 0 || imagesLoading) && <Divider />}
					</Form.Field>
					<Form.Field>
						<Grid>
							<Grid.Row>
								<Grid.Column computer={15} mobile={12}>
									<Button
										color="black"
										content="Submit"
										fluid
										loading={loading}
										size="large"
									/>
								</Grid.Column>
								<Grid.Column computer={1} mobile={4} style={{ paddingLeft: 0 }}>
									<ImageUpload
										as="button"
										callback={(file) => addImage(file)}
										headerSize="tiny"
										inverted={inverted}
										msg="add image"
									/>
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</Form.Field>
				</Form>
			</Transition>
		</div>
	)
}

FallacyForm.propTypes = {
	cTweetId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
	cVideoId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
	endTime: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
	endTimeCont: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
	groupId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
	highlightedText: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
	highlightedTextC: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
	inverted: PropTypes.bool,
	pageId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
	refId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
	showPageSelection: PropTypes.bool,
	startTime: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
	startTimeCont: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
	tweetId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
	videoId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
}

export default FallacyForm
