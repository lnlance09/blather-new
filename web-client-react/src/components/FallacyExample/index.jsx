import "./style.scss"
import { useEffect, useRef, useState } from "react"
import {
	Card,
	Divider,
	Grid,
	Header,
	Icon,
	Image,
	Label,
	Message,
	Segment
} from "semantic-ui-react"
import { hyphenateText } from "utils/textFunctions"
import renderer, { tweetOptions } from "options/tweet"
import _ from "underscore"
import Marked from "marked"
import Moment from "react-moment"
import PlaceholderPic from "images/avatar/small/joe.jpg"
import PropTypes from "prop-types"
import ReactPlayer from "react-player"
import Tweet from "components/Tweet"

const youtubeUrl = "https://www.youtube.com/watch"

const FallacyExample = ({
	colored = false,
	commentCount = 0,
	contradictionTwitter,
	contradictionYouTube,
	createdAt,
	crossOriginAnonymous = false,
	defaultUserImg = PlaceholderPic,
	explanation,
	group,
	history,
	id,
	newHighlightedText = "",
	newHighlightedTextC = "",
	onClickFallacy = () => null,
	onClickTweet = () => null,
	reference,
	showCommentCount = false,
	showExplanation = true,
	showTweetUrls = true,
	slug,
	stacked = false,
	twitter,
	useCard = false,
	user,
	useRibbon = false,
	useSegment = true,
	verticalMode = false,
	youtube
}) => {
	useEffect(() => {
		Marked.use({ renderer })
	}, [])

	const [playing, setPlaying] = useState(false)
	const [playingCont, setPlayingCont] = useState(false)
	const [videoUrlSrc, setVideoUrlSrc] = useState("")
	const [videoCUrlSrc, setVideoCUrlSrc] = useState("")

	const videoRef = useRef()
	const videoContRef = useRef()

	let dateOne = ""
	let dateTwo = ""
	let tweet = null
	let cTweet = null
	let highlightedText = ""
	let highlightedTextC = ""
	let video = null
	let cVideo = null
	let startTime = 0
	let endTime = 0
	let startTimeC = 0
	let endTimeC = 0

	if (!_.isEmpty(twitter)) {
		tweet = twitter.tweet
		highlightedText = twitter.highlightedText === null ? "" : twitter.highlightedText
		highlightedText = newHighlightedText !== "" ? newHighlightedText : highlightedText
		dateOne = tweet.createdAt
	}

	if (!_.isEmpty(contradictionTwitter)) {
		cTweet = contradictionTwitter.tweet
		highlightedTextC = contradictionTwitter.highlightedText
		highlightedTextC = highlightedTextC === null ? "" : highlightedTextC
		highlightedTextC = newHighlightedTextC !== "" ? newHighlightedTextC : highlightedTextC
		dateTwo = cTweet.createdAt
	}

	if (!_.isEmpty(youtube)) {
		video = youtube.video
		dateOne = video.dateCreated
		startTime = youtube.startTime
		endTime = youtube.endTime
	}

	if (!_.isEmpty(contradictionYouTube)) {
		cVideo = contradictionYouTube.video
		dateTwo = cVideo.dateCreated
		startTimeC = contradictionYouTube.startTime
		endTimeC = contradictionYouTube.endTime
	}

	useEffect(() => {
		if (video) {
			setVideoUrlSrc(`${youtubeUrl}?v=${video.videoId}&t=${startTime}`)
		}

		if (cVideo) {
			setVideoCUrlSrc(`${youtubeUrl}?v=${cVideo.videoId}&t=${startTimeC}`)
		}
		// eslint-disable-next-line
	}, [])

	const showDateDiff = (tweet || video) && (cTweet || cVideo)

	const _Tweet = () => (
		<div className="tweetWrapper">
			{tweet && (
				<Tweet
					config={{
						...tweetOptions,
						crossOriginAnonymous,
						defaultUserImg,
						highlightedText,
						onClickCallback: (e, history, id) => {
							e.stopPropagation()
							const isLink = e.target.classList.contains("linkify")
							if (!isLink) {
								onClickTweet(e, history, id)
							}
						},
						showTweetUrls
					}}
					counts={tweet.counts}
					createdAt={tweet.createdAt}
					extendedEntities={tweet.extendedEntities}
					fullText={tweet.fullText}
					history={history}
					id={tweet.tweetId}
					quoted={tweet.quoted}
					retweeted={tweet.retweeted}
					user={tweet.user}
					urls={tweet.urls}
				/>
			)}
		</div>
	)

	const ContradictingTweet = () => (
		<div className="tweetWrapperC">
			{cTweet && (
				<Tweet
					config={{
						...tweetOptions,
						crossOriginAnonymous,
						defaultUserImg,
						highlightedText: highlightedTextC,
						onClickCallback: (e, history, id) => {
							e.stopPropagation()
							const isLink = e.target.classList.contains("linkify")
							if (!isLink) {
								onClickTweet(e, history, id)
							}
						},
						showTweetUrls
					}}
					counts={cTweet.counts}
					createdAt={cTweet.createdAt}
					entities={cTweet.entities}
					extendedEntities={cTweet.extendedEntities}
					fullText={cTweet.fullText}
					history={history}
					id={cTweet.tweetId}
					quoted={cTweet.quoted}
					retweeted={cTweet.retweeted}
					user={cTweet.user}
					urls={cTweet.urls}
				/>
			)}
		</div>
	)

	const Video = () => {
		if (_.isEmpty(video)) {
			return
		}

		return (
			<>
				<ReactPlayer
					controls={true}
					light={false}
					onProgress={(e) => {
						if (!playing) {
							return
						}

						const secs = e.playedSeconds
						if (secs < startTime) {
							setPlaying(false)
							videoRef.current.seekTo(startTime)
							setPlaying(true)
						}

						if (secs > endTime) {
							setPlaying(false)
							videoRef.current.seekTo(startTime)
							setPlayingCont(true)
						}
					}}
					onStart={() => {
						setPlaying(true)
						setPlayingCont(false)
					}}
					playing={playing}
					ref={videoRef}
					url={videoUrlSrc}
					width="100%"
				/>
				{video.s3Link && (
					<>
						<Divider />
						<Message warning>
							<Message.Content>
								📹 This video has been archived. View archived{" "}
								<span
									class="blue"
									onClick={() => {
										setVideoUrlSrc(video.s3Link)
									}}
								>
									version
								</span>
								.
							</Message.Content>
						</Message>
					</>
				)}
			</>
		)
	}

	const ContradictingVideo = () => {
		if (_.isEmpty(cVideo)) {
			return
		}

		return (
			<>
				<ReactPlayer
					controls={true}
					light={false}
					onProgress={(e) => {
						if (!playingCont) {
							return
						}

						const secs = e.playedSeconds
						if (secs < startTimeC) {
							setPlayingCont(false)
							videoContRef.current.seekTo(startTimeC)
							setPlayingCont(true)
						}

						if (secs > endTimeC) {
							setPlayingCont(false)
							videoContRef.current.seekTo(startTimeC)
							setPlaying(true)
						}
					}}
					onStart={() => {
						setPlaying(false)
						setPlayingCont(true)
					}}
					playing={playingCont}
					ref={videoContRef}
					url={videoCUrlSrc}
					width="100%"
				/>
				{cVideo.s3Link && (
					<>
						<Divider />
						<Message warning>
							<Message.Content>
								📹 This video has been archived. View archived{" "}
								<span
									class="blue"
									onClick={() => {
										setVideoCUrlSrc(cVideo.s3Link)
									}}
								>
									version
								</span>
								.
							</Message.Content>
						</Message>
					</>
				)}
			</>
		)
	}

	return (
		<div className={`fallacyExample ${colored ? "colored" : ""}`}>
			{useSegment && (
				<>
					<Segment
						attached={showCommentCount}
						className={group ? "withGroup" : ""}
						// raised
						stacked={stacked}
						onClick={(e) => {
							e.stopPropagation()
							onClickFallacy(e, slug)
						}}
					>
						{group && reference.id === 21 && (
							<Label
								attached="top"
								className={hyphenateText(group.name)}
								size="large"
							>
								{group.name}
							</Label>
						)}
						{useRibbon && (
							<>
								<Header className="ribbonHeader">
									<Image
										circular
										className="itemImg"
										floated="left"
										onError={(i) => (i.target.src = PlaceholderPic)}
										src={user.image}
										style={{ marginRight: 0, width: "35px", height: "35px" }}
									/>
									<Header.Content>
										{reference.name} #{id}
										<Header.Subheader>
											<Moment date={createdAt} fromNow /> • {user.name}
										</Header.Subheader>
									</Header.Content>
								</Header>
								<Label color="black" ribbon="right" size="large">
									<Icon name="clock outline" />
									{showDateDiff && (
										<>
											<Moment ago from={dateOne}>
												{dateTwo}
											</Moment>{" "}
											apart
										</>
									)}
								</Label>
							</>
						)}
						{showExplanation && (
							<Segment basic className="expSegment">
								<div
									className="explanation"
									dangerouslySetInnerHTML={{
										__html: Marked(explanation)
									}}
								/>
							</Segment>
						)}
						{verticalMode ? (
							<>
								{_Tweet()}
								{Video()}
								{showDateDiff && (
									<Divider className="fallacyDateDiff" hidden horizontal>
										<Icon name="clock outline" style={{ marginRight: "5px" }} />{" "}
										<Moment ago from={dateOne}>
											{dateTwo}
										</Moment>{" "}
										<div style={{ marginLeft: 3 }}>apart</div>
									</Divider>
								)}
								{ContradictingTweet()}
								{ContradictingVideo()}
							</>
						) : (
							<Grid stackable>
								<Grid.Column width={8}>
									{_Tweet()}
									{Video()}
								</Grid.Column>
								<Grid.Column width={8}>
									{ContradictingTweet()}
									{ContradictingVideo()}
								</Grid.Column>
							</Grid>
						)}
					</Segment>
					{showCommentCount && (
						<Header attached="bottom" block size="tiny">
							<Icon className="commentIcon" color="blue" name="comment" />{" "}
							{commentCount}
						</Header>
					)}
				</>
			)}

			{useCard && (
				<Card
					className="fallacyCard"
					fluid
					onClick={(e) => {
						e.stopPropagation()
						onClickFallacy(e, slug)
					}}
				>
					<Card.Content>
						<Image
							circular
							className="itemImg"
							floated="left"
							onError={(i) => (i.target.src = PlaceholderPic)}
							size="mini"
							src={user.image}
						/>
						<Card.Header>
							{reference.name} #{id}
						</Card.Header>
						<Card.Meta>
							<Moment date={createdAt} fromNow /> • {user.name}
						</Card.Meta>
						<Card.Description
							className="explanation"
							dangerouslySetInnerHTML={{
								__html: Marked(explanation)
							}}
						/>
						<Divider hidden />
						<Card.Description>
							{_Tweet()}
							{Video()}
						</Card.Description>
					</Card.Content>
					{showCommentCount && (
						<Card.Content extra style={{ color: "black", paddingLeft: "25px" }}>
							<Icon color="blue" name="comment" /> {commentCount}
						</Card.Content>
					)}
				</Card>
			)}
		</div>
	)
}

FallacyExample.propTypes = {
	commentCount: PropTypes.number,
	contradictionTwitter: PropTypes.shape({}),
	contradictionYouTube: PropTypes.shape({}),
	createdAt: PropTypes.string,
	crossOriginAnonymous: PropTypes.bool,
	defaultUserImg: PropTypes.string,
	explanation: PropTypes.string,
	group: PropTypes.shape({}),
	history: PropTypes.shape({}),
	id: PropTypes.number,
	newHighlightedText: PropTypes.string,
	onClickFallacy: PropTypes.func,
	reference: PropTypes.shape({}),
	showCommentCount: PropTypes.bool,
	showExplanation: PropTypes.bool,
	showTweetUrls: PropTypes.bool,
	slug: PropTypes.string,
	stacked: PropTypes.bool,
	twitter: PropTypes.shape({}),
	useCard: PropTypes.bool,
	user: PropTypes.shape({}),
	useRibbon: PropTypes.bool,
	useSegment: PropTypes.bool,
	verticalMode: PropTypes.bool,
	youtube: PropTypes.shape({})
}

export default FallacyExample
