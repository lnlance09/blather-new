import "./style.scss"
import {
	Card,
	Divider,
	Grid,
	Header,
	Icon,
	Image,
	Label,
	Placeholder,
	Segment
} from "semantic-ui-react"
import { tweetOptions } from "options/tweet"
import Marked from "marked"
import Moment from "react-moment"
import PlaceholderPic from "images/images/image-square.png"
import PropTypes from "prop-types"
import ReactPlayer from "react-player"
import Tweet from "components/Tweet"

const FallacyList = ({
	defaultUserImg,
	emptyMsg = "No fallacies yet...",
	fallacies,
	history,
	inverted,
	loading,
	loadingMore,
	onClickFallacy
}) => {
	const showEmptyMsg = fallacies.length === 0 && !loading
	const showContent = fallacies.length > 0 && !loading

	const PlaceholderSegment = (
		<Placeholder fluid inverted={inverted}>
			<Placeholder.Header image>
				<Placeholder.Line />
				<Placeholder.Line />
			</Placeholder.Header>
			<Placeholder.Paragraph>
				<Placeholder.Line length="full" />
				<Placeholder.Line length="long" />
				<Placeholder.Line length="short" />
			</Placeholder.Paragraph>
		</Placeholder>
	)

	return (
		<div className="fallacyList">
			<Grid>
				{fallacies.map((fallacy, i) => {
					const {
						createdAt,
						contradictionTwitter,
						contradictionYouTube,
						explanation,
						id,
						page,
						reference,
						twitter,
						youtube,
						user
					} = fallacy

					let dateOne = ""
					let dateTwo = ""
					let tweet = null
					let cTweet = null
					let highlightedText = ""
					let highlightedTextC = ""
					let video = null
					let cVideo = null

					if (!loading) {
						if (typeof twitter !== "undefined" && twitter !== null) {
							tweet = twitter.tweet
							highlightedText =
								twitter.highlightedText === null ? "" : twitter.highlightedText
							dateOne = tweet.createdAt
						}
						if (
							typeof contradictionTwitter !== "undefined" &&
							contradictionTwitter !== null
						) {
							cTweet = contradictionTwitter.tweet
							highlightedTextC = contradictionTwitter.highlightedText
							highlightedTextC = highlightedTextC === null ? "" : highlightedTextC
							dateTwo = cTweet.createdAt
						}
						if (typeof youtube !== "undefined" && youtube !== null) {
							video = youtube.video
							dateOne = video.createdAt
						}
						if (
							typeof contradictionYouTube !== "undefined" &&
							contradictionYouTube !== null
						) {
							cVideo = contradictionTwitter.tweet
							dateTwo = cVideo.createdAt
						}
					}

					const showDateDiff = (tweet || video) && (cTweet || cVideo)

					return (
						<Grid.Row
							className={loading ? "loading" : null}
							key={`contradiction${i}`}
							onClick={(e) => onClickFallacy(e, id)}
						>
							{loading && (
								<Grid.Column width={16}>
									<Segment fluid>{PlaceholderSegment}</Segment>
								</Grid.Column>
							)}
							{!loading && reference.id === 21 ? (
								<Segment fluid raised>
									<Label as="a" color="blue" ribbon>
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
									<Segment basic>
										<p
											dangerouslySetInnerHTML={{
												__html: Marked(explanation)
											}}
										/>
									</Segment>
									<Grid>
										<Grid.Column width={8}>
											{tweet !== null && (
												<Tweet
													config={{
														...tweetOptions,
														highlightedText,
														showStats: false
													}}
													counts={tweet.counts}
													createdAt={tweet.createdAt}
													defaultUserImg={defaultUserImg}
													entities={tweet.entities}
													extendedEntities={JSON.parse(
														tweet.extendedEntities
													)}
													fullText={tweet.fullText}
													history={history}
													id={tweet.tweetId}
													quoted={tweet.quoted}
													retweeted={tweet.retweeted}
													user={tweet.user}
												/>
											)}
											{video !== null && (
												<ReactPlayer
													controls
													loop
													url={`https://www.youtube.com/watch?v=${video.videoId}&t=${video.startTime}`}
													width="100%"
												/>
											)}
										</Grid.Column>
										<Grid.Column width={8}>
											{cTweet !== null && (
												<Tweet
													config={{
														...tweetOptions,
														highlightedText: highlightedTextC,
														showStats: false
													}}
													counts={cTweet.counts}
													createdAt={cTweet.createdAt}
													defaultUserImg={defaultUserImg}
													entities={cTweet.entities}
													extendedEntities={JSON.parse(
														cTweet.extendedEntities
													)}
													fullText={cTweet.fullText}
													history={history}
													id={cTweet.tweetId}
													quoted={cTweet.quoted}
													retweeted={cTweet.retweeted}
													user={cTweet.user}
												/>
											)}
											{cVideo !== null && (
												<ReactPlayer
													controls
													loop
													url={`https://www.youtube.com/watch?v=${cVideo.videoId}&t=${cVideo.startTime}`}
													width="100%"
												/>
											)}
										</Grid.Column>
									</Grid>
								</Segment>
							) : null}

							{!loading && reference.id !== 21 ? (
								<Card fluid>
									<Card.Content>
										<Image
											circular
											className="itemImg"
											floated="left"
											onError={(i) => (i.target.src = PlaceholderPic)}
											size="mini"
											src={user.image}
										/>
										<Card.Header onClick={(e) => onClickFallacy(e, id)}>
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
										<Divider />
										<Card.Description>
											{twitter !== null && (
												<Tweet
													config={{
														...tweetOptions,
														showStats: false
													}}
													counts={tweet.counts}
													createdAt={tweet.createdAt}
													defaultUserImg={defaultUserImg}
													entities={tweet.entities}
													extendedEntities={JSON.parse(
														tweet.extendedEntities
													)}
													fullText={tweet.fullText}
													history={history}
													id={tweet.tweetId}
													quoted={tweet.quoted}
													retweeted={tweet.retweeted}
													user={tweet.user}
												/>
											)}
										</Card.Description>
									</Card.Content>
								</Card>
							) : null}
						</Grid.Row>
					)
				})}
			</Grid>
			{loadingMore && (
				<>
					<Segment fluid>{PlaceholderSegment}</Segment>
				</>
			)}
			{showEmptyMsg && (
				<Segment placeholder>
					<Header icon>{emptyMsg}</Header>
				</Segment>
			)}
		</div>
	)
}

FallacyList.propTypes = {
	defaultUserImg: PropTypes.string,
	emptyMsg: PropTypes.string,
	fallacies: PropTypes.arrayOf(PropTypes.shape({})),
	inverted: PropTypes.bool,
	loading: PropTypes.bool,
	loadingMore: PropTypes.bool,
	onClickFallacy: PropTypes.func
}

export default FallacyList
