import { Button, Divider, Header, Icon, Placeholder, Segment } from "semantic-ui-react"
import { useContext, useEffect, useReducer } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { onClickRedirect } from "utils/linkFunctions"
import { getConfig } from "options/toast"
import { tweetOptions } from "options/tweet"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/savedTweets"
import logger from "use-reducer-logger"
import PropTypes from "prop-types"
import reducer from "reducers/savedTweets"
import ThemeContext from "themeContext"
import Tweet from "components/Tweet"

const toastConfig = getConfig()
toast.configure(toastConfig)

const SavedTweets = ({ history }) => {
	const { state, dispatch } = useContext(ThemeContext)
	const { inverted, savedTweets } = state

	const tweetCount = savedTweets.length
	const isEmpty = tweetCount === 0

	const [internalState, dispatchInternal] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { loaded, tweets } = internalState

	useEffect(() => {
		if (isEmpty) {
			return
		}

		getTweets(savedTweets)
		// eslint-disable-next-line
	}, [savedTweets])

	const getTweets = async (ids, page = 1) => {
		axios
			.get(`${process.env.REACT_APP_BASE_URL}tweets`, {
				params: {
					ids,
					page
				}
			})
			.then((response) => {
				const tweets = response.data.data
				dispatchInternal({
					type: "GET_TWEETS",
					tweets
				})
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	const clearTweet = () => {
		dispatch({
			type: "CLEAR_ALL_TWEETS"
		})
	}

	return (
		<DefaultLayout activeItem="" containerClassName="savedTweetsPage" history={history}>
			<DisplayMetaTags page="savedTweets" />

			<Header as="h1">
				{!isEmpty && (
					<Button
						content={`Clear all (${tweetCount})`}
						color="twitter"
						onClick={clearTweet}
						style={{ float: "right" }}
					/>
				)}
				<Header.Content>Saved Tweets</Header.Content>
			</Header>

			{isEmpty && (
				<Segment placeholder>
					<Header icon inverted={inverted} textAlign="center">
						<Icon color="blue" inverted={inverted} name="twitter" />
						You haven't saved any tweets yet...
					</Header>
				</Segment>
			)}

			{!isEmpty && (
				<div className="tweetList">
					{tweets.map((tweet, i) => {
						return (
							<div className="tweetWrapper" key={`tweetWrapper${i}`}>
								{!loaded ? (
									<Segment>
										<Placeholder inverted={inverted} fluid>
											<Placeholder.Paragraph>
												<Placeholder.Line />
												<Placeholder.Line />
												<Placeholder.Line />
											</Placeholder.Paragraph>
										</Placeholder>
									</Segment>
								) : (
									<Tweet
										config={{
											...tweetOptions,
											onClickCallback: (e, history, id) => {
												e.stopPropagation()
												const isLink =
													e.target.classList.contains("linkify")
												if (!isLink) {
													onClickRedirect(e, history, `/tweets/${id}`)
												}
											},
											showCopyUrlOption: true,
											showSaveOption: true
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
								)}
							</div>
						)
					})}
				</div>
			)}
			<Divider hidden section />
		</DefaultLayout>
	)
}

SavedTweets.propTypes = {
	history: PropTypes.object
}

export default SavedTweets
