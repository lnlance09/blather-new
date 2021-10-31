import "./style.scss"
import { Header, Icon, Placeholder, Segment } from "semantic-ui-react"
import { tweetOptions } from "options/tweet"
import { onClickRedirect } from "utils/linkFunctions"
import PropTypes from "prop-types"
import Tweet from "components/Tweet"

const TweetList = ({
	defaultUserImg,
	emptyMsg = "No tweets...",
	highlightedText = "",
	history,
	inverted,
	loading,
	loadingMore,
	onClickTweet = null,
	showSaveOption = false,
	tweets
}) => {
	const showEmptyMsg = tweets.length === 0 && !loading
	const PlaceholderSegment = (
		<Placeholder inverted={inverted} fluid>
			<Placeholder.Paragraph>
				<Placeholder.Line />
				<Placeholder.Line />
				<Placeholder.Line />
			</Placeholder.Paragraph>
		</Placeholder>
	)

	return (
		<div className="tweetList">
			{tweets.map((_tweet, i) => {
				let tweet = _tweet
				// NOTE: To account for how tweets are passed in on the argument page
				if (typeof _tweet.tweet !== "undefined") {
					tweet = _tweet.tweet
				}

				const { extendedEntities, id } = tweet
				return (
					<div className={`tweetWrapper ${loading ? "loading" : ""}`} key={`tweet${i}`}>
						{loading && <Segment>{PlaceholderSegment}</Segment>}
						{!loading && (
							<Tweet
								config={{
									...tweetOptions,
									highlightedText,
									onClickCallback: (e, history, id) => {
										e.stopPropagation()
										if (onClickTweet) {
											onClickTweet(e, id)
											return
										}

										const isLink = e.target.classList.contains("linkify")
										if (!isLink) {
											onClickRedirect(e, history, `/tweets/${id}`)
										}
									},
									showSaveOption
								}}
								counts={tweet.counts}
								createdAt={tweet.createdAt}
								defaultUserImg={defaultUserImg}
								extendedEntities={extendedEntities}
								fullText={tweet.fullText}
								history={history}
								id={tweet.tweetId}
								quoted={tweet.quoted}
								retweeted={tweet.retweeted}
								user={tweet.user}
							/>
						)}
					</div>
				)
			})}
			{loadingMore && (
				<div className="loading" key="loadingMore">
					<Segment>{PlaceholderSegment}</Segment>
				</div>
			)}
			{showEmptyMsg && (
				<Segment placeholder>
					<Header icon>
						<Icon className="twitter" name="twitter" />
						{emptyMsg}
					</Header>
				</Segment>
			)}
		</div>
	)
}

TweetList.propTypes = {
	defaultUserImg: PropTypes.string,
	emptyMsg: PropTypes.string,
	highlightedText: PropTypes.string,
	inverted: PropTypes.bool,
	loading: PropTypes.bool,
	loadingMore: PropTypes.bool,
	onClickTweet: PropTypes.func,
	showSaveOption: PropTypes.bool,
	tweets: PropTypes.arrayOf(PropTypes.shape({}))
}

export default TweetList
