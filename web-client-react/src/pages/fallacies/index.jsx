import { Button, Card, Divider, Header, Icon, Image, Loader, Segment } from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { Link } from "react-router-dom"
import { onClickRedirect } from "utils/linkFunctions"
import { DisplayMetaTags } from "utils/metaFunctions"
import { tweetOptions } from "options/tweet"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import defaultImg from "images/images/image-square.png"
import DefaultLayout from "layouts/default"
import FallacyList from "components/FallacyList"
import initialState from "states/fallacy"
import logger from "use-reducer-logger"
import Moment from "react-moment"
import PropTypes from "prop-types"
import reducer from "reducers/fallacy"
import ThemeContext from "themeContext"
import Tweet from "components/Tweet"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Fallacy = ({ history, match }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state
	const { slug } = match.params

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { fallacy, loaded } = internalState
	const {
		contradictionTwitter,
		contradictionYouTube,
		createdAt,
		page,
		reference,
		retracted,
		twitter,
		user,
		youtube
	} = fallacy

	let dateOne = ""
	let dateTwo = ""
	let tweet = null
	let cTweet = null
	let highlightedText = ""
	let highlightedTextC = ""
	let video = null
	let cVideo = null

	if (loaded) {
		if (typeof twitter !== "undefined" && twitter !== null) {
			tweet = twitter.tweet
			highlightedText = twitter.highlightedText === null ? "" : twitter.highlightedText
			dateOne = tweet.createdAt
		}
		if (typeof contradictionTwitter !== "undefined" && contradictionTwitter !== null) {
			cTweet = contradictionTwitter.tweet
			highlightedTextC = contradictionTwitter.highlightedText
			highlightedTextC = highlightedTextC === null ? "" : highlightedTextC
			dateTwo = cTweet.createdAt
		}
		if (typeof youtube !== "undefined" && youtube !== null) {
			video = youtube.video
			dateOne = video.createdAt
		}
		if (typeof contradictionYouTube !== "undefined" && contradictionYouTube !== null) {
			cVideo = contradictionYouTube.video
			dateTwo = cVideo.createdAt
		}
	}

	const showDateDiff = (tweet || video) && (cTweet || cVideo)
	const canRetract = false

	const [hasMore, setHasMore] = useState(false)
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [pageNumber, setPageNumber] = useState(1)

	useEffect(() => {
		const getFallacy = async (slug) => {
			await axios
				.get(`${process.env.REACT_APP_BASE_URL}fallacies/${slug}`)
				.then(async (response) => {
					const fallacy = response.data.data
					dispatch({
						type: "GET_FALLACY",
						fallacy
					})
				})
				.catch(() => {
					toast.error("There was an error")
				})
		}

		getFallacy(slug)
	}, [slug])

	const getRelatedFallacies = async (fallacyId, page = 1) => {
		page === 1 ? setLoading(true) : setLoadingMore(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}fallacies/related`, {
				params: {
					fallacyId,
					page
				}
			})
			.then((response) => {
				const { data, meta } = response.data
				dispatch({
					type: "GET_FALLACIES",
					fallacies: data,
					page
				})
				setPageNumber(page + 1)
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

	const retractLogic = (e, { value }) => {}

	return (
		<DefaultLayout
			activeItem="fallacies"
			containerClassName="fallacyPage"
			history={history}
			inverted={inverted}
		>
			<DisplayMetaTags page="fallacy" state={internalState} />
			{loaded ? (
				<>
					<Header as="h1">
						{reference.name} #{fallacy.id}
						<Header.Subheader>Assigned to {page.name}</Header.Subheader>
					</Header>
					{tweet && (
						<Tweet
							config={{
								...tweetOptions,
								highlightedText,
								onClickCallback: (e, history, id) => {
									e.stopPropagation()
									const isLink = e.target.classList.contains("linkify")
									if (!isLink) {
										onClickRedirect(e, history, `/tweets/${id}`)
									}
								}
							}}
							counts={tweet.counts}
							createdAt={tweet.createdAt}
							// defaultUserImg={defaultUserImg}
							extendedEntities={twitter.extendedEntities}
							fullText={tweet.fullText}
							history={history}
							id={tweet.tweetId}
							quoted={tweet.quoted}
							retweeted={tweet.retweeted}
							user={tweet.user}
						/>
					)}
					{showDateDiff && (
						<Divider hidden horizontal id="fallacyDateDiff" inverted={inverted}>
							<Icon name="clock outline" style={{ marginRight: "5px" }} />{" "}
							<Moment ago from={dateOne}>
								{dateTwo}
							</Moment>{" "}
							<div style={{ marginLeft: 3 }}>apart</div>
						</Divider>
					)}
					{cTweet && (
						<Tweet
							config={{
								...tweetOptions,
								highlightedText: highlightedTextC
							}}
							counts={cTweet.counts}
							createdAt={cTweet.createdAt}
							// defaultUserImg={defaultUserImg}
							entities={cTweet.entities}
							extendedEntities={cTweet.extendedEntities}
							fullText={cTweet.fullText}
							history={history}
							id={cTweet.tweetId}
							quoted={cTweet.quoted}
							retweeted={cTweet.retweeted}
							user={cTweet.user}
						/>
					)}

					<Divider />

					<Segment basic className="explanationSegment">
						<Header>
							<Image
								circular
								onError={(i) => (i.target.src = defaultImg)}
								src={user.image}
							/>
							<Header.Content>
								{user.name}
								<Header.Subheader>
									<Moment date={fallacy.createdAt} fromNow />
								</Header.Subheader>
							</Header.Content>
						</Header>
						<p>{fallacy.explanation}</p>
					</Segment>

					<Divider />

					<Segment secondary>
						<Header as="h3">{reference.name}</Header>
						<p>{reference.description}</p>
					</Segment>

					{/*
					<FallacyList
						fallacies={internalState.fallacies}
						loading={loading}
						loadingMore={loadingMore}
						onClickFallacy={onClickFallacy}
					/>
					*/}

					<Divider />

					<Card className="retractionCard" fluid>
						<Card.Content>
							<Image
								bordered
								circular
								floated="right"
								onClick={() => history.push(`/${user.username}`)}
								onError={(i) => (i.target.src = defaultImg)}
								size="mini"
								src={page.image}
							/>
							<Card.Header>
								{retracted ? "Retracted" : "Still waiting for a retraction..."}
							</Card.Header>
							<Card.Meta>
								{retracted ? (
									`Nice work, ${user.name}`
								) : (
									<>
										Waiting for{" "}
										<Moment ago date={createdAt} fromNow interval={60000} />
										...
									</>
								)}
							</Card.Meta>
							<Card.Description>
								{retracted ? (
									<>
										<Link to={`/pages/${page.username}`}>{page.name}</Link> has
										admitted that this is poor reasoning.
									</>
								) : (
									<p>
										{canRetract ? (
											`${page.name}, this is an opportunity to show your
												followers that you have enough courage to admit that
												you were wrong.`
										) : (
											<>
												<Link to={`/${user.username}`}>{page.name}</Link>,
												you can retract this by{" "}
												<Link to="/signin">signing in</Link>.
											</>
										)}
									</p>
								)}
							</Card.Description>
						</Card.Content>
						<Card.Content extra>
							{retracted ? (
								<Button active color="green" fluid size="large">
									<Icon name="checkmark" />
									Retracted
								</Button>
							) : (
								<Button
									content="Retract"
									disabled={!canRetract}
									fluid
									negative
									onClick={retractLogic}
								/>
							)}
						</Card.Content>
					</Card>

					<Divider />
				</>
			) : (
				<div className="centeredLoader">
					<Loader active inverted={inverted} size="big" />
				</div>
			)}
		</DefaultLayout>
	)
}

Fallacy.propTypes = {
	history: PropTypes.object,
	match: PropTypes.object
}

export default Fallacy
