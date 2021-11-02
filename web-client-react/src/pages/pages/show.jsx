import "linkify-plugin-hashtag"
import "linkify-plugin-mention"
import { Button, Divider, Grid, Header, Image, Menu, Visibility } from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { ReactSVG } from "react-svg"
import { DisplayMetaTags } from "utils/metaFunctions"
import { onClickRedirect } from "utils/linkFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import FallacyList from "components/FallacyList"
import initialState from "states/page"
import linkifyHtml from "linkify-html"
import logger from "use-reducer-logger"
import Logo from "images/logos/agent.svg"
import NumberFormat from "react-number-format"
import PlaceholderPic from "images/images/image-square.png"
import PropTypes from "prop-types"
import reducer from "reducers/page"
import ThemeContext from "themeContext"
import TweetList from "components/TweetList"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Page = ({ history, match }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state
	const { network, slug } = match.params

	const [internalState, dispatchInternal] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { contradictions, error, fallacies, loaded, page, tweets } = internalState

	const [activeItem, setActiveItem] = useState("fallacies")
	const [hasMore, setHasMore] = useState(false)
	const [hasMoreC, setHasMoreC] = useState(false)
	const [hasMoreT, setHasMoreT] = useState(false)
	const [loading, setLoading] = useState(true)
	const [loadingC, setLoadingC] = useState(true)
	const [loadingT, setLoadingT] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [loadingMoreC, setLoadingMoreC] = useState(false)
	const [loadingMoreT, setLoadingMoreT] = useState(false)
	const [imageLoaded, setImageLoaded] = useState(false)
	const [pageNumber, setPageNumber] = useState(1)
	const [pageNumberC, setPageNumberC] = useState(1)
	const [pageNumberT, setPageNumberT] = useState(1)

	useEffect(() => {
		const getPage = async (slug) => {
			await axios
				.get(`${process.env.REACT_APP_BASE_URL}pages/${network}/${slug}`)
				.then(async (response) => {
					const page = response.data.data
					dispatchInternal({
						type: "GET_PAGE",
						page
					})
					getFallacies([page.id])
					getContradictions([page.id])
					getTweets(page.socialMediaId)
				})
				.catch(() => {
					dispatchInternal({
						type: "SET_PAGE_ERROR"
					})
					toast.error("There was an error")
				})
		}

		getPage(slug)
		// eslint-disable-next-line
	}, [slug])

	const getContradictions = async (pageIds, page = 1) => {
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
					pageIds,
					refIds: [21]
				}
			})
			.then(async (response) => {
				const { data, meta } = response.data
				dispatchInternal({
					type: "GET_CONTRADICTIONS",
					contradictions: data,
					page
				})
				setPageNumberC(page + 1)
				setHasMoreC(meta.current_page < meta.last_page)
				pageNumberC === 1 ? setLoadingC(false) : setLoadingMoreC(false)
			})
			.catch(() => {
				toast.error("There was an error")
			})
	}

	const getFallacies = async (pageIds, page = 1) => {
		page === 1 ? setLoading(true) : setLoadingMore(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}fallacies`, {
				params: {
					with: ["reference", "user", "twitter.tweet", "youtube.video"],
					page,
					pageIds
				}
			})
			.then(async (response) => {
				const { data, meta } = response.data
				dispatchInternal({
					type: "GET_FALLACIES",
					fallacies: data,
					page
				})
				setPageNumber(page + 1)
				setHasMore(meta.current_page < meta.last_page)
				pageNumber === 1 ? setLoading(false) : setLoadingMore(false)
			})
			.catch(() => {
				toast.error("There was an error")
			})
	}

	const getTweets = async (pageId, page = 1) => {
		page === 1 ? setLoadingT(true) : setLoadingMoreT(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}tweets/showTwitterFeed`, {
				params: {
					pageId,
					page
				}
			})
			.then((response) => {
				const { data } = response.data
				dispatchInternal({
					type: "GET_TWEETS",
					tweets: data,
					page
				})
				setPageNumberT(page + 1)
				setHasMoreT(true)
				pageNumberT === 1 ? setLoadingT(false) : setLoadingMoreT(false)
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	const handleItemClick = (e, { name }) => {
		setActiveItem(name)
	}

	const onClickFallacy = (e, slug) => {
		onClickRedirect(e, history, `/fallacies/${slug}`)
	}

	return (
		<DefaultLayout activeItem="" containerClassName="socialMediaPage" history={history}>
			<DisplayMetaTags page="page" state={internalState} />

			{loaded ? (
				<>
					{error && (
						<div className="centeredLoader">
							<Header as="h1" image textAlign="center">
								<ReactSVG className="errorSvg" src={Logo} />
								<Header.Content>This page does not exist</Header.Content>
							</Header>
						</div>
					)}

					{!error && (
						<>
							<Grid stackable>
								<Grid.Row>
									<Grid.Column className="imgColumn" width={3}>
										<Image
											bordered
											className={`inverted smooth-image image-${
												imageLoaded ? "visible" : "hidden"
											}`}
											fluid
											onError={(i) => (i.target.src = PlaceholderPic)}
											onLoad={() => setImageLoaded(true)}
											rounded
											src={page.image}
										/>
									</Grid.Column>
									<Grid.Column width={8}>
										<Header as="h1" inverted={inverted}>
											<Header.Content>
												{page.name}
												<Header.Subheader>
													@{page.username}
												</Header.Subheader>
											</Header.Content>
											<Button
												circular
												className={`networkBtn ${
													inverted ? "inverted" : ""
												}`}
												color={network}
												compact
												icon={network}
												onClick={() => {
													window.open(page.externalLink, "_blank").focus()
												}}
												size="small"
											/>
										</Header>
										<Header
											as="p"
											inverted={inverted}
											size="small"
											style={{ marginTop: 0 }}
										/>
										<Header
											inverted={inverted}
											size="small"
											style={{ marginTop: 0 }}
										>
											<div
												dangerouslySetInnerHTML={{
													__html: linkifyHtml(page.bio, {
														className: "linkify",
														formatHref: {
															mention: (val) =>
																`/pages/twitter${val}`,
															hashtag: (val) => val
														}
													})
												}}
											/>
										</Header>
									</Grid.Column>
								</Grid.Row>
							</Grid>

							<Menu secondary pointing size="large">
								<Menu.Item
									active={activeItem === "fallacies"}
									name="fallacies"
									onClick={handleItemClick}
								>
									Fallacies
									{page.fallacyCount > 0 && (
										<span className="count">
											(
											<NumberFormat
												displayType={"text"}
												thousandSeparator
												value={page.fallacyCount}
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
									{page.contradictionCount > 0 && (
										<span className="count">
											(
											<NumberFormat
												displayType={"text"}
												thousandSeparator
												value={page.contradictionCount}
											/>
											)
										</span>
									)}
								</Menu.Item>
								<Menu.Item
									active={activeItem === "tweets"}
									name="tweets"
									onClick={handleItemClick}
								>
									Tweets
								</Menu.Item>
							</Menu>

							{activeItem === "fallacies" && (
								<Visibility
									continuous
									offset={[50, 50]}
									onBottomVisible={() => {
										if (!loading && !loadingMore && hasMore) {
											getFallacies([page.id], pageNumber)
										}
									}}
								>
									<FallacyList
										defaultUserImg={page.image}
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
											getContradictions([page.id], pageNumberC)
										}
									}}
								>
									<FallacyList
										defaultUserImg={page.image}
										fallacies={contradictions.data}
										history={history}
										inverted={inverted}
										loading={!contradictions.loaded}
										loadingMore={loadingMoreC}
										onClickFallacy={onClickFallacy}
									/>
								</Visibility>
							)}

							{activeItem === "tweets" && (
								<Visibility
									continuous
									offset={[50, 50]}
									onBottomVisible={() => {
										if (!loadingT && !loadingMoreT && hasMoreT) {
											getTweets(page.socialMediaId, pageNumberT)
										}
									}}
								>
									<TweetList
										history={history}
										inverted={inverted}
										loading={!tweets.loaded}
										loadingMore={loadingMoreT}
										showSaveOption
										tweets={tweets.data}
									/>
								</Visibility>
							)}

							<Divider hidden section />
						</>
					)}
				</>
			) : (
				<div className="centeredLoader"></div>
			)}
		</DefaultLayout>
	)
}

Page.propTypes = {
	history: PropTypes.object,
	match: PropTypes.object
}

export default Page
