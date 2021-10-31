import "./style.scss"
import { Card, Image, Placeholder } from "semantic-ui-react"
import PlaceholderPic from "images/avatar/large/steve.jpg"
import PropTypes from "prop-types"

const UserList = ({ inverted, loading, loadingMore, onClickUser, users }) => {
	const PlaceholderSegment = (
		<Card.Content>
			<Placeholder className="placeholderParagraphWrapper" inverted={inverted} fluid>
				<Placeholder.Paragraph>
					<Placeholder.Line />
					<Placeholder.Line />
					<Placeholder.Line />
				</Placeholder.Paragraph>
			</Placeholder>
		</Card.Content>
	)

	return (
		<div className="userList">
			<Card.Group className={inverted ? "inverted" : ""} itemsPerRow={3} stackable>
				{users.map((user, i) => {
					const { bio, image, name, username } = user
					return (
						<Card key={`trader${i}`} onClick={(e) => onClickUser(e, username)}>
							{loading ? (
								<>{PlaceholderSegment}</>
							) : (
								<>
									<Card.Content>
										<Image
											avatar
											floated="right"
											onError={(i) => (i.target.src = PlaceholderPic)}
											src={image}
										/>
										<Card.Header>{name}</Card.Header>
										<Card.Meta>@{username}</Card.Meta>
										<Card.Description>{bio}</Card.Description>
									</Card.Content>
									<Card.Content extra></Card.Content>
									<Card.Content extra></Card.Content>
								</>
							)}
						</Card>
					)
				})}
				{loadingMore && (
					<>
						<Card>{PlaceholderSegment}</Card>
						<Card>{PlaceholderSegment}</Card>
						<Card>{PlaceholderSegment}</Card>
					</>
				)}
			</Card.Group>
		</div>
	)
}

UserList.propTypes = {
	inverted: PropTypes.bool,
	loading: PropTypes.bool,
	loadingMore: PropTypes.bool,
	onClickTrader: PropTypes.func,
	users: PropTypes.arrayOf(PropTypes.shape({}))
}

export default UserList
