import {
	Container,
	Divider,
	Form,
	Grid,
	Header,
	Input,
	Message,
	Placeholder,
	Segment
} from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { Link } from "react-router-dom"
import { DisplayMetaTags } from "utils/metaFunctions"
import { tweetOptions } from "options/tweet"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import _ from "underscore"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/assign"
import FallacyForm from "components/FallacyForm"
import logger from "use-reducer-logger"
import moment from "moment"
import PropTypes from "prop-types"
import qs from "query-string"
import ReactPlayer from "react-player"
import reducer from "reducers/assign"
import ThemeContext from "themeContext"
import TimeField from "react-simple-timefield"
import Tweet from "components/Tweet"
import validator from "validator"

const toastConfig = getConfig()
toast.configure(toastConfig)

const sampleTweetUser = {
	image: "https://blather22.s3.amazonaws.com/pages/twitter/charlie-tiny-face.jpeg",
	name: "Charlie Kirk",
	username: "charliekirk11"
}

const sampleTweet = (
	<Tweet
		config={{
			...tweetOptions
		}}
		counts={{
			favorites: 5671,
			retweets: 2312
		}}
		createdAt="2021-10-08 04:33:31"
		fullText="This is a tweet where I take a bold position on something that I know nothing about."
		user={sampleTweetUser}
	/>
)

const sampleTweetC = (
	<Tweet
		config={{
			...tweetOptions
		}}
		counts={{
			favorites: 7144,
			retweets: 3620
		}}
		createdAt="2021-10-15 07:12:47"
		fullText="This is a tweet where I take on a position that directly contradicts the one that I took last week. The secret to owning the libz is having contradictory views about literally everything."
		user={sampleTweetUser}
	/>
)

const validUrls = [
	"www.twitter.com",
	"twitter.com",
	"mobile.twitter.com",
	"www.youtube.com",
	"youtube.com",
	"youtu.be",
	"blather.io",
	"127.0.0.1"
]

