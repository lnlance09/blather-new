import "./style.scss"
import { Grid, Header, Placeholder, Segment } from "semantic-ui-react"
import { tweetOptions } from "options/tweet"
import PropTypes from "prop-types"
import Tweet from "components/Tweet"

const ContradictionList = ({
	contradictions,
	defaultUserImg,
	history,
	inverted,
	loading,
	loadingMore,
	onClickContradiction
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
		<div className="contradictionList">
			<Grid>
				{contradictions.map((contradiction, i) => {
					const { contradictionTwitter, id, twitter } = contradiction
					let tweet = null
					let cTweet = null

					if (!loading) {
						if (typeof twitter !== "undefined") {
							tweet = twitter.tweet
						}
						if (
							typeof contradictionTwitter !== "undefined" &&
							contradictionTwitter !== null
						) {
							cTweet = contradictionTwitter.tweet
						}
					}

					return (
						<Grid.Row
							className={loading ? "loading" : null}
							key={`contradiction${i}`}
							onClick={(e) => onClickContradiction(e, id)}
						>
							{loading && (
								<Grid.Column width={16}>
									<Segment fluid>{PlaceholderSegment}</Segment>
								</Grid.Column>
							)}
							{!loading && (
								<>
									<Segment basic>
										<Header block content="4 days apart" textAlign="center" />
										<p>{contradiction.explanation}</p>
										<Grid>
											<Grid.Column width={8}>
												{twitter !== null && (
													<Tweet
														config={{
															...tweetOptions
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
											</Grid.Column>
											<Grid.Column width={8}>
												{contradictionTwitter !== null && (
													<Tweet
														config={{
															...tweetOptions
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
											</Grid.Column>
										</Grid>
									</Segment>
								</>
							)}
						</Grid.Row>
					)
				})}
				{loadingMore && (
					<Grid.Row className="loading" key="loadingMore">
						<Grid.Column width={16}>
							<Segment fluid>{PlaceholderSegment}</Segment>
						</Grid.Column>
					</Grid.Row>
				)}
			</Grid>
		</div>
	)
}

ContradictionList.propTypes = {
	contradictions: PropTypes.arrayOf(PropTypes.shape({})),
	defaultUserImg: PropTypes.string,
	inverted: PropTypes.bool,
	loading: PropTypes.bool,
	loadingMore: PropTypes.bool,
	onClickContradictions: PropTypes.func
}

export default ContradictionList
