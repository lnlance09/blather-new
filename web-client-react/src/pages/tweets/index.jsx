import { Divider, Visibility } from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { getConfig } from "options/toast"
import { DisplayMetaTags } from "utils/metaFunctions"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/tweets"
import logger from "use-reducer-logger"
import PropTypes from "prop-types"
import reducer from "reducers/tweets"
import ThemeContext from "themeContext"
import TweetList from "components/TweetList"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Tweets = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { tweets } = internalState

	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [pageNumber, setPageNumber] = useState(1)

	useEffect(() => {
		getTweets()
		// eslint-disable-next-line
	}, [])

	const getTweets = async (page = 1) => {
		page === 1 ? setLoading(true) : setLoadingMore(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}tweets/showTwitterList`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("bearer")}`
				},
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
				setPageNumber(pageNumber + 1)
				page === 1 ? setLoading(false) : setLoadingMore(false)
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	return (
		<DefaultLayout activeItem="tweets" containerClassName="tweetsPage" history={history}>
			<DisplayMetaTags page="tweets" />

			<Visibility
				continuous
				offset={[50, 50]}
				onBottomVisible={() => {
					if (!loading && !loadingMore) {
						getTweets(pageNumber)
					}
				}}
			>
				<TweetList
					history={history}
					inverted={inverted}
					loading={!tweets.loaded}
					loadingMore={loadingMore}
					showSaveOption={true}
					tweets={tweets.data}
				/>
			</Visibility>

			<Divider hidden />
		</DefaultLayout>
	)
}

Tweets.propTypes = {
	history: PropTypes.object
}

export default Tweets
