import { Divider, Header, Placeholder } from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { onClickRedirect } from "utils/linkFunctions"
import { getConfig } from "options/toast"
import { tweetOptions } from "options/tweet"
import { toast } from "react-toastify"
import _ from "underscore"
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
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	let savedTweets = localStorage.getItem("savedTweets")
	savedTweets = _.isEmpty(savedTweets) ? [] : JSON.parse(savedTweets)

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { loaded, tweets } = internalState

	useEffect(() => {
		getTweets(savedTweets)
	}, [])

	const getTweets = async (ids, page = 1) => {
		axios
			.get(`${process.env.REACT_APP_BASE_URL}tweets`, {
				params: {
					ids
				}
			})
			.then((response) => {
				const tweets = response.data.data
				dispatch({
					type: "GET_TWEETS",
					tweets
				})
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	return (
		<DefaultLayout
			activeItem=""
			containerClassName="savedTweetsPage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="savedTweets" />

			<Header as="h1">Saved Tweets</Header>

			<div className="tweetList">
				{tweets.map((tweet, i) => {
					return (
						<div className="tweetWrapper">
							{!loaded ? (
								<Placeholder inverted={inverted} fluid>
									<Placeholder.Paragraph>
										<Placeholder.Line />
										<Placeholder.Line />
										<Placeholder.Line />
									</Placeholder.Paragraph>
								</Placeholder>
							) : (
								<Tweet
									config={{
										...tweetOptions,
										onClickCallback: (e, history, id) => {
											e.stopPropagation()
											const isLink = e.target.classList.contains("linkify")
											if (!isLink) {
												onClickRedirect(e, history, `/tweets/${id}`)
											}
										}
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
			<Divider hidden section />
		</DefaultLayout>
	)
}

SavedTweets.propTypes = {
	history: PropTypes.object
}

export default SavedTweets
