import "linkify-plugin-hashtag"
import "linkify-plugin-mention"
import {
	Button,
	Divider,
	Grid,
	Header,
	Icon,
	Image,
	Label,
	Menu,
	Message,
	Modal,
	Segment,
	Visibility
} from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { formatPlural } from "utils/textFunctions"
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
import Logo from "images/logos/npc.svg"
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
	const { args, contradictions, error, fallacies, loaded, modalTweets, page, tweets } =
		internalState

	const [activeItem, setActiveItem] = useState("arguments")
	const [argId, setArgId] = useState(null)
	const [hasMore, setHasMore] = useState(false)
	const [hasMoreC, setHasMoreC] = useState(false)
	const [hasMoreT, setHasMoreT] = useState(false)
	const [hasMoreM, setHasMoreM] = useState(false)
	const [loading, setLoading] = useState(true)
	const [loadingC, setLoadingC] = useState(true)
	const [loadingT, setLoadingT] = useState(true)
	const [loadingM, setLoadingM] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [loadingMoreC, setLoadingMoreC] = useState(false)
	const [loadingMoreT, setLoadingMoreT] = useState(false)
	const [loadingMoreM, setLoadingMoreM] = useState(false)
	const [imageLoaded, setImageLoaded] = useState(false)
	const [pageNumber, setPageNumber] = useState(1)
	const [pageNumberC, setPageNumberC] = useState(1)
	const [pageNumberT, setPageNumberT] = useState(1)
	const [pageNumberM, setPageNumberM] = useState(1)
	const [modalOpen, setModalOpen] = useState(false)

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
					getArguments(page.id)
					getFallacies([page.id])
					getContradictions([page.id])

					if (network === "twitter") {
						getTweets(page.socialMediaId)
					}
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

	const getArguments = async (id) => {
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}arguments/getArgumentsByPage`, {
				params: {
					id
				}
			})
			.then((response) => {
				const { data } = response.data
				dispatchInternal({
					type: "GET_ARGUMENTS",
					args: data
				})
			})
			.catch(() => {
				console.error("Error fetching arguments")
			})
	}

	const getArgTweets = async (argIds, pageIds, page = 1) => {
		page === 1 ? setLoadingM(true) : setLoadingMoreM(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}tweets`, {
				params: {
					argIds,
					pageIds,
					page
				}
			})
			.then((response) => {
				const { data, meta } = response.data
				dispatchInternal({
					type: "GET_MODAL_TWEETS",
					tweets: data,
					page,
					total: meta.total
				})
				setPageNumberM(page + 1)
				setHasMoreM(true)
				page === 1 ? setLoadingM(false) : setLoadingMoreM(false)
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

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
					commentCount: true,
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
					commentCount: true,
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
				headers: {
					Authorization: `Bearer ${localStorage.getItem("bearer")}`
				},
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
												{page.username !== "" && (
													<Header.Subheader>
														@{page.username}
													</Header.Subheader>
												)}
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
																`${process.env.REACT_APP_URL}pages/twitter/${val}`,
															hashtag: (val) => val
														}
													})
												}}
											/>
										</Header>
									</Grid.Column>
								</Grid.Row>
							</Grid>

							<Menu secondary pointing size="large" stackable>
								<Menu.Item
									active={activeItem === "arguments"}
									name="arguments"
									onClick={handleItemClick}
								>
									Arguments
								</Menu.Item>
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
								{network === "twitter" && (
									<Menu.Item
										active={activeItem === "tweets"}
										name="tweets"
										onClick={handleItemClick}
									>
										Tweets
									</Menu.Item>
								)}
							</Menu>

							{activeItem === "arguments" && (
								<>
									<Message
										content={`Here's how often ${page.name} has recycled the same arguments`}
										header={`How original is ${page.name}'s material?`}
										icon={{
											color: "red",
											name: "question mark"
										}}
									/>
									{args.map((arg, i) => (
										<Segment
											className="argSegment"
											key={`argItem${i}`}
											onClick={(e) => {
												onClickRedirect(
													e,
													history,
													`/arguments/${arg.slug}`
												)
											}}
											padded
										>
											<Label
												attached="top"
												basic
												onClick={(e) => {
													e.stopPropagation()
													setArgId(arg.id)
													setModalOpen(true)
													getArgTweets([arg.id], [page.id])
												}}
												size="large"
											>
												<Icon color="green" name="recycle" />
												{arg.tweetCount}{" "}
												{formatPlural(arg.tweetCount, "time")}
											</Label>
											<Header textAlign="center" size="medium">
												"{arg.description}"
											</Header>
										</Segment>
									))}
								</>
							)}

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

							<Modal
								basic
								centered={false}
								closeIcon
								dimmer="blurring"
								onClose={() => setModalOpen(false)}
								onOpen={() => setModalOpen(true)}
								open={modalOpen}
								size="large"
							>
								<Modal.Content>
									<Segment>
										<Visibility
											continuous
											offset={[50, 50]}
											onBottomVisible={() => {
												if (!loadingM && !loadingMoreM && hasMoreM) {
													getArgTweets([argId], [page.id], pageNumberM)
												}
											}}
										>
											<TweetList
												history={history}
												inverted={inverted}
												loading={false}
												loadingMore={false}
												showSaveOption={false}
												tweets={modalTweets}
											/>
										</Visibility>
									</Segment>
								</Modal.Content>
							</Modal>
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