const Assign = ({ history }) => {
	const query = qs.parse(window.location.search)
	const _url = _.isEmpty(query.url) ? "" : query.url
	const oauthToken = _.isEmpty(query.oauth_token) ? null : query.oauth_token
	const oauthVerifier = _.isEmpty(query.oauth_verifier) ? null : query.oauth_verifier

	const { state, dispatch } = useContext(ThemeContext)
	const { inverted } = state

	const [internalState, dispatchInternal] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)

	const [groupId, setGroupId] = useState(null)
	const [highlightedText, setHighlightedText] = useState("")
	const [highlightedTextC, setHighlightedTextC] = useState("")
	const [inputIcon, setInputIcon] = useState("twitter")
	const [inputIconCont, setInputIconCont] = useState("twitter")
	const [pageId, setPageId] = useState(null)
	const [refId, setRefId] = useState(1)
	const [tweetLoading, setTweetLoading] = useState(false)
	const [tweetLoadingC, setTweetLoadingC] = useState(false)
	const [videoLoading, setVideoLoading] = useState(false)
	const [videoLoadingC, setVideoLoadingC] = useState(false)
	const [url, setUrl] = useState(_url)
	const [urlC, setUrlC] = useState("")

	const [startTime, setStartTime] = useState(0)
	const [endTime, setEndTime] = useState(0)
	const [startTimeCont, setStartTimeCont] = useState(0)
	const [endTimeCont, setEndTimeCont] = useState(0)

	const {
		cTweet,
		cVideo,
		cVideoLoaded,
		cTweetLoaded,
		groups,
		tweetLoaded,
		tweet,
		video,
		videoLoaded
	} = internalState

	const showGroups = tweetLoaded && groups.length > 0

	const createTwitterAccount = async () => {
		await axios
			.post(`${process.env.REACT_APP_BASE_URL}users/registerTwitterUser`, {
				token: oauthToken,
				verifier: oauthVerifier,
				requestToken: localStorage.getItem("requestToken"),
				requestTokenSecret: localStorage.getItem("requestTokenSecret")
			})
			.then(async (response) => {
				const { bearer, user } = response.data

				localStorage.setItem("auth", true)
				localStorage.setItem("bearer", bearer)
				localStorage.setItem("user", JSON.stringify(user))
				localStorage.setItem("verify", false)

				dispatch({
					type: "SET_USER_DATA",
					data: {
						bearer,
						user,
						verify: false
					}
				})
			})
			.catch((e) => {
				console.error("error", e)
			})
	}

	const getGroupsByPage = async (page) => {
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}groups/getGroupsByMember`, {
				params: {
					page
				}
			})
			.then(async (response) => {
				const { data } = response.data
				dispatchInternal({
					type: "GET_GROUPS_BY_PAGE",
					groups: data
				})
				const groupId = data.length > 0 ? data[0].id : null
				setGroupId(groupId)
			})
			.catch((e) => {
				toast.error("There was an error")
			})
	}

	const getTweet = async (id, contradiction = false) => {
		contradiction ? setTweetLoadingC(true) : setTweetLoading(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}tweets/${id}`, {
				params: {
					showGroups: true
				}
			})
			.then(async (response) => {
				const { archived, tweet } = response.data
				const type = contradiction ? "GET_TWEET_CONTRADICTION" : "GET_TWEET"
				dispatchInternal({
					type,
					tweet
				})
				contradiction ? setTweetLoadingC(false) : setTweetLoading(false)

				if (!contradiction) {
					const pageId = tweet.user.id
					getGroupsByPage(pageId)
					setPageId(pageId)
				}

				if (contradiction) {
					setRefId(21)
				}

				if (archived) {
					toast.info("Tweet archived!")
				}
			})
			.catch((e) => {
				toast.error("There was an error")
			})
	}

	const getVideo = async (id, contradiction = false) => {
		contradiction ? setVideoLoadingC(true) : setVideoLoading(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}videos/${id}`)
			.then(async (response) => {
				const { archived, video } = response.data
				const type = contradiction ? "GET_VIDEO_CONTRADICTION" : "GET_VIDEO"
				dispatchInternal({
					type,
					video
				})
				contradiction ? setVideoLoadingC(false) : setVideoLoading(false)

				if (contradiction) {
					setRefId(21)
				}

				if (archived) {
					toast.info("Video archived!")
				}
			})
			.catch((e) => {
				toast.error("There was an error")
			})
	}

	const handleHoverOn = () => {
		let text = ""
		if (window.getSelection) {
			text = window.getSelection().toString()
		} else if (document.selection) {
			text = document.selection.createRange().text
		}
		return text
	}

	const onKeyUp = (e, callback) => {
		var key = e.which || e.keyCode
		var ctrl = e.ctrlKey ? e.ctrlKey : key === 17 ? true : false
		if (key === 86 && ctrl) {
			return
		}
		if (key === 8) {
			callback()
		}
	}

	const onPaste = (e, callback, contradiction = false) => {
		const url = e.clipboardData.getData("Text")
		if (!validator.isURL(url)) {
			return
		}

		const _url = new URL(url)
		const { hostname, pathname } = _url
		if (validUrls.indexOf(hostname) === -1) {
			return
		}

		if (["www.youtube.com", "youtube.com", "youtu.be"].includes(hostname)) {
			const params = qs.parse(_url.search)
			if (_.isEmpty(params.v)) {
				return
			}

			if (contradiction) {
				setUrlC(url)
				setInputIconCont("youtube")
			} else {
				setUrl(url)
				setInputIcon("youtube")
			}

			getVideo(params.v, contradiction)
			return
		}

		contradiction ? setInputIconCont("twitter") : setInputIcon("twitter")

		callback(url, pathname)
	}

	const onPasteCallback = (pathname, contradiction = false) => {
		const segments = pathname.split("/")
		const tweetId = segments[segments.length - 1]
		getTweet(tweetId, contradiction)
	}

	const onPasteTweet = (e) => {
		onPaste(e, (url, pathname) => {
			setUrl(url)
			onPasteCallback(pathname)
		})
	}

	const onPasteTweetC = (e) => {
		onPaste(
			e,
			(url, pathname) => {
				setUrlC(url)
				onPasteCallback(pathname, true)
			},
			true
		)
	}

	useEffect(() => {
		if (_url !== "") {
			onPasteCallback(_url)
		}
		// eslint-disable-next-line
	}, [_url])

	useEffect(() => {
		if (oauthToken && oauthVerifier) {
			createTwitterAccount()
		}
		// eslint-disable-next-line
	}, [])

	return (
		<DefaultLayout activeItem="assign" containerClassName="assignPage" history={history}>
			<DisplayMetaTags page="assign" />
			<div className="assignSegment">
				<Container>
					<Header as="h1">
						Assign a Logical Fallacy
						<Header.Subheader>Call out misinformation</Header.Subheader>
					</Header>
					<Form>
						<Form.Field>
							<Input
								className="tweetInput"
								fluid
								icon={inputIcon}
								iconPosition="left"
								onKeyUp={(e) =>
									onKeyUp(e, () => {
										setUrl("")
										dispatchInternal({
											type: "RESET_TWEET"
										})
										dispatchInternal({
											type: "RESET_VIDEO"
										})
									})
								}
								onPaste={onPasteTweet}
								placeholder="Paste a link to a tweet"
								size="large"
								value={url}
							/>
						</Form.Field>
						<Form.Field>
							<Input
								className="tweetInput"
								fluid
								icon={inputIconCont}
								iconPosition="left"
								onKeyUp={(e) =>
									onKeyUp(e, () => {
										setUrlC("")
										dispatchInternal({
											type: "RESET_TWEET_CONTRADICTION"
										})
										dispatchInternal({
											type: "RESET_VIDEO_CONTRADICTION"
										})
									})
								}
								onPaste={onPasteTweetC}
								placeholder="Paste a link to a contradicting tweet"
								size="large"
								value={urlC}
							/>
						</Form.Field>
					</Form>

					<Divider hidden />

					<Grid className={`${tweetLoaded ? "" : "loading"}`} stackable>
						<Grid.Column width={8}>
							{!videoLoaded && (
								<div className="sampleWrapper">
									{tweetLoaded ? (
										<Tweet
											config={{
												...tweetOptions,
												handleHoverOn: () => {
													const text = handleHoverOn()
													setHighlightedText(text)
												},
												highlightedText
											}}
											counts={tweet.counts}
											createdAt={tweet.createdAt}
											extendedEntities={tweet.extendedEntities}
											fullText={tweet.fullText}
											history={history}
											id={tweet.tweetId}
											quoted={tweet.quoted}
											retweeted={tweet.retweeted}
											user={tweet.user}
											urls={tweet.urls}
										/>
									) : (
										<>
											{tweetLoading ? (
												<Segment>
													<Placeholder fluid style={{ height: "210px" }}>
														<Placeholder.Image />
													</Placeholder>
												</Segment>
											) : (
												<>{sampleTweet}</>
											)}
										</>
									)}
								</div>
							)}

							{videoLoaded && (
								<>
									<ReactPlayer
										controls={true}
										light={false}
										onProgress={(e) => {}}
										onStart={() => {}}
										url={url}
										width="100%"
									/>
									<Form as={Segment} secondary>
										<Form.Group widths="equal">
											<Form.Field>
												<TimeField
													input={
														<Input
															fluid
															icon="hourglass start"
															label={{
																color: "black",
																content: "Start"
															}}
															type="text"
														/>
													}
													onChange={(e, value) => {
														const time = moment
															.duration(value)
															.asSeconds()
														setStartTime(time)
													}}
													showSeconds={true}
												/>
											</Form.Field>
											<Form.Field>
												<TimeField
													input={
														<Input
															fluid
															icon="hourglass end"
															label={{
																color: "black",
																content: "End"
															}}
															type="text"
														/>
													}
													onChange={(e, value) => {
														const time = moment
															.duration(value)
															.asSeconds()
														setEndTime(time)
													}}
													showSeconds={true}
												/>
											</Form.Field>
										</Form.Group>
									</Form>
								</>
							)}
						</Grid.Column>
						<Grid.Column width={8}>
							{!cVideoLoaded && (
								<div className="sampleWrapper contradiction">
									{cTweetLoaded ? (
										<Tweet
											config={{
												...tweetOptions,
												handleHoverOn: () => {
													const text = handleHoverOn()
													setHighlightedTextC(text)
												},
												highlightedText: highlightedTextC
											}}
											counts={cTweet.counts}
											createdAt={cTweet.createdAt}
											extendedEntities={cTweet.extendedEntities}
											fullText={cTweet.fullText}
											history={history}
											id={cTweet.tweetId}
											quoted={cTweet.quoted}
											retweeted={cTweet.retweeted}
											user={cTweet.user}
											urls={cTweet.urls}
										/>
									) : (
										<>
											{tweetLoadingC ? (
												<Segment>
													<Placeholder fluid style={{ height: "210px" }}>
														<Placeholder.Image />
													</Placeholder>
												</Segment>
											) : (
												<>
													{!tweetLoaded && _url === ""
														? sampleTweetC
														: ""}
												</>
											)}
										</>
									)}
								</div>
							)}

							{cVideoLoaded && (
								<>
									<ReactPlayer
										controls={true}
										light={false}
										onProgress={(e) => {}}
										onStart={() => {}}
										// ref={videoRef}
										url={urlC}
										width="100%"
									/>
									<Form as={Segment} secondary>
										<Form.Group widths="equal">
											<Form.Field>
												<TimeField
													input={
														<Input
															fluid
															icon="hourglass start"
															label={{
																color: "black",
																content: "Start"
															}}
															type="text"
														/>
													}
													onChange={(e, value) => {
														const time = moment
															.duration(value)
															.asSeconds()
														setStartTimeCont(time)
													}}
													showSeconds={true}
												/>
											</Form.Field>
											<Form.Field>
												<TimeField
													input={
														<Input
															fluid
															icon="hourglass end"
															label={{
																color: "black",
																content: "End"
															}}
															type="text"
														/>
													}
													onChange={(e, value) => {
														const time = moment
															.duration(value)
															.asSeconds()
														setEndTimeCont(time)
													}}
													showSeconds={true}
												/>
											</Form.Field>
										</Form.Group>
									</Form>
								</>
							)}
						</Grid.Column>
					</Grid>

					{showGroups && (
						<>
							<Divider hidden />

							{groups.map((group) => (
								<Message key={`groupMsg${group.id}`}>
									<Message.Content>
										<Message.Header>
											Member of the {group.name} group
										</Message.Header>
										<p>
											Tweets from{" "}
											{group.members.data.map((item, i, { length }) => {
												const x = i + 1
												const url = `/pages/twitter/${item.page.username}`
												const link = (
													<Link target="_blank" to={url}>
														{item.page.name}
													</Link>
												)
												let text = <>{link}, </>
												if (x === length) {
													text = <>and {link} </>
												}
												return <span key={`member${item.id}`}>{text}</span>
											})}
											can be assigned under one umbrella.
										</p>
									</Message.Content>
								</Message>
							))}
						</>
					)}

					<Divider section />

					<FallacyForm
						cTweetId={cTweetLoaded ? cTweet.id : null}
						cVideoId={cVideoLoaded ? cVideo.id : null}
						startTimeCont={startTimeCont}
						endTimeCont={endTimeCont}
						groupId={groupId}
						highlightedText={highlightedText}
						highlightedTextC={highlightedTextC}
						history={history}
						inverted={inverted}
						pageId={pageId}
						refId={refId}
						tweetId={tweetLoaded ? tweet.id : null}
						videoId={videoLoaded ? video.id : null}
						startTime={startTime}
						endTime={endTime}
					/>
				</Container>

				<Divider hidden section />
			</div>
		</DefaultLayout>
	)
}

Assign.propTypes = {
	history: PropTypes.object
}

export default Assign
