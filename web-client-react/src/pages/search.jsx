import { Button, Divider, Menu, Segment, Visibility } from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { DebounceInput } from "react-debounce-input"
import { DisplayMetaTags } from "utils/metaFunctions"
import axios from "axios"
import ContradictionList from "components/ContradictionList"
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

	const { state } = useContext(ThemeContext)
	const { type } = match.params
	const { inverted } = state

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { contradictions, fallacies, pages, tweets } = internalState

	const [activeItem, setActiveItem] = useState(type)
	const [q, setQ] = useState("")

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

	useEffect(() => {
		if (activeItem === "contradictions") {
			getFallacies(q, refIds, pageId)
		}

		if (activeItem === "fallacies") {
			getFallacies(q, refIds, pageId)
		}

		if (activeItem === "pages") {
			getPages(q, network)
		}

		if (activeItem === "tweets") {
			getTweets(q, pageId)
		}
	}, [q, activeItem])

	const handleItemClick = (e, { name }) => {
		setActiveItem(name)

		const stringified = qs.stringify({
			network,
			pageId,
			refIds
		})
		history.push(`/search/${name}?${stringified}`)
	}

	const getFallacies = async (q, refIds, pageId, page = 1) => {
		if (page === 1) {
			setLoadingF(true)
		} else {
			setLoadingMoreF(true)
		}

		await axios
			.get(`${process.env.REACT_APP_BASE_URL}fallacies`, {
				params: {
					with: ["reference", "user", "twitter.tweet", "youtube.video"],
					page,
					pageId,
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
				if (pageNumberF === 1) {
					setLoadingF(false)
				} else {
					setLoadingMoreF(false)
				}
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	const getPages = async (q, network, page = 1) => {
		if (page === 1) {
			setLoadingP(true)
		} else {
			setLoadingMoreP(true)
		}

		await axios
			.get(`${process.env.REACT_APP_BASE_URL}pages`)
			.then((response) => {
				const { data, meta } = response.data
				dispatch({
					type: "SEARCH_PAGES",
					pages: data,
					page
				})
				setPageNumberP(pageNumberP + 1)
				setHasMoreP(meta.current_page < meta.last_page)
				if (pageNumberP === 1) {
					setLoadingP(false)
				} else {
					setLoadingMoreP(false)
				}
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	const getTweets = async (q, pageId, page = 1) => {
		if (page === 1) {
			setLoadingT(true)
		} else {
			setLoadingMoreT(true)
		}

		await axios
			.get(`${process.env.REACT_APP_BASE_URL}tweets`)
			.then((response) => {
				const { data, meta } = response.data
				dispatch({
					type: "SEARCH_TWEETS",
					tweets: data,
					page
				})
				setPageNumberT(pageNumberT + 1)
				setHasMoreT(meta.current_page < meta.last_page)
				if (pageNumberT === 1) {
					setLoadingT(false)
				} else {
					setLoadingMoreT(false)
				}
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
		if (e.metaKey) {
			window.open(`/fallacies/${slug}`, "_blank").focus()
		} else {
			history.push(`/fallacies/${slug}`)
		}
	}

	const onClickPage = (e, network, slug) => {
		if (e.metaKey) {
			window.open(`/pages/${network}/${slug}`, "_blank").focus()
		} else {
			history.push(`/pages/${network}/${slug}`)
		}
	}

	const onClickTweet = (e, id) => {
		if (e.metaKey) {
			window.open(`/tweets/${id}`, "_blank").focus()
		} else {
			history.push(`/tweets/${id}`)
		}
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

			<div className={`ui labeled input large fluid ${inverted ? "inverted" : ""}`}>
				<DebounceInput
					debounceTimeout={800}
					minLength={2}
					onChange={onChangeQ}
					placeholder="Search..."
					value={q}
				/>
			</div>

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
					<Visibility
						continuous
						offset={[50, 50]}
						onBottomVisible={() => {
							if (!loadingF && !loadingMoreF && hasMoreF) {
								getFallacies(q, refIds, pageId, pageNumberF)
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
				)}

				{activeItem === "pages" && (
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
				)}

				{activeItem === "tweets" && (
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
							history={history}
							inverted={inverted}
							loading={!tweets.loaded}
							loadingMore={loadingMoreT}
							onClickPage={onClickTweet}
							tweets={tweets.data}
						/>
					</Visibility>
				)}
			</Segment>
		</DefaultLayout>
	)
}

Search.propTypes = {
	history: PropTypes.object
}

export default Search
