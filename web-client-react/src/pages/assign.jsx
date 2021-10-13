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

const Assign = ({ history }) => {
	const query = qs.parse(window.location.search)
	const _url = _.isEmpty(query.url) ? "" : query.url

	const { state } = useContext(ThemeContext)
	const { inverted } = state

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)

	const { tweetError, tweetLoaded, tweet } = internalState

	const [highlightedText, setHighlightedText] = useState("")
	const [text, setText] = useState("")
	const [url, setUrl] = useState(_url)
	const [urlC, setUrlC] = useState("")

	const getTweet = async (id) => {
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}tweets/${id}`)
			.then(async (response) => {
				const { data } = response.data
				dispatch({
					type: "GET_TWEET",
					tweet: data
				})
			})
			.catch((e) => {
				console.error(e)
				toast.error("There was an error")
			})
	}

	const handleHoverOn = (e) => {
		let text = ""
		if (window.getSelection) {
			text = window.getSelection().toString()
		} else if (document.selection) {
			text = document.selection.createRange().text
		}
		setHighlightedText(text)
	}

	const onChangeText = (e, { value }) => {
		setText(value)
	}

	const onKeyUp = (e) => {
		var key = e.which || e.keyCode
		var ctrl = e.ctrlKey ? e.ctrlKey : key === 17 ? true : false

		if (key === 86 && ctrl) {
			return
		}

		if (key === 8) {
			setUrl("")
		}
	}

	const onPaste = (e) => {
		const url = e.clipboardData.getData("Text")
		setUrl(url)

		const _url = new URL(url)
		const { hostname, pathname } = _url
		if (hostname !== "twitter.com") {
			return
		}

		const segments = pathname.split("/")
		const tweetId = segments[segments.length - 1]
		getTweet(tweetId)
	}

	const scrollToTop = () => {
		window.scroll({
			behavior: "smooth",
			left: 0,
			top: 0
		})
	}

	useEffect(() => {}, [])

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
								onKeyUp={onKeyUp}
								onPaste={onPaste}
								placeholder="Paste a link to a Tweet"
								size="large"
								value={url}
							/>
						</Form.Field>
						{tweetLoaded && (
							<Form.Field>
								<Input
									className="tweetInput"
									fluid
									icon="twitter"
									iconPosition="left"
									inverted
									onKeyUp={onKeyUp}
									onPaste={onPaste}
									placeholder="Paste a link to a contradicting tweet"
									size="large"
									value={urlC}
								/>
							</Form.Field>
						)}
					</Form>

					<Divider inverted />

					<Grid>
						<Grid.Column width={8}>
							{tweetLoaded && (
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
							)}
						</Grid.Column>
						<Grid.Column width={8}></Grid.Column>
					</Grid>

					<Divider inverted />

					<Form inverted size="large">
						<Form.Field>
							<Dropdown
								clearable
								fluid
								options={[
									{
										key: "af",
										value: "af",
										flag: "af",
										text: "Afghanistan"
									},
									{
										key: "ax",
										value: "ax",
										flag: "ax",
										text: "Aland Islands"
									}
								]}
								placeholder="Pick a fallacy"
								search
								selection
							/>
						</Form.Field>
						<Form.Field>
							<TextArea
								placeholder="Please explain how this is fallacious."
								onChange={onChangeText}
								rows={7}
								value={text}
							/>
						</Form.Field>
						<Form.Field>
							<Button color="black" content="Submit" fluid size="large" />
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
