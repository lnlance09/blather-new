import "./style.scss"
import { useEffect } from "react"
import { Card, Divider, Grid, Header, Icon, Image, Label, Segment } from "semantic-ui-react"
import { hyphenateText } from "utils/textFunctions"
import renderer, { tweetOptions } from "options/tweet"
import Marked from "marked"
import Moment from "react-moment"
import PlaceholderPic from "images/avatar/small/joe.jpg"
import PropTypes from "prop-types"
import ReactPlayer from "react-player"
import Tweet from "components/Tweet"

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

	let dateOne = ""
	let dateTwo = ""
	let tweet = null
	let cTweet = null
	let highlightedText = ""
	let highlightedTextC = ""
	let video = null
	let cVideo = null

	if (typeof twitter !== "undefined" && twitter !== null) {
		tweet = twitter.tweet
		highlightedText = twitter.highlightedText === null ? "" : twitter.highlightedText
		highlightedText = newHighlightedText !== "" ? newHighlightedText : highlightedText
		dateOne = tweet.createdAt
	}
	if (typeof contradictionTwitter !== "undefined" && contradictionTwitter !== null) {
		cTweet = contradictionTwitter.tweet
		highlightedTextC = contradictionTwitter.highlightedText
		highlightedTextC = highlightedTextC === null ? "" : highlightedTextC
		highlightedTextC = newHighlightedTextC !== "" ? newHighlightedTextC : highlightedTextC
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
						}
					}}
					counts={tweet.counts}
					createdAt={tweet.createdAt}
					extendedEntities={twitter.extendedEntities}
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
						}
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

	const Video = () => (
		<>
			{video && (
				<>
					<ReactPlayer
						controls
						loop
						url={`https://www.youtube.com/watch?v=${video.videoId}&t=${video.startTime}`}
						width="100%"
					/>
					<Divider />
					<span
						className="blue"
						onClick={(e) => {
							e.stopPropagation()
							window
								.open(`https://www.youtube.com/watch?v=${video.videoId}`, "_blank")
								.focus()
						}}
					>
						https://www.youtube.com/watch?v={video.videoId}
					</span>
				</>
			)}
		</>
	)

	const ContradictingVideo = () => (
		<>
			{cVideo && (
				<>
					<ReactPlayer
						controls
						loop
						url={`https://www.youtube.com/watch?v=${cVideo.videoId}&t=${cVideo.startTime}`}
						width="100%"
					/>
					<Divider />
					<span
						className="blue"
						onClick={(e) => {
							e.stopPropagation()
							window
								.open(`https://www.youtube.com/watch?v=${cVideo.videoId}`, "_blank")
								.focus()
						}}
					>
						https://www.youtube.com/watch?v={cVideo.videoId}
					</span>
				</>
			)}
		</>
	)

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
							<Label as="a" color="black" ribbon size="large">
								<Icon name="clock" />
								{showDateDiff && (
									<>
										<Moment ago from={dateOne}>
											{dateTwo}
										</Moment>{" "}
										apart
									</>
								)}
							</Label>
						)}
						{showExplanation && (
							<Segment basic>
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
