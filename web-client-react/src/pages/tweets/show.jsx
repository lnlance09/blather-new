import { useContext, useEffect, useReducer, useState } from "react"
import {
	Button,
	Divider,
	Dropdown,
	Header,
	Label,
	Loader,
	Menu,
	Segment,
	Visibility
} from "semantic-ui-react"
import { onClickRedirect } from "utils/linkFunctions"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getArgumentOptions } from "options/arguments"
import { tweetOptions } from "options/tweet"
import { ReactSVG } from "react-svg"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/tweet"
import FallacyList from "components/FallacyList"
import logger from "use-reducer-logger"
import Logo from "images/logos/npc.svg"
import NumberFormat from "react-number-format"
import PropTypes from "prop-types"
import reducer from "reducers/tweet"
import ThemeContext from "themeContext"
import Tweet from "components/Tweet"

const toastConfig = getConfig()
toast.configure(toastConfig)

const TweetPage = ({ history, match }) => {
	const { state } = useContext(ThemeContext)
	const { auth, inverted, user } = state
	const { id } = match.params

	const canEdit = auth && user.id === 1

	const [internalState, dispatchInternal] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)

	const [btnLoading, setBtnLoading] = useState(false)
	const [newArguments, setNewArguments] = useState([])

	const { argOptions, contradictions, error, fallacies, loaded, tweet } = internalState

	const showArgs = loaded && !error ? tweet.arguments.length > 0 : false

	const [activeItem, setActiveItem] = useState("fallacies")
	const [hasMore, setHasMore] = useState(false)
	const [hasMoreC, setHasMoreC] = useState(false)
	const [loading, setLoading] = useState(true)
	const [loadingC, setLoadingC] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [loadingMoreC, setLoadingMoreC] = useState(false)
	const [pageNumber, setPageNumber] = useState(1)
	const [pageNumberC, setPageNumberC] = useState(1)

	const getArgOptions = async () => {
		const options = await getArgumentOptions()
		dispatchInternal({
			type: "SET_ARGUMENT_OPTIONS",
			options
		})
	}

	useEffect(() => {
		const getTweet = async (id) => {
			const tweetId = await axios
				.get(`${process.env.REACT_APP_BASE_URL}tweets/${id}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("bearer")}`
					},
					params: {
						argument: 1
					}
				})
				.then((response) => {
					const { archived, tweet } = response.data
					dispatchInternal({
						type: "GET_TWEET",
						archived,
						tweet
					})
					setNewArguments(tweet.argumentOptions)

					if (archived) {
						toast.info("Tweet archived!")
					}

					return tweet.id
				})
				.catch((e) => {
					dispatchInternal({
						type: "SET_TWEET_ERROR"
					})
					toast.error("There was an error")
				})
			getFallacies(tweetId)
			getContradictions(tweetId)
		}

		if (canEdit) {
			getArgOptions()
		}

		getTweet(id)
		// eslint-disable-next-line
	}, [])

	const addArguments = async (id, args = []) => {
		await axios
			.post(
				`${process.env.REACT_APP_BASE_URL}tweets/${id}/addArguments`,
				{
					args
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("bearer")}`
					}
				}
			)
			.then(() => {
				toast.success("Argument(s) added!")
			})
			.catch(() => {
				toast.error("There was an error")
			})
	}

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
				setPageNumberC(page + 1)
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
					with: ["page", "reference", "user", "twitter.tweet"],
					tweetId,
					page
				}
			})
			.then(async (response) => {
				const { data, meta } = response.data
				dispatchInternal({
					type: "GET_FALLACIES",
					fallacies: data,
					page,
					total: meta.total
				})
				setPageNumber(page + 1)
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

	const onChangeArg = async (e, { value }) => {
		setNewArguments(value)
	}

	const onClickFallacy = (e, slug) => {
		onClickRedirect(e, history, `/fallacies/${slug}`)
	}

	return (
		<DefaultLayout activeItem="tweet" containerClassName="tweetPage" history={history}>
			<DisplayMetaTags page="tweet" state={internalState} />

			{loaded ? (
				<>
					{error && (
						<>
							<div className="centeredLoader">
								<Header as="h1" image textAlign="center">
									<ReactSVG className="errorSvg" src={Logo} />
									<Header.Content>This tweet does not exist</Header.Content>
								</Header>
							</div>
						</>
					)}
					{!error && (
						<>
							<Tweet
								config={{
									...tweetOptions,
									externalLink: true,
									showSaveOption: true
								}}
								counts={tweet.counts}
								createdAt={tweet.createdAt}
								entities={tweet.entities}
								extendedEntities={tweet.extendedEntities}
								fullText={tweet.fullText}
								history={history}
								id={tweet.tweetId}
								quoted={tweet.quoted}
								retweeted={tweet.retweeted}
								user={tweet.user}
								urls={tweet.urls}
							/>

							<Button
								className="assignFallacyBtn"
								color="blue"
								content="Assign a fallacy"
								icon="gavel"
								onClick={() =>
									history.push(
										`/assign?url=https://twitter.com/${tweet.user.username}/status/${tweet.tweetId}`
									)
								}
							/>

							{canEdit && (
								<Segment basic style={{ padding: "10px 0" }}>
									<Dropdown
										fluid
										multiple
										onChange={onChangeArg}
										options={argOptions}
										placeholder="Argument(s)"
										renderLabel={(item) => {
											return <Label color="blue" content={item.name} />
										}}
										search
										selection
										value={newArguments}
									/>
									<Button
										className="assignArgumentBtn"
										color="orange"
										content="Associate argument"
										fluid
										loading={btnLoading}
										onClick={async () => {
											setBtnLoading(true)
											await addArguments(tweet.id, newArguments)
											setBtnLoading(false)
										}}
									/>
								</Segment>
							)}

							<Header as="h2" content="What kind of argument is this?" />

							{showArgs ? (
								<>
									{tweet.arguments.data.map((arg, i) => (
										<Segment
											className="argPlaceholder"
											key={`argSegment${i}`}
											placeholder
										>
											<Header inverted textAlign="center" size="large">
												"{arg.argument.description}"
											</Header>
										</Segment>
									))}
								</>
							) : (
								<Segment className="argPlaceholder" placeholder>
									<Header content="Unknown" textAlign="center" size="large" />
								</Segment>
							)}

							<Menu pointing secondary size="large">
								<Menu.Item
									active={activeItem === "fallacies"}
									name="fallacies"
									onClick={handleItemClick}
								>
									Fallacies{" "}
									<span className="count">
										(
										<NumberFormat
											displayType={"text"}
											thousandSeparator
											value={tweet.fallacyCount}
										/>
										)
									</span>
								</Menu.Item>
								<Menu.Item
									active={activeItem === "contradictions"}
									name="contradictions"
									onClick={handleItemClick}
								>
									Contradictions{" "}
									<span className="count">
										(
										<NumberFormat
											displayType={"text"}
											thousandSeparator
											value={contradictions.count}
										/>
										)
									</span>
								</Menu.Item>
							</Menu>

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
										fallacies={contradictions.data}
										history={history}
										inverted={inverted}
										loading={!contradictions.loaded}
										loadingMore={loadingMore}
										onClickFallacy={onClickFallacy}
									/>
								</Visibility>
							)}

							<Divider hidden section />
						</>
					)}
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
