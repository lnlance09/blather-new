import "./style.scss"
import { Image, Item, Label, Placeholder } from "semantic-ui-react"
import { setIconColor, setIconName } from "utils/textFunctions"
import Moment from "react-moment"
import NumberFormat from "react-number-format"
import PlaceholderPic from "images/images/image.png"
import PropTypes from "prop-types"

const FallacyList = ({ fallacies, inverted, loading, loadingMore, onClickFallacy }) => {
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
		<div className="fallacyList">
			<Item.Group className={inverted ? "inverted" : ""} divided link>
				{fallacies.map((fallacy, i) => {
					const { createdAt, explanation, id, page, reference, user } = fallacy
					return (
						<Item key={`fallacy${i}`} onClick={(e) => onClickFallacy(e, id)}>
							{loading ? (
								<>{PlaceholderSegment}</>
							) : (
								<>
									<Item.Image
										className="itemImg"
										onError={(i) => (i.target.src = PlaceholderPic)}
										size="tiny"
										src={page.image}
									/>
									<Item.Content>
										<Item.Header>
											{reference.name} #{id}
										</Item.Header>
										<Item.Meta>
											<Moment date={createdAt} fromNow /> • {user.name}
										</Item.Meta>
										<Item.Description>{explanation}</Item.Description>
										<Item.Extra></Item.Extra>
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
