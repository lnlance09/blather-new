import "./style.scss"
import { Image, Item, Label, Placeholder } from "semantic-ui-react"
import { setIconColor, setIconName } from "utils/textFunctions"
import Moment from "react-moment"
import NumberFormat from "react-number-format"
import PlaceholderPic from "images/images/image.png"
import PropTypes from "prop-types"

const FallacyList = ({ inverted, loading, loadingMore, onClickFallacy, predictions }) => {
	const PlaceholderSegment = (
		<>
			<Placeholder className="placeholderPicWrapper" inverted={inverted}>
				<Placeholder.Image />
			</Placeholder>
			<Item.Content>
				<Placeholder inverted={inverted} fluid>
					<Placeholder.Paragraph>
						<Placeholder.Line />
						<Placeholder.Line />
						<Placeholder.Line />
					</Placeholder.Paragraph>
				</Placeholder>
			</Item.Content>
		</>
	)

	return (
		<div className="predictionList">
			<Item.Group className={inverted ? "inverted" : ""} divided link>
				{predictions.map((prediction, i) => {
					const {
						coin,
						createdAt,
						explanation,
						id,
						margin,
						predictionPrice,
						status,
						targetDate
					} = prediction
					return (
						<Item key={`prediction${i}`} onClick={(e) => onClickFallacy(e, id)}>
							{loading ? (
								<>{PlaceholderSegment}</>
							) : (
								<>
									<Item.Image
										className="itemImg"
										onError={(i) => (i.target.src = PlaceholderPic)}
										size="tiny"
										src={coin.logo}
									/>
									<Item.Content>
										<Item.Header>
											{coin.name} to{" "}
											<NumberFormat
												decimalScale={predictionPrice > 1 ? 2 : 6}
												displayType={"text"}
												prefix={"$"}
												thousandSeparator
												value={predictionPrice}
											/>
											<Image
												avatar
												floated="right"
												src={coin.logo}
												style={{ bottom: 8 }}
											/>
										</Item.Header>
										<Item.Meta>
											On <Moment date={targetDate} format="MMM D, YYYY" />•{" "}
											Predicted <Moment date={createdAt} fromNow />
										</Item.Meta>
										{status !== "Pending" && (
											<Item.Meta>{margin}% margin</Item.Meta>
										)}
										<Item.Description>{explanation}</Item.Description>
										<Item.Extra>
											<Label
												className={inverted ? "inverted" : ""}
												color={setIconColor(status)}
												content={status}
												icon={setIconName(status)}
												size="tiny"
											/>
										</Item.Extra>
									</Item.Content>
								</>
							)}
						</Item>
					)
				})}
				{loadingMore && <Item key="loadingMore">{PlaceholderSegment}</Item>}
			</Item.Group>
		</div>
	)
}

FallacyList.propTypes = {
	fallacies: PropTypes.arrayOf(PropTypes.shape({})),
	inverted: PropTypes.bool,
	loading: PropTypes.bool,
	loadingMore: PropTypes.bool,
	onClickFallacy: PropTypes.func
}

export default FallacyList
