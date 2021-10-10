import {
	Button,
	Divider,
	Dropdown,
	Header,
	Icon,
	Label,
	Menu,
	Segment,
	Visibility
} from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { DebounceInput } from "react-debounce-input"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getDropdownOptions } from "options/page"
import { onClickRedirect } from "utils/linkFunctions"
import axios from "axios"
import DefaultLayout from "layouts/default"
import FallacyList from "components/FallacyList"
import initialState from "states/search"
import logger from "use-reducer-logger"
import NumberFormat from "react-number-format"
import PageList from "components/PageList"
import PropTypes from "prop-types"
import qs from "query-string"
import reducer from "reducers/search"
import ThemeContext from "themeContext"
import TweetList from "components/TweetList"

const Search = ({ history, match }) => {
	const query = qs.parse(window.location.search)
	const { network, pageId, refIds } = query
	const _q = typeof query.q === "undefined" ? "" : query.q
	const type = !query.type ? "tweets" : query.type

	const { state } = useContext(ThemeContext)
	// const { type } = match.params
	const { inverted } = state

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { contradictions, fallacies, pageOptions, pages, tweets } = internalState
	const { twitterCount, youtubeCount } = pages

	const [activeItem, setActiveItem] = useState(type)
	const [q, setQ] = useState(_q)

	const [hasMoreC, setHasMoreC] = useState(false)
	const [loadingC, setLoadingC] = useState(true)
	const [loadingMoreC, setLoadingMoreC] = useState(false)
	const [pageNumberC, setPageNumberC] = useState(1)

	const [hasMoreF, setHasMoreF] = useState(false)
	const [loadingF, setLoadingF] = useState(true)
	const [loadingMoreF, setLoadingMoreF] = useState(false)
	const [pageNumberF, setPageNumberF] = useState(1)

	const [hasMoreP, setHasMoreP] = useState(false)
	const [loadingP, setLoadingP] = useState(true)
	const [loadingMoreP, setLoadingMoreP] = useState(false)
	const [pageNumberP, setPageNumberP] = useState(1)

	const [hasMoreT, setHasMoreT] = useState(false)
	const [loadingT, setLoadingT] = useState(true)
	const [loadingMoreT, setLoadingMoreT] = useState(false)
	const [pageNumberT, setPageNumberT] = useState(1)

	const [newRefIds, setNewRefIds] = useState(refIds)

	const [pageIds, setPageIds] = useState([])
	const [pageIdsF, setPageIdsF] = useState([])
	const [pageIdsC, setPageIdsC] = useState([])

	useEffect(() => {
		if (activeItem === "contradictions" && !contradictions.loaded) {
			getContradictions(q, pageIdsC)
		}

		if (activeItem === "fallacies" && !fallacies.loaded) {
			getFallacies(q, refIds, pageIdsF)
		}

		if (activeItem === "pages" && !pages.loaded) {
			getPages(q, network)
		}

		if (activeItem === "tweets" && !tweets.loaded) {
			getTweets(q, pageIds)
		}
		// eslint-disable-next-line
	}, [q, activeItem])

	useEffect(() => {
		const getPageOptions = async () => {
			const options = await getDropdownOptions()
			dispatch({
				type: "SET_PAGE_OPTIONS",
				options
			})
		}
		getPageOptions()
		getCounts("")
	}, [])

	const handleItemClick = (e, { name }) => {
		setActiveItem(name)
		const stringified = qs.stringify({
			network,
			pageId,
			refIds,
			type: name
		})
		history.push(`/search/?${stringified}`)
	}

	const getCounts = async (q) => {
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}search/counts`, {
				params: {
					q
				}
			})
			.then((response) => {
				dispatch({
					type: "SET_COUNTS",
					counts: response.data
				})
			})
			.catch(() => {})
	}

	const getContradictions = async (q, pageIds, page = 1) => {
		page === 1 ? setLoadingC(true) : setLoadingMoreC(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}fallacies`, {
				params: {
					with: [
						"contradictionTwitter.tweet",
						"contradictionYouTube.video",
						"twitter.tweet",
						"youtube.video",
						"reference"
					],
					includeContradictions: true,
					page,
					q,
					pageIds,
					refIds: [21]
				}
			})
			.then((response) => {
				const { data, meta } = response.data
				dispatch({
					type: "SEARCH_CONTRADICTIONS",
					contradictions: data,
					page
				})
				setPageNumberC(pageNumberC + 1)
				setHasMoreC(meta.current_page < meta.last_page)
				page === 1 ? setLoadingC(false) : setLoadingMoreC(false)
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	const getFallacies = async (q, refIds, pageIds, page = 1) => {
		page === 1 ? setLoadingF(true) : setLoadingMoreF(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}fallacies`, {
				params: {
					with: ["reference", "user", "twitter.tweet", "youtube.video"],
					page,
					pageIds,
					refIds,
					q
				}
			})
			.then((response) => {
				const { data, meta } = response.data
				dispatch({
					type: "SEARCH_FALLACIES",
					fallacies: data,
					page
				})
				setPageNumberF(pageNumberF + 1)
				setHasMoreF(meta.current_page < meta.last_page)
				page === 1 ? setLoadingF(false) : setLoadingMoreF(false)
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	const getPages = async (q, network, page = 1) => {
		page === 1 ? setLoadingP(true) : setLoadingMoreP(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}pages`, {
				params: {
					fallacyCount: true,
					network,
					q,
					page,
					sort: "fallacies_count",
					dir: "desc"
				}
			})
			.then((response) => {
				const { data, meta } = response.data
				dispatch({
					type: "SEARCH_PAGES",
					pages: data,
					page
				})
				setPageNumberP(pageNumberP + 1)
				setHasMoreP(meta.current_page < meta.last_page)
				page === 1 ? setLoadingP(false) : setLoadingMoreP(false)

				getTwitterPages()
				getYoutubePages()
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	const getTwitterPages = async () => {
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}pages/twitterCount`)
			.then((response) => {
				const { count } = response.data
				dispatch({
					type: "SET_PAGES_TWITTER_COUNT",
					count
				})
			})
			.catch(() => {})
	}

	const getYoutubePages = async () => {
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}pages/youtubeCount`)
			.then((response) => {
				const { count } = response.data
				dispatch({
					type: "SET_PAGES_YOUTUBE_COUNT",
					count
				})
			})
			.catch(() => {})
	}

	const getTweets = async (q, pageIds, page = 1) => {
		page === 1 ? setLoadingT(true) : setLoadingMoreT(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}tweets`, {
				params: {
					pageIds,
					q,
					page
				}
			})
			.then((response) => {
				const { data, meta } = response.data
				dispatch({
					type: "SEARCH_TWEETS",
					tweets: data,
					page,
					total: meta.total
				})
				setPageNumberT(pageNumberT + 1)
				setHasMoreT(meta.current_page < meta.last_page)
				page === 1 ? setLoadingT(false) : setLoadingMoreT(false)
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	const onChangeQ = async (e) => {
		const value = e.target.value
		setQ(value)
		getCounts(value)

		if (activeItem === "contradictions") {
			await getContradictions(value, pageIdsC)
		}

		if (activeItem === "fallacies") {
			await getFallacies(value, refIds, pageIdsF)
		}

		if (activeItem === "pages") {
			await getPages(value, network)
		}

		if (activeItem === "tweets") {
			await getTweets(value, pageIds)
		}
	}

	const onClickFallacy = (e, slug) => {
		onClickRedirect(e, history, `/fallacies/${slug}`)
	}

	const onClickPage = (e, network, slug) => {
		onClickRedirect(e, history, `/pages/${network}/${slug}`)
	}

	const onClickTweet = (e, id) => {
		onClickRedirect(e, history, `/tweets/${id}`)
	}

	const onChangeContradictionsUser = async (e, { value }) => {
		dispatch({
			type: "TOGGLE_CONTRADICTIONS_LOADED"
		})
		setPageIdsC(value)
		getContradictions(q, value)
	}

	const onChangeFallaciesUser = async (e, { value }) => {
		dispatch({
			type: "TOGGLE_FALLACIES_LOADED"
		})
		setPageIdsF(value)
		getFallacies(q, newRefIds, value)
	}

	const onChangeTwitterUser = async (e, { value }) => {
		dispatch({
			type: "TOGGLE_TWEETS_LOADED"
		})
		setPageIds(value)
		getTweets(q, value)
	}

	return (
		<DefaultLayout
			activeItem="search"
			containerClassName="searchPage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="search" />

			<div className={`ui left icon input large fluid ${inverted ? "inverted" : ""}`}>
				<i aria-hidden="true" class="search icon"></i>
				<DebounceInput
					debounceTimeout={400}
					minLength={3}
					onChange={onChangeQ}
					placeholder="Search..."
					value={q}
				/>
			</div>

			<Menu secondary pointing size="huge">
				<Menu.Item active={activeItem === "tweets"} name="tweets" onClick={handleItemClick}>
					Tweets
					<Label color="blue">{tweets.count}</Label>
				</Menu.Item>
				<Menu.Item
					active={activeItem === "fallacies"}
					name="fallacies"
					onClick={handleItemClick}
				>
					Fallacies
					<Label color="blue">{fallacies.count}</Label>
				</Menu.Item>
				<Menu.Item
					active={activeItem === "contradictions"}
					name="contradictions"
					onClick={handleItemClick}
				>
					Contradictions
					<Label color="blue">{contradictions.count}</Label>
				</Menu.Item>
				<Menu.Item active={activeItem === "pages"} name="pages" onClick={handleItemClick}>
					Pages
					<Label color="blue">{pages.count}</Label>
				</Menu.Item>
			</Menu>

			{activeItem === "fallacies" && (
				<>
					<Dropdown
						className="large"
						fluid
						multiple
						onChange={onChangeFallaciesUser}
						options={pageOptions}
						placeholder="Filter by page"
						search
						selection
						value={pageIdsF}
					/>

					<Divider />

					<Visibility
						continuous
						offset={[50, 50]}
						onBottomVisible={() => {
							if (!loadingF && !loadingMoreF && hasMoreF) {
								getFallacies(q, refIds, pageIdsF, pageNumberF)
							}
						}}
					>
						<FallacyList
							fallacies={fallacies.data}
							history={history}
							inverted={inverted}
							loading={!fallacies.loaded}
							loadingMore={loadingMoreF}
							onClickFallacy={onClickFallacy}
						/>
					</Visibility>
				</>
			)}

			{activeItem === "contradictions" && (
				<>
					<Dropdown
						className="large"
						fluid
						multiple
						onChange={onChangeContradictionsUser}
						options={pageOptions}
						placeholder="Filter by page"
						search
						selection
						value={pageIdsC}
					/>

					<Divider />

					<Visibility
						continuous
						offset={[50, 50]}
						onBottomVisible={() => {
							if (!loadingC && !loadingMoreC && hasMoreC) {
								getContradictions(q, pageIdsC, pageNumberC)
							}
						}}
					>
						<FallacyList
							fallacies={contradictions.data}
							history={history}
							inverted={inverted}
							loading={!contradictions.loaded}
							loadingMore={loadingMoreC}
							onClickFallacy={onClickFallacy}
						/>
					</Visibility>
				</>
			)}

			{activeItem === "pages" && (
				<>
					<Divider />

					<Button as="div" labelPosition="right">
						<Button active color="twitter">
							<Icon name="twitter" />
							Twitter
						</Button>
						<Label basic pointing="left">
							<NumberFormat
								displayType={"text"}
								thousandSeparator
								value={twitterCount}
							/>
						</Label>
					</Button>
					<Button as="div" labelPosition="right">
						<Button color="youtube">
							<Icon name="youtube" />
							YouTube
						</Button>
						<Label basic pointing="left">
							<NumberFormat
								displayType={"text"}
								thousandSeparator
								value={youtubeCount}
							/>
						</Label>
					</Button>

					<Divider />

					<Visibility
						continuous
						offset={[50, 50]}
						onBottomVisible={() => {
							if (!loadingP && !loadingMoreP && hasMoreP) {
								getPages(q, network, pageNumberP)
							}
						}}
					>
						<PageList
							history={history}
							inverted={inverted}
							loading={!pages.loaded}
							loadingMore={loadingMoreP}
							onClickPage={onClickPage}
							pages={pages.data}
						/>
					</Visibility>
				</>
			)}

			{activeItem === "tweets" && (
				<>
					<Dropdown
						className="large"
						fluid
						multiple
						onChange={onChangeTwitterUser}
						options={pageOptions}
						placeholder="Filter by page"
						search
						selection
						value={pageIds}
					/>

					<Divider />

					<Visibility
						continuous
						offset={[50, 50]}
						onBottomVisible={() => {
							if (!loadingT && !loadingMoreT && hasMoreT) {
								getTweets(q, pageId, pageNumberT)
							}
						}}
					>
						<TweetList
							highlightedText={q}
							history={history}
							inverted={inverted}
							loading={!tweets.loaded}
							loadingMore={loadingMoreT}
							onClickPage={onClickTweet}
							tweets={tweets.data}
						/>
					</Visibility>
				</>
			)}

			<Divider hidden section />
		</DefaultLayout>
	)
}

Search.propTypes = {
	history: PropTypes.object
}

export default Search
