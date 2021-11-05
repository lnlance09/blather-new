import {
	Button,
	Divider,
	Dropdown,
	Icon,
	Label,
	Menu,
	Segment,
	Visibility
} from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { DebounceInput } from "react-debounce-input"
import { onClickRedirect } from "utils/linkFunctions"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getDropdownOptions } from "options/page"
import { getReferenceOptions } from "options/reference"
import _ from "underscore"
import axios from "axios"
import DefaultLayout from "layouts/default"
import FallacyList from "components/FallacyList"
import initialState from "states/search"
import ItemPic from "images/images/square-image.png"
import logger from "use-reducer-logger"
import NumberFormat from "react-number-format"
import PageList from "components/PageList"
import PropTypes from "prop-types"
import qs from "query-string"
import reducer from "reducers/search"
import ThemeContext from "themeContext"
import TweetList from "components/TweetList"

const Search = ({ history }) => {
	const query = qs.parse(window.location.search)
	const network = _.isEmpty(query.network) ? "twitter" : query.network

	const _q = _.isEmpty(query.q) ? "" : query.q
	const type = !query.type ? "tweets" : query.type

	let refIds = !query["refIds[]"] ? [] : query["refIds[]"]
	if (typeof refIds === "string") {
		refIds = [refIds]
	}
	refIds = refIds.map((i) => Number(i))

	let _pageIds = !query["pageIds[]"] ? [] : query["pageIds[]"]
	if (typeof _pageIds === "string") {
		_pageIds = [_pageIds]
	}
	_pageIds = _pageIds.map((i) => Number(i))

	// fallacy page ids
	let _pageIdsF = !query["pageIdsF[]"] ? [] : query["pageIdsF[]"]
	if (typeof _pageIdsF === "string") {
		_pageIdsF = [_pageIdsF]
	}
	_pageIdsF = _pageIdsF.map((i) => Number(i))

	// contradiction page ids
	let _pageIdsC = !query["pageIdsC[]"] ? [] : query["pageIdsC[]"]
	if (typeof _pageIdsC === "string") {
		_pageIdsC = [_pageIdsC]
	}
	_pageIdsC = _pageIdsC.map((i) => Number(i))

	const { state } = useContext(ThemeContext)
	const { inverted } = state

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { contradictions, fallacies, pageOptions, pages, refOptions, tweets } = internalState
	const { twitterCount, youtubeCount } = pages

	const [activeItem, setActiveItem] = useState(type)
	const [newNetwork, setNewNetwork] = useState(network)
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

	const [pageIds, setPageIds] = useState(_pageIds)
	const [pageIdsF, setPageIdsF] = useState(_pageIdsF)
	const [pageIdsC, setPageIdsC] = useState(_pageIdsC)

	const getPageOptions = async () => {
		const options = await getDropdownOptions()
		dispatch({
			type: "SET_PAGE_OPTIONS",
			options
		})
	}

	const getRefOptions = async (pageIds = null) => {
		const options = await getReferenceOptions(pageIds)
		dispatch({
			type: "SET_REFERENCE_OPTIONS",
			options
		})
	}

	useEffect(() => {
		getRefOptions(pageIdsF)
		getPageOptions()
		getCounts()
		// eslint-disable-next-line
	}, [])

	useEffect(() => {
		if (activeItem === "contradictions" && !contradictions.loaded) {
			getContradictions(q, pageIdsC)
		}

		if (activeItem === "fallacies" && !fallacies.loaded) {
			getFallacies(q, newRefIds, pageIdsF)
		}

		if (activeItem === "pages" && !pages.loaded) {
			getPages(q, network, 0, true)
		}

		if (activeItem === "tweets" && !tweets.loaded) {
			getTweets(q, pageIds)
		}
		// eslint-disable-next-line
	}, [activeItem])

	useEffect(() => {
		getCounts(q)
		// eslint-disable-next-line
	}, [q])

	const handleItemClick = (e, { name }) => {
		setActiveItem(name)
		const stringified = qs.stringify(
			{
				q,
				pageIds,
				pageIdsF,
				pageIdsC,
				network,
				refIds,
				type: name
			},
			{ arrayFormat: "bracket" }
		)
		history.push(`/search/?${stringified}`)
	}

	const getCounts = async (q = null) => {
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}search/counts`, {
				params: {
					q,
					refIds,
					pageIds,
					pageIdsF,
					pageIdsC
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
					page,
					total: meta.total
				})
				setPageNumberC(page + 1)
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
					page,
					total: meta.total
				})
				setPageNumberF(page + 1)
				setHasMoreF(meta.current_page < meta.last_page)
				page === 1 ? setLoadingF(false) : setLoadingMoreF(false)
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	const getPages = async (q, network, page = 1, updateCounts = false) => {
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
					page,
					total: meta.total,
					updateCounts
				})
				setPageNumberP(page + 1)
				setHasMoreP(meta.current_page < meta.last_page)
				page === 1 ? setLoadingP(false) : setLoadingMoreP(false)

				if (updateCounts) {
					getPagesByNetwork("twitter", q)
					getPagesByNetwork("youtube", q)
				}
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	const getPagesByNetwork = async (network, q = null) => {
		const type = network === "twitter" ? "SET_PAGES_TWITTER_COUNT" : "SET_PAGES_YOUTUBE_COUNT"
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}pages/countByNetwork`, {
				params: {
					network,
					q
				}
			})
			.then((response) => {
				const { count } = response.data
				dispatch({
					type,
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
				setPageNumberT(page + 1)
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

		const stringified = qs.stringify(
			{
				q: value,
				network: newNetwork,
				pageIds,
				pageIdsF,
				pageIdsC,
				refIds,
				type: activeItem
			},
			{ arrayFormat: "bracket" }
		)
		history.push(`/search/?${stringified}`)

		if (activeItem === "contradictions") {
			dispatch({
				type: "TOGGLE_CONTRADICTIONS_LOADED"
			})
			await getContradictions(value, pageIdsC)
		}

		if (activeItem === "fallacies") {
			dispatch({
				type: "TOGGLE_FALLACIES_LOADED"
			})
			await getFallacies(value, newRefIds, pageIdsF)
		}

		if (activeItem === "pages") {
			dispatch({
				type: "TOGGLE_PAGES_LOADED"
			})
			await getPages(value, newNetwork, 1, true)
		}

		if (activeItem === "tweets") {
			dispatch({
				type: "TOGGLE_TWEETS_LOADED"
			})
			await getTweets(value, pageIds)
		}
	}

	const onClickFallacy = (e, slug) => {
		onClickRedirect(e, history, `/fallacies/${slug}`)
	}

	const onClickPage = (e, network, slug) => {
		onClickRedirect(e, history, `/pages/${network}/${slug}`)
	}

	const onChangeContradictionsUser = async (e, { value }) => {
		dispatch({
			type: "TOGGLE_CONTRADICTIONS_LOADED"
		})
		const stringified = qs.stringify(
			{
				q,
				network,
				pageIds,
				pageIdsF,
				pageIdsC: value,
				refIds,
				type: activeItem
			},
			{ arrayFormat: "bracket" }
		)
		history.push(`/search/?${stringified}`)
		setPageIdsC(value)
		getContradictions(q, value)
	}

	const onChangeFallaciesUser = async (e, { value }) => {
		dispatch({
			type: "TOGGLE_FALLACIES_LOADED"
		})
		const stringified = qs.stringify(
			{
				q,
				network,
				pageIds,
				pageIdsF: value,
				pageIdsC,
				refIds,
				type: activeItem
			},
			{ arrayFormat: "bracket" }
		)
		history.push(`/search/?${stringified}`)
		getRefOptions(value)
		setPageIdsF(value)
		getFallacies(q, newRefIds, value)
	}

	const onChangeRef = async (e, { value }) => {
		dispatch({
			type: "TOGGLE_FALLACIES_LOADED"
		})
		const stringified = qs.stringify(
			{
				q,
				network,
				pageIds,
				pageIdsF,
				pageIdsC,
				refIds: value,
				type: activeItem
			},
			{ arrayFormat: "bracket" }
		)
		history.push(`/search/?${stringified}`)
		setNewRefIds(value)
		getFallacies(q, value, pageIdsF)
	}

	const onChangeTwitterUser = async (e, { value }) => {
		dispatch({
			type: "TOGGLE_TWEETS_LOADED"
		})
		const stringified = qs.stringify(
			{
				q,
				network,
				pageIds: value,
				pageIdsF,
				pageIdsC,
				refIds,
				type: activeItem
			},
			{ arrayFormat: "bracket" }
		)
		history.push(`/search/?${stringified}`)
		setPageIds(value)
		getTweets(q, value)
	}

	return (
		<DefaultLayout activeItem="search" containerClassName="searchPage" history={history}>
			<DisplayMetaTags page="search" />

			<div className={`ui left icon input large fluid ${inverted ? "inverted" : ""}`}>
				<i aria-hidden="true" className="search icon"></i>
				<DebounceInput
					debounceTimeout={400}
					minLength={3}
					onChange={onChangeQ}
					placeholder="Search..."
					value={q}
				/>
			</div>

			<Menu secondary pointing size="large" widths={4}>
				<Menu.Item active={activeItem === "tweets"} name="tweets" onClick={handleItemClick}>
					Tweets
					{tweets.count > 0 && (
						<span className="count">
							(
							<NumberFormat
								displayType={"text"}
								thousandSeparator
								value={tweets.count}
							/>
							)
						</span>
					)}
				</Menu.Item>
				<Menu.Item
					active={activeItem === "fallacies"}
					name="fallacies"
					onClick={handleItemClick}
				>
					Fallacies
					{fallacies.count > 0 && (
						<span className="count">
							(
							<NumberFormat
								displayType={"text"}
								thousandSeparator
								value={fallacies.count}
							/>
							)
						</span>
					)}
				</Menu.Item>
				<Menu.Item
					active={activeItem === "contradictions"}
					name="contradictions"
					onClick={handleItemClick}
				>
					Contradictions
					{contradictions.count > 0 && (
						<span className="count">
							(
							<NumberFormat
								displayType={"text"}
								thousandSeparator
								value={contradictions.count}
							/>
							)
						</span>
					)}
				</Menu.Item>
				<Menu.Item active={activeItem === "pages"} name="pages" onClick={handleItemClick}>
					Pages
					{pages.count > 0 && (
						<span className="count">
							(
							<NumberFormat
								displayType={"text"}
								thousandSeparator
								value={pages.count}
							/>
							)
						</span>
					)}
				</Menu.Item>
			</Menu>

			{activeItem === "fallacies" && (
				<>
					<Segment>
						<Dropdown
							fluid
							multiple
							onChange={onChangeFallaciesUser}
							options={pageOptions}
							placeholder="Filter by page"
							renderLabel={(item) => {
								return <Label color="blue" content={item.name} image={item.image} />
							}}
							search
							selection
							value={pageIdsF}
						/>

						<Divider />

						<Dropdown
							fluid
							multiple
							onChange={onChangeRef}
							options={refOptions}
							placeholder="Filter by fallacy"
							renderLabel={(item) => {
								return <Label color="blue" content={item.name} image={item.image} />
							}}
							search
							selection
							value={newRefIds}
						/>
					</Segment>

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
						fluid
						multiple
						onChange={onChangeContradictionsUser}
						options={pageOptions}
						placeholder="Filter by page"
						renderLabel={(item) => {
							return <Label color="blue" content={item.name} image={item.image} />
						}}
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
					<Divider hidden />

					<Button
						as="div"
						className="labelBtn"
						labelPosition="right"
						onClick={() => {
							setNewNetwork("twitter")
							getPages(q, "twitter")
						}}
					>
						<Button
							className={newNetwork === "twitter" ? "active" : ""}
							color="twitter"
						>
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
					<Button
						as="div"
						className="labelBtn"
						labelPosition="right"
						onClick={() => {
							setNewNetwork("youtube")
							getPages(q, "youtube")
						}}
					>
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

					<Divider hidden />

					<Visibility
						continuous
						offset={[50, 50]}
						onBottomVisible={() => {
							if (!loadingP && !loadingMoreP && hasMoreP) {
								getPages(q, newNetwork, pageNumberP)
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
						fluid
						multiple
						onChange={onChangeTwitterUser}
						options={pageOptions}
						placeholder="Filter by page"
						renderLabel={(item) => {
							return <Label color="blue" content={item.name} image={item.image} />
						}}
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
								getTweets(q, pageIds, pageNumberT)
							}
						}}
					>
						<TweetList
							defaultUserImg={ItemPic}
							highlightedText={q}
							history={history}
							inverted={inverted}
							loading={!tweets.loaded}
							loadingMore={loadingMoreT}
							showSaveOption
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
