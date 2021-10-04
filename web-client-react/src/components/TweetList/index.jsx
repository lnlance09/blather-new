import "./style.scss"
import { Divider, Placeholder, Segment } from "semantic-ui-react"
import { tweetOptions } from "options/tweet"
import PlaceholderPic from "images/images/image.png"
import PropTypes from "prop-types"
import Tweet from "components/Tweet"

const TweetList = ({
	defaultUserImg,
	history,
	inverted,
	loading,
	loadingMore,
	onClickTweet,
	tweets
}) => {
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
			{tweets.map((tweet, i) => {
				const { id } = tweet
				return (
					<div
						className={loading ? "loading" : null}
						key={`tweet${i}`}
						onClick={(e) => onClickTweet(e, id)}
					>
						{loading && <Segment fluid>{PlaceholderSegment}</Segment>}
						{!loading && (
							<>
								<Tweet
									config={{
										...tweetOptions
									}}
									counts={tweet.counts}
									createdAt={tweet.createdAt}
									defaultUserImg={defaultUserImg}
									entities={tweet.entities}
									extendedEntities={JSON.parse(tweet.extendedEntities)}
									fullText={tweet.fullText}
									history={history}
									id={tweet.tweetId}
									quoted={tweet.quoted}
									retweeted={tweet.retweeted}
									user={tweet.user}
								/>
							</>
						)}
						<Divider hidden />
					</div>
				)
			})}
			{loadingMore && (
				<div className="loading" key="loadingMore">
					<Segment fluid>{PlaceholderSegment}</Segment>
				</div>
			)}
		</div>
	)
}

TweetList.propTypes = {
	defaultUserImg: PropTypes.string,
	inverted: PropTypes.bool,
	loading: PropTypes.bool,
	loadingMore: PropTypes.bool,
	onClickTweet: PropTypes.func,
	tweets: PropTypes.arrayOf(PropTypes.shape({}))
}

export default TweetList
