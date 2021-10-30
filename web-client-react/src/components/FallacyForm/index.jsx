import "./style.scss"
import {
	Button,
	Divider,
	Dropdown,
	Form,
	Image,
	Label,
	Placeholder,
	Segment
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

	const { groupOptions, images, imagesLoading, pageOptions, refOptions } = internalState

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
						<Label.Group color="blue" size="large">
							{refOptions.map((ref, i) => (
								<Label
									className={`${refValue === ref.value ? "active" : ""}`}
									key={`refLabel${i}`}
									onClick={() => setRefValue(ref.value)}
								>
									{ref.name}
								</Label>
							))}
						</Label.Group>
						<Divider hidden />
						{activeRef && (
							<Segment className="refDescSeg" placeholder textAlign="center">
								{activeRef.description}
							</Segment>
						)}
					</div>
				</Form.Field>
				<Form.Field>
					<textarea
						id="explanation"
						placeholder="Please explain how this is fallacious."
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
								rounded
								src={img}
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

					<ImageUpload
						as="segment"
						callback={(file) => addImage(file)}
						headerSize="tiny"
						inverted={inverted}
						msg="add image"
					/>

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
