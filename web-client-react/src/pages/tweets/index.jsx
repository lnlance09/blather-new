import { useContext, useEffect, useReducer, useState } from "react"
import { Divider, Loader, Label, Menu, Segment, Visibility } from "semantic-ui-react"
import { onClickRedirect } from "utils/linkFunctions"
import { DisplayMetaTags } from "utils/metaFunctions"
import { tweetOptions } from "options/tweet"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/tweet"
import FallacyList from "components/FallacyList"
import logger from "use-reducer-logger"
import PropTypes from "prop-types"
import reducer from "reducers/tweet"
import ThemeContext from "themeContext"
import Tweet from "components/Tweet"

const toastConfig = getConfig()
toast.configure(toastConfig)

const TweetPage = ({ history, match }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state
	const { id } = match.params

	const [internalState, dispatchInternal] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { contradictions, fallacies, loaded, tweet } = internalState

	const [activeItem, setActiveItem] = useState("fallacies")
	const [hasMore, setHasMore] = useState(false)
	const [hasMoreC, setHasMoreC] = useState(false)
	const [loading, setLoading] = useState(true)
	const [loadingC, setLoadingC] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [loadingMoreC, setLoadingMoreC] = useState(false)
	const [pageNumber, setPageNumber] = useState(1)
	const [pageNumberC, setPageNumberC] = useState(1)

	useEffect(() => {
		const getTweet = async (id) => {
			await axios
				.get(`${process.env.REACT_APP_BASE_URL}tweets/${id}`, {
					params: {
						with: [
							"contradictionTwitter.tweet",
							"contradictionYouTube.video",
							"twitter.tweet"
						]
					}
				})
				.then(async (response) => {
					const { data } = response.data
					dispatchInternal({
						type: "GET_TWEET",
						tweet: data
					})
					getFallacies(data.id)
					getContradictions(data.id)
				})
				.catch(() => {
					toast.error("There was an error")
				})
		}

		getTweet(id)
	}, [])

	const getContradictions = async (tweetId, page = 1) => {
		page === 1 ? setLoadingC(true) : setLoadingMoreC(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}fallacies`, {
				params: {
					with: [
						"contradictionTwitter.tweet",
						"contradictionYouTube.video",
						"twitter.tweet"
					],
					includeContradictions: true,
					tweetId,
					page,
					refIds: [21]
				}
			})
			.then(async (response) => {
				const { data, meta } = response.data
				dispatchInternal({
					type: "GET_CONTRADICTIONS",
					contradictions: data,
					page,
					total: meta.total
				})
				setPageNumberC(pageNumberC + 1)
				setHasMoreC(meta.current_page < meta.last_page)
				pageNumberC === 1 ? setLoadingC(false) : setLoadingMoreC(false)
			})
			.catch(() => {
				toast.error("There was an error")
			})
	}

	const getFallacies = async (tweetId, page = 1) => {
		page === 1 ? setLoading(true) : setLoadingMore(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}fallacies`, {
				params: {
					with: ["reference", "user", "twitter.tweet"],
					tweetId,
					page
				}
			})
			.then(async (response) => {
				const { data, meta } = response.data
				dispatchInternal({
					type: "GET_FALLACIES",
					fallacies: data,
					page
				})
				setPageNumber(pageNumber + 1)
				setHasMore(meta.current_page < meta.last_page)
				pageNumber === 1 ? setLoading(false) : setLoadingMore(false)
			})
			.catch(() => {
				toast.error("There was an error")
			})
	}

	const handleItemClick = (e, { name }) => {
		setActiveItem(name)
	}

	const onClickFallacy = (e, slug) => {
		onClickRedirect(e, history, `/fallacies/${slug}`)
	}

	return (
		<DefaultLayout
			activeItem="tweet"
			containerClassName="tweetPage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="tweet" />

			{loaded && fallacies.loaded && contradictions.loaded ? (
				<>
					<Tweet
						config={{
							...tweetOptions
						}}
						counts={tweet.counts}
						createdAt={tweet.createdAt}
						// defaultUserImg={defaultUserImg}
						entities={tweet.entities}
						extendedEntities={JSON.parse(tweet.extendedEntities)}
						fullText={tweet.fullText}
						history={history}
						id={tweet.tweetId}
						quoted={tweet.quoted}
						retweeted={tweet.retweeted}
						user={tweet.user}
					/>
					<Divider section />

					<Menu attached="top" tabular size="large">
						<Menu.Item
							active={activeItem === "fallacies"}
							name="fallacies"
							onClick={handleItemClick}
						>
							Fallacies
							<Label color="red">{tweet.fallacyCount}</Label>
						</Menu.Item>
						<Menu.Item
							active={activeItem === "contradictions"}
							name="contradictions"
							onClick={handleItemClick}
						>
							Contradictions
							<Label color="red">{contradictions.count}</Label>
						</Menu.Item>
					</Menu>

					<Segment attached>
						{activeItem === "fallacies" && (
							<Visibility
								continuous
								offset={[50, 50]}
								onBottomVisible={() => {
									if (!loading && !loadingMore && hasMore) {
										getFallacies(tweet.id, pageNumber)
									}
								}}
							>
								<FallacyList
									fallacies={fallacies.data}
									history={history}
									inverted={inverted}
									loading={!fallacies.loaded}
									loadingMore={loadingMore}
									onClickFallacy={onClickFallacy}
								/>
							</Visibility>
						)}

						{activeItem === "contradictions" && (
							<Visibility
								continuous
								offset={[50, 50]}
								onBottomVisible={() => {
									if (!loadingC && !loadingMoreC && hasMoreC) {
										getContradictions(tweet.id, pageNumberC)
									}
								}}
							>
								<FallacyList
									emptyMsg="No contradictions yet..."
									fallacies={fallacies.data}
									history={history}
									inverted={inverted}
									loading={!fallacies.loaded}
									loadingMore={loadingMore}
									onClickFallacy={onClickFallacy}
								/>
							</Visibility>
						)}
					</Segment>

					<Divider hidden section />
				</>
			) : (
				<div className="centeredLoader">
					<Loader active inverted={inverted} size="big" />
				</div>
			)}
		</DefaultLayout>
	)
}

TweetPage.propTypes = {
	history: PropTypes.object
}

export default TweetPage
