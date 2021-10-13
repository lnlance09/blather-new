import { Button, Divider, Visibility } from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { getConfig } from "options/toast"
import { onClickRedirect } from "utils/linkFunctions"
import { DisplayMetaTags } from "utils/metaFunctions"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import FallacyList from "components/FallacyList"
import initialState from "states/activity"
import logger from "use-reducer-logger"
import PropTypes from "prop-types"
import reducer from "reducers/activity"
import ThemeContext from "themeContext"
import TweetList from "components/TweetList"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Activity = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { fallacies, tweets } = internalState

	const [activeItem, setActiveItem] = useState("tweets")
	const [hasMore, setHasMore] = useState(false)
	const [loading, setLoading] = useState(true)
	const [loadingT, setLoadingT] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [loadingMoreT, setLoadingMoreT] = useState(false)
	const [pageNumber, setPageNumber] = useState(1)
	const [pageNumberT, setPageNumberT] = useState(1)

	useEffect(() => {
		getFallacies()
		getTweets()
		// eslint-disable-next-line
	}, [])

	const getFallacies = async (page = 1) => {
		page === 1 ? setLoading(true) : setLoadingMore(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}fallacies`, {
				params: {
					with: ["reference", "user", "twitter.tweet", "youtube.video"],
					page
				}
			})
			.then(async (response) => {
				const { data, meta } = response.data
				dispatch({
					type: "GET_ACTIVITY_FALLACIES",
					fallacies: data,
					page
				})
				setPageNumber(pageNumber + 1)
				setHasMore(meta.current_page < meta.last_page)
				page === 1 ? setLoading(false) : setLoadingMore(false)
			})
			.catch(() => {
				toast.error("There was an error")
			})
	}

	const getTweets = async (page = 1) => {
		page === 1 ? setLoadingT(true) : setLoadingMoreT(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}tweets/showTwitterList`, {
				params: {
					page
				}
			})
			.then((response) => {
				const { data } = response.data
				dispatch({
					type: "GET_ACTIVITY_TWEETS",
					tweets: data,
					page
				})
				setPageNumberT(pageNumberT + 1)
				page === 1 ? setLoadingT(false) : setLoadingMoreT(false)
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	const handleItemClick = (e, { name }) => {
		setActiveItem(name)

		if (name === "tweets") {
			getTweets()
		}

		if (name === "fallacies") {
			getFallacies()
		}
	}

	const onClickFallacy = (e, slug) => {
		onClickRedirect(e, history, `/fallacies/${slug}`)
	}

	const onClickTweet = (e, id) => {
		onClickRedirect(e, history, `/tweets/${id}`)
	}

	return (
		<DefaultLayout
			activeItem="activity"
			containerClassName="activityPage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="activity" />

			<Button.Group color="blue" inverted size="large">
				<Button active={activeItem === "tweets"} name="tweets" onClick={handleItemClick}>
					Tweets
				</Button>
				<Button
					active={activeItem === "fallacies"}
					name="fallacies"
					onClick={handleItemClick}
				>
					Fallacies
				</Button>
			</Button.Group>

			<Divider />

			{activeItem === "tweets" && (
				<Visibility
					continuous
					offset={[50, 50]}
					onBottomVisible={() => {
						if (!loadingT && !loadingMoreT) {
							getTweets(pageNumberT)
						}
					}}
				>
					<TweetList
						history={history}
						inverted={inverted}
						loading={!tweets.loaded}
						loadingMore={loadingMoreT}
						onClickPage={onClickTweet}
						tweets={tweets.data}
					/>
				</Visibility>
			)}

			{activeItem === "fallacies" && (
				<Visibility
					continuous
					offset={[50, 50]}
					onBottomVisible={() => {
						console.log("vos", loading)
						if (!loading && !loadingMore && hasMore) {
							getFallacies(pageNumber)
						}
					}}
				>
					<FallacyList
						// defaultUserImg={page.image}
						fallacies={fallacies.data}
						history={history}
						inverted={inverted}
						loading={!fallacies.loaded}
						loadingMore={loadingMore}
						onClickFallacy={onClickFallacy}
					/>
				</Visibility>
			)}

			<Divider hidden />
		</DefaultLayout>
	)
}

Activity.propTypes = {
	history: PropTypes.object
}

export default Activity
