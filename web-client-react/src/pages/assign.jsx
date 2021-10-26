import {
	Container,
	Divider,
	Form,
	Grid,
	Header,
	Icon,
	Input,
	Loader,
	Message,
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
import PropTypes from "prop-types"
import qs from "query-string"
import reducer from "reducers/assign"
import ThemeContext from "themeContext"
import Tweet from "components/Tweet"

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

const Assign = ({ history }) => {
	const query = qs.parse(window.location.search)
	const _url = _.isEmpty(query.url) ? "" : query.url

	const { state } = useContext(ThemeContext)
	const { inverted } = state

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)

	// eslint-disable-next-line
	const [groupId, setGroupId] = useState(null)
	const [highlightedText, setHighlightedText] = useState("")
	const [highlightedTextC, setHighlightedTextC] = useState("")
	const [pageId, setPageId] = useState(null)
	const [tweetLoading, setTweetLoading] = useState(false)
	const [tweetLoadingC, setTweetLoadingC] = useState(false)
	const [url, setUrl] = useState(_url)
	const [urlC, setUrlC] = useState("")

	const { cTweet, cTweetLoaded, groups, tweetLoaded, tweet } = internalState

	const showGroups = tweetLoaded && groups.length > 0

	const getGroupsByPage = async (page) => {
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}groups/getGroupsByMember`, {
				params: {
					page
				}
			})
			.then(async (response) => {
				const { data } = response.data
				dispatch({
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
				const { data } = response.data
				const type = contradiction ? "GET_TWEET_CONTRADICTION" : "GET_TWEET"
				dispatch({
					type,
					tweet: data
				})
				contradiction ? setTweetLoadingC(false) : setTweetLoading(false)
				if (!contradiction) {
					const pageId = data.user.id
					getGroupsByPage(pageId)
					setPageId(pageId)
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

	const onPaste = (e, callback) => {
		const url = e.clipboardData.getData("Text")
		const _url = new URL(url)
		const { hostname, pathname } = _url
		if (hostname !== "twitter.com") {
			return
		}
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
		onPaste(e, (url, pathname) => {
			setUrlC(url)
			onPasteCallback(pathname, true)
		})
	}

	useEffect(() => {}, [])

	console.log("groupId", groupId)
	console.log("pageId", pageId)

	return (
		<DefaultLayout
			activeItem="assign"
			containerClassName="assignPage"
			history={history}
			inverted={inverted}
			textAlign="center"
			useContainer={false}
		>
			<DisplayMetaTags page="assign" />
			<Segment className="assignSegment">
				<Container>
					<Header as="h1" inverted>
						Assign a Logical Fallacy
					</Header>
					<Form>
						<Form.Field>
							<Input
								className="tweetInput"
								fluid
								icon="twitter"
								iconPosition="left"
								inverted
								onKeyUp={(e) =>
									onKeyUp(e, () => {
										setUrl("")
										dispatch({
											type: "RESET_TWEET"
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
								icon="twitter"
								iconPosition="left"
								inverted
								onKeyUp={(e) =>
									onKeyUp(e, () => {
										setUrlC("")
										dispatch({
											type: "RESET_TWEET"
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

					<Divider inverted />

					<Grid className={`${tweetLoaded ? "" : "loading"}`}>
						<Grid.Column width={8}>
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
									/>
								) : (
									<>
										{tweetLoading ? (
											<Segment style={{ opacity: 0.5 }}>
												<div className="centeredLoader tweet">
													<Loader active size="big" />
												</div>
											</Segment>
										) : (
											<>{sampleTweet}</>
										)}
									</>
								)}
							</div>
						</Grid.Column>
						<Grid.Column width={8}>
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
									/>
								) : (
									<>
										{tweetLoadingC ? (
											<Segment>
												<div className="centeredLoader tweet">
													<Loader active size="big" />
												</div>
											</Segment>
										) : (
											<>{!tweetLoaded && sampleTweetC}</>
										)}
									</>
								)}
							</div>
						</Grid.Column>
					</Grid>

					{showGroups && (
						<>
							<Divider inverted />

							{groups.map((group) => (
								<div className="msgWrapper">
									<Message icon key={`groupMsg${group.id}`}>
										<Icon color="green" name="checkmark" />
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
													return (
														<span key={`member${item.id}`}>{text}</span>
													)
												})}
												can be assigned under one umbrella.
											</p>
										</Message.Content>
									</Message>
								</div>
							))}
						</>
					)}

					<Divider inverted />

					<FallacyForm
						groupId={groupId}
						history={history}
						inverted={inverted}
						pageId={pageId}
						tweetId={tweetLoaded ? tweet.id : null}
					/>
				</Container>

				<Divider hidden section />
			</Segment>
		</DefaultLayout>
	)
}

Assign.propTypes = {
	history: PropTypes.object
}

export default Assign
