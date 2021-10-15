import {
	Button,
	Container,
	Divider,
	Dropdown,
	Form,
	Grid,
	Header,
	Input,
	Segment,
	TextArea
} from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getDropdownOptions } from "options/page"
import { getReferenceOptions } from "options/reference"
import { tweetOptions } from "options/tweet"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import _ from "underscore"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/assign"
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
	const [explanation, setExplanation] = useState("")
	const [highlightedText, setHighlightedText] = useState("")
	const [pageValue, setPageValue] = useState(6)
	const [refValue, setRefValue] = useState(1)
	const [url, setUrl] = useState(_url)
	const [urlC, setUrlC] = useState("")

	const { cTweetLoaded, pageOptions, refOptions, tweetError, tweetLoaded, tweet } = internalState
	const canSubmit = refValue && pageValue && !_.isEmpty(explanation)

	const getTweet = async (id, contradiction = false) => {
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}tweets/${id}`)
			.then(async (response) => {
				const { data } = response.data
				const type = contradiction ? "GET_TWEET_CONTRADICTION" : "GET_TWEET"
				dispatch({
					type,
					tweet: data
				})
			})
			.catch((e) => {
				toast.error("There was an error")
			})
	}

	// eslint-disable-next-line
	const handleHoverOn = (e) => {
		let text = ""
		if (window.getSelection) {
			text = window.getSelection().toString()
		} else if (document.selection) {
			text = document.selection.createRange().text
		}
		setHighlightedText(text)
	}

	const onChangeExplanation = (e, { value }) => {
		setExplanation(value)
	}

	const onChangePage = (e, { value }) => {
		setPageValue(value)
	}

	const onChangeRef = (e, { value }) => {
		setRefValue(value)
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

	// eslint-disable-next-line
	const scrollToTop = () => {
		window.scroll({
			behavior: "smooth",
			left: 0,
			top: 0
		})
	}

	const submitFallacy = () => {}

	useEffect(() => {
		const getRefOptions = async () => {
			const options = await getReferenceOptions()
			dispatch({
				type: "SET_REFERENCE_OPTIONS",
				options
			})
		}
		const getPageOptions = async () => {
			const options = await getDropdownOptions()
			dispatch({
				type: "SET_PAGE_OPTIONS",
				options
			})
		}

		getRefOptions()
		getPageOptions()
	}, [])

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
			<Segment className="assignSegment" fluid>
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
								onKeyUp={(e) => onKeyUp(e, () => setUrl(""))}
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
								onKeyUp={(e) => onKeyUp(e, () => setUrlC(""))}
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
											...tweetOptions
										}}
										counts={tweet.counts}
										createdAt={tweet.createdAt}
										// defaultUserImg={defaultUserImg}
										extendedEntities={tweet.extendedEntities}
										fullText={tweet.fullText}
										history={history}
										id={tweet.tweetId}
										quoted={tweet.quoted}
										retweeted={tweet.retweeted}
										user={tweet.user}
									/>
								) : (
									<>{sampleTweet}</>
								)}
							</div>
						</Grid.Column>
						<Grid.Column width={8}>
							<div className="sampleWrapper contradiction">
								{cTweetLoaded ? (
									<Tweet
										config={{
											...tweetOptions
										}}
										counts={tweet.counts}
										createdAt={tweet.createdAt}
										// defaultUserImg={defaultUserImg}
										extendedEntities={tweet.extendedEntities}
										fullText={tweet.fullText}
										history={history}
										id={tweet.tweetId}
										quoted={tweet.quoted}
										retweeted={tweet.retweeted}
										user={tweet.user}
									/>
								) : (
									<>{sampleTweetC}</>
								)}
							</div>
						</Grid.Column>
					</Grid>

					<Divider inverted />

					<Form inverted size="large">
						<Form.Group>
							<Form.Field width={8}>
								<Dropdown
									clearable
									fluid
									options={refOptions}
									placeholder="Group"
									search
									selection
									value={null}
								/>
							</Form.Field>
							<Form.Field width={8}>
								<Dropdown
									clearable
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
						<Form.Field>
							<Dropdown
								clearable
								fluid
								onChange={onChangeRef}
								options={refOptions}
								placeholder="Pick a fallacy"
								search
								selection
								value={refValue}
							/>
						</Form.Field>
						<Form.Field>
							<TextArea
								placeholder="Please explain how this is fallacious."
								onChange={onChangeExplanation}
								rows={7}
								value={explanation}
							/>
						</Form.Field>
						<Form.Field>
							<Button
								color="green"
								content="Submit"
								disabled={!canSubmit}
								fluid
								inverted
								size="large"
							/>
						</Form.Field>
					</Form>
				</Container>
			</Segment>
		</DefaultLayout>
	)
}

Assign.propTypes = {
	history: PropTypes.object
}

export default Assign
