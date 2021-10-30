import "./style.scss"
import { Grid, Header, Placeholder, Segment } from "semantic-ui-react"
import { onClickRedirect } from "utils/linkFunctions"
import FallacyExample from "components/FallacyExample"
import PropTypes from "prop-types"

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
				{fallacies.map((fallacy, i) => (
					<Grid.Row className={loading ? "loading" : null} key={`fallacy${i}`}>
						<Grid.Column
							className={`${!loading && fallacy.reference.id !== 21 ? "normal" : ""}`}
							width={16}
						>
							{loading ? (
								<Segment>{PlaceholderSegment}</Segment>
							) : (
								<FallacyExample
									contradictionTwitter={fallacy.contradictionTwitter}
									contradictionYouTube={fallacy.contradictionYouTube}
									createdAt={fallacy.createdAt}
									defaultUserImg={defaultUserImg}
									explanation={fallacy.explanation}
									history={history}
									id={fallacy.id}
									onClickFallacy={onClickFallacy}
									onClickTweet={(e, history, id) =>
										onClickRedirect(e, history, `/tweets/${id}`)
									}
									reference={fallacy.reference}
									slug={fallacy.slug}
									twitter={fallacy.twitter}
									youtube={fallacy.youtube}
									useCard={fallacy.reference.id !== 21}
									user={fallacy.user}
									useRibbon={fallacy.reference.id === 21}
									useSegment={fallacy.reference.id === 21}
								/>
							)}
						</Grid.Column>
					</Grid.Row>
				))}
			</Grid>
			{loadingMore && <Segment>{PlaceholderSegment}</Segment>}
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
