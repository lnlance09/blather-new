import "react-responsive-carousel/lib/styles/carousel.min.css"
import {
	Button,
	Card,
	Divider,
	Feed,
	Grid,
	Header,
	Image,
	Loader,
	Modal,
	Segment,
	Visibility
} from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { Link } from "react-router-dom"
import { s3Url } from "options/aws"
import { DisplayMetaTags } from "utils/metaFunctions"
import { onClickRedirect } from "utils/linkFunctions"
import { formatPlural } from "utils/textFunctions"
import { getConfig } from "options/toast"
import { Carousel } from "react-responsive-carousel"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import ImageUpload from "components/ImageUpload"
import initialState from "states/argument"
import logger from "use-reducer-logger"
import PlaceholderPic from "images/images/image-square.png"
import PropTypes from "prop-types"
import reducer from "reducers/argument"
import ThemeContext from "themeContext"
import TweetList from "components/TweetList"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Argument = ({ history, match }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state
	const { slug } = match.params

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { argument, error, fallacies, loaded, modalTweets, purveyors, tweets } = internalState
	const { contradictions, description, explanation, id, imageOptions, images, tweetCount } =
		argument

	const hasFallacies = loaded && !error ? fallacies.length > 0 : false
	const hasPurveyors = loaded && !error ? purveyors.length > 0 : false

	const [activeItem, setActiveItem] = useState("photos")
	const [imgKey, setImgKey] = useState(null)
	const [modalOpen, setModalOpen] = useState(false)
	const [purveyorId, setPurveyorId] = useState(null)

	const [hasMoreT, setHasMoreT] = useState(false)
	const [loadingT, setLoadingT] = useState(true)
	const [loadingMoreT, setLoadingMoreT] = useState(false)
	const [pageNumberT, setPageNumberT] = useState(1)

	useEffect(() => {
		const start = async () => {
			getArgument(slug)
		}

		start()
		// eslint-disable-next-line
	}, [])

	const getArgument = async (slug) => {
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}arguments/${slug}`)
			.then(async (response) => {
				const { data } = response.data
				await getTweets([data.id], null, 3)
				await getPurveyors(data.id)
				await getFallacies(data.id)
				dispatch({
					type: "GET_ARGUMENT",
					argument: data
				})
			})
			.catch(() => {
				toast.error("Error fetching argument")
			})
	}

	const getFallacies = async (id) => {
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}arguments/getFallaciesByArg`, {
				params: {
					id
				}
			})
			.then((response) => {
				const { data } = response.data
				dispatch({
					type: "GET_FALLACIES",
					fallacies: data
				})
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	const getPurveyors = async (id) => {
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}arguments/getPagesByArg`, {
				params: {
					id
				}
			})
			.then((response) => {
				const { data } = response.data
				dispatch({
					type: "GET_PURVEYORS",
					purveyors: data
				})
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	const getTweets = async (argIds, pageIds = null, limit = null, page = 1) => {
		page === 1 ? setLoadingT(true) : setLoadingMoreT(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}tweets`, {
				params: {
					argIds,
					pageIds,
					limit,
					page
				}
			})
			.then((response) => {
				const { data, meta } = response.data
				dispatch({
					type: limit ? "GET_TWEETS" : "GET_MODAL_TWEETS",
					tweets: data,
					page,
					total: meta.total
				})
				setPageNumberT(page + 1)

				if (limit) {
					setHasMoreT(meta.current_page < meta.last_page)
				} else {
					setHasMoreT(true)
				}

				page === 1 ? setLoadingT(false) : setLoadingMoreT(false)
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	const addImage = async (file) => {
		const formData = new FormData()
		formData.set("file", file)
		formData.set("id", id)

		await axios
			.post(`${process.env.REACT_APP_BASE_URL}arguments/addImage`, formData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("bearer")}`,
					"Content-Type": "multipart/form-data",
					enctype: "multipart/form-data"
				}
			})
			.then((response) => {
				const { image, s3Link } = response.data
				dispatch({
					type: "ADD_ARGUMENT_IMAGE",
					image: image,
					s3Link
				})
				toast.success("Image added!")
			})
			.catch((error) => {
				let errorMsg = ""
				const { status } = error.response
				const { errors } = error.response.data

				if (status === 403) {
					errorMsg = error.response.data.message
				} else {
					if (typeof errors.file !== "undefined") {
						errorMsg = errors.file[0]
					}
				}

				toast.error(errorMsg)
			})
	}

	const BiggestPurveyorsCard = () => (
		<Card className="purveyorsCard" fluid>
			<Card.Content>
				<Card.Header>Biggest Purveyors</Card.Header>
			</Card.Content>
			<Card.Content>
				{!hasPurveyors && (
					<Segment basic>
						<Header size="small" textAlign="center">
							nothing
						</Header>
					</Segment>
				)}
				{hasPurveyors && (
					<Feed>
						{purveyors.map((p, i) => (
							<Feed.Event key={`purveyor${i}`}>
								<Feed.Label>
									<Image
										avatar
										floated="right"
										onError={(i) => (i.target.src = PlaceholderPic)}
										src={p.image}
									/>
								</Feed.Label>
								<Feed.Content>
									<Feed.Summary
										onClick={async () => {
											setActiveItem("tweets")
											setPurveyorId(p.id)
											setHasMoreT(false)
											setLoadingT(true)
											setLoadingMoreT(false)
											setPageNumberT(1)
											await getTweets([id], [p.id])
											setModalOpen(true)
										}}
									>
										<span className="blue">{p.name}</span>
									</Feed.Summary>
									<Feed.Meta>
										<Feed.Like>
											{p.tweetCount} {formatPlural(p.tweetCount, "example")}
										</Feed.Like>
									</Feed.Meta>
								</Feed.Content>
							</Feed.Event>
						))}
					</Feed>
				)}
			</Card.Content>
		</Card>
	)

	const ContradictionsCard = () => (
		<Card className="contradictionsCard" fluid>
			<Card.Content>
				<Card.Header>What's contradicted by this?</Card.Header>
			</Card.Content>
			<Card.Content>
				{argument.contradictionCount === 0 && <></>}
				{argument.contradictionCount > 0 && (
					<Feed>
						{contradictions.data.map((c, i) => (
							<Feed.Event
								key={`contC${i}`}
								onClick={(e) => {
									onClickRedirect(e, history, `/arguments/${c.slug}`)
								}}
							>
								<Feed.Content>
									<Feed.Summary>"{c.description}"</Feed.Summary>
									<Feed.Extra text>{c.explanation}</Feed.Extra>
								</Feed.Content>
							</Feed.Event>
						))}
					</Feed>
				)}
			</Card.Content>
		</Card>
	)

	const RelatedFallaciesCard = () => (
		<Card className="purveyorsCard" fluid>
			<Card.Content>
				<Card.Header>Related Fallacies</Card.Header>
			</Card.Content>
			<Card.Content>
				{!hasFallacies && (
					<Segment basic>
						<Header size="small" textAlign="center">
							nothing
						</Header>
					</Segment>
				)}
				{hasFallacies && (
					<Feed>
						{fallacies.map((f, i) => (
							<Feed.Event key={`related${i}`}>
								<Feed.Content>
									<Feed.Summary>
										<Link to={`/fallacies/${f.slug}`}>{f.title}</Link>
									</Feed.Summary>
								</Feed.Content>
							</Feed.Event>
						))}
					</Feed>
				)}
			</Card.Content>
		</Card>
	)

	return (
		<DefaultLayout activeItem="arguments" containerClassName="argumentPage" history={history}>
			<DisplayMetaTags page="argument" />

			{loaded ? (
				<>
					<Header as="h1" className="argumentHeader" inverted={inverted}>
						<Header.Content>
							"{description}"
							<Header.Subheader>{tweetCount} examples</Header.Subheader>
						</Header.Content>
					</Header>

					<Grid stackable>
						<Grid.Row>
							<Grid.Column width={11}>
								<p className="explanation">{explanation}</p>

								<Header as="h2" content="Examples" />

								{tweets.length === 0 && (
									<Segment placeholder>
										<Header icon>No examples yet...</Header>
									</Segment>
								)}
								{tweets.length > 0 && (
									<TweetList
										history={history}
										inverted={inverted}
										loading={false}
										loadingMore={false}
										onClickTweet={async () => {
											setActiveItem("tweets")
											await getTweets([id])
											setModalOpen(true)
										}}
										showSaveOption={false}
										tweets={tweets}
									/>
								)}
								{hasMoreT && (
									<>
										<Divider />
										<Button
											color="blue"
											content={`View all (${tweetCount})`}
											fluid
											onClick={async () => {
												setActiveItem("tweets")
												await getTweets([id])
												setModalOpen(true)
											}}
										/>
									</>
								)}

								<Header as="h2" content="From around the web..." />

								{images.data.length > 0 ? (
									<div className="tiles">
										{images.data.map((img, i) => (
											<div
												className="tile"
												key={`exampleTile${i}`}
												style={{ width: "180px", height: "180px" }}
											>
												<Image
													bordered
													onClick={() => {
														setActiveItem("photos")
														setModalOpen(true)
														const key = imageOptions
															.map((img) => `${s3Url}${img}`)
															.indexOf(img.s3Link)
														setImgKey(key)
													}}
													onError={(e) => (e.target.src = PlaceholderPic)}
													rounded
													src={img.s3Link}
												/>
											</div>
										))}
									</div>
								) : (
									<Segment placeholder>
										<Header content="No examples yet..." textAlign="center" />
									</Segment>
								)}
							</Grid.Column>
							<Grid.Column width={5}>
								{ContradictionsCard()}
								{RelatedFallaciesCard()}
								{BiggestPurveyorsCard()}
								<ImageUpload
									as="segment"
									callback={(file) => addImage(file)}
									headerSize="tiny"
									inverted={inverted}
									msg="add image"
								/>
							</Grid.Column>
						</Grid.Row>
					</Grid>

					<Divider hidden section />

					<Modal
						basic
						centered={false}
						closeIcon
						dimmer="blurring"
						onClose={() => setModalOpen(false)}
						onOpen={() => setModalOpen(true)}
						open={modalOpen}
						size="large"
					>
						<Modal.Content>
							{activeItem === "photos" && (
								<Carousel
									infiniteLoop
									selectedItem={imgKey}
									showIndicators={false}
									showStatus={false}
								>
									{imageOptions.map((img, i) => (
										<Image
											centered
											key={`carouselImg${i}`}
											rounded
											size="huge"
											src={`${s3Url}${img}`}
										/>
									))}
								</Carousel>
							)}

							{activeItem === "tweets" && (
								<Segment>
									<Visibility
										continuous
										offset={[50, 50]}
										onBottomVisible={() => {
											if (!loadingT && !loadingMoreT && hasMoreT) {
												getTweets([id], [purveyorId], null, pageNumberT)
											}
										}}
									>
										<TweetList
											history={history}
											inverted={inverted}
											loading={false}
											loadingMore={false}
											showSaveOption={false}
											tweets={modalTweets}
										/>
									</Visibility>
								</Segment>
							)}
						</Modal.Content>
					</Modal>
				</>
			) : (
				<div className="centeredLoader">
					<Loader active inverted={inverted} size="big" />
				</div>
			)}
		</DefaultLayout>
	)
}

Argument.propTypes = {
	history: PropTypes.object
}

export default Argument
