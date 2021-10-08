import { Divider, Dropdown, Header, Menu, Segment, Visibility } from "semantic-ui-react"
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

	const [activeItem, setActiveItem] = useState(type)
	const [q, setQ] = useState(_q)

	/*
	const [hasMoreC, setHasMoreC] = useState(false)
	const [loadingC, setLoadingC] = useState(true)
	const [loadingMoreC, setLoadingMoreC] = useState(false)
	const [pageNumberC, setPageNumberC] = useState(1)
	*/

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
	const [pageIdsC, setPageIdC] = useState([])

	useEffect(() => {
		const getPageOptions = async () => {
			const options = await getDropdownOptions()
			dispatch({
				type: "SET_PAGE_OPTIONS",
				options
			})
		}
		getPageOptions()

		if (activeItem === "contradictions") {
			getFallacies(q, refIds, pageIdsC)
		}

		if (activeItem === "fallacies") {
			getFallacies(q, refIds, pageIdsF)
		}

		if (activeItem === "pages") {
			getPages(q, network)
		}

		if (activeItem === "tweets") {
			getTweets(q, pageIds)
		}
		// eslint-disable-next-line
	}, [q, activeItem])

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

	const getFallacies = async (q, refIds, pageIds, page = 1) => {
		page === 1 ? setLoadingF(true) : setLoadingMoreF(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}fallacies`, {
				params: {
					with: ["reference", "user", "twitter.tweet", "youtube.video"],
					page,
					pageIds,
					refIds
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
				pageNumberF === 1 ? setLoadingF(false) : setLoadingMoreF(false)
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
					network,
					q,
					page
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
				pageNumberP === 1 ? setLoadingP(false) : setLoadingMoreP(false)
			})
			.catch(() => {
				console.error("There was an error")
			})
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
					page
				})
				setPageNumberT(pageNumberT + 1)
				setHasMoreT(meta.current_page < meta.last_page)
				pageNumberT === 1 ? setLoadingT(false) : setLoadingMoreT(false)
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	const onChangeQ = (e) => {
		const value = e.target.value
		setQ(value)
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

			<Header as="h1" content="Search" />
			<div className={`ui labeled input large fluid ${inverted ? "inverted" : ""}`}>
				<DebounceInput
					debounceTimeout={800}
					minLength={2}
					onChange={onChangeQ}
					placeholder="Search..."
					value={q}
				/>
			</div>

			<Divider />

			<Menu attached="top" size="large" tabular>
				<Menu.Item active={activeItem === "tweets"} name="tweets" onClick={handleItemClick}>
					Tweets
				</Menu.Item>
				<Menu.Item
					active={activeItem === "fallacies"}
					name="fallacies"
					onClick={handleItemClick}
				>
					Fallacies
				</Menu.Item>
				<Menu.Item
					active={activeItem === "contradictions"}
					name="contradictions"
					onClick={handleItemClick}
				>
					Contradictions
				</Menu.Item>
				<Menu.Item active={activeItem === "pages"} name="pages" onClick={handleItemClick}>
					Pages
				</Menu.Item>
			</Menu>

			<Segment attached>
				{activeItem === "fallacies" && (
					<>
						<Dropdown
							className="large"
							fluid
							multiple
							onChange={onChangeFallaciesUser}
							options={pageOptions}
							placeholder="Filter by user"
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

				{activeItem === "pages" && (
					<>
						<Dropdown
							className="large"
							fluid
							multiple
							onChange={onChangeTwitterUser}
							options={pageOptions}
							placeholder="Filter by user"
							search
							selection
						/>

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
							placeholder="Filter by user"
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
			</Segment>
		</DefaultLayout>
	)
}

Search.propTypes = {
	history: PropTypes.object
}

export default Search
