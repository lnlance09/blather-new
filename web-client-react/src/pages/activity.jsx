import { Divider, Header, Visibility } from "semantic-ui-react"
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

const toastConfig = getConfig()
toast.configure(toastConfig)

const Activity = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { fallacies } = internalState

	const [hasMore, setHasMore] = useState(false)
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [pageNumber, setPageNumber] = useState(1)

	useEffect(() => {
		getFallacies()
		// eslint-disable-next-line
	}, [])

	const getFallacies = async (page = 1) => {
		page === 1 ? setLoading(true) : setLoadingMore(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}fallacies`, {
				params: {
					with: ["reference", "user", "twitter.tweet", "youtube.video"],
					includeContradictions: true,
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

	const onClickFallacy = (e, slug) => {
		onClickRedirect(e, history, `/fallacies/${slug}`)
	}

	return (
		<DefaultLayout activeItem="activity" containerClassName="activityPage" history={history}>
			<DisplayMetaTags page="activity" />

			<Header as="h1" content="Activity" />

			<Visibility
				continuous
				offset={[50, 50]}
				onBottomVisible={() => {
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

			<Divider hidden />
		</DefaultLayout>
	)
}

Activity.propTypes = {
	history: PropTypes.object
}

export default Activity
