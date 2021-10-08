import "./style.scss"
import { Card, Image, Placeholder } from "semantic-ui-react"
import { formatPlural } from "utils/textFunctions"
import NumberFormat from "react-number-format"
import PlaceholderPic from "images/images/image-square.png"
import PropTypes from "prop-types"

const PageList = ({ history, inverted, loading, loadingMore, onClickPage, pages }) => {
	return (
		<div className="pageList">
			<Card.Group className={inverted ? "inverted" : ""} itemsPerRow={3} stackable>
				{pages.map((page, i) => {
					const { bio, image, fallaciesCount, name, network, username } = page
					return (
						<Card key={`page${i}`} onClick={(e) => onClickPage(e, network, username)}>
							{loading ? (
								<Card.Content>
									<Placeholder fluid inverted={inverted}>
										<Placeholder.Paragraph>
											<Placeholder.Line length="full" />
											<Placeholder.Line length="long" />
											<Placeholder.Line length="short" />
										</Placeholder.Paragraph>
									</Placeholder>
								</Card.Content>
							) : (
								<>
									<Card.Content>
										<Image
											circular
											floated="right"
											onError={(i) => (i.target.src = PlaceholderPic)}
											size="mini"
											src={image}
										/>
										<Card.Header>{name}</Card.Header>
										<Card.Meta>@{username}</Card.Meta>
										<Card.Meta>
											<NumberFormat
												displayType={"text"}
												thousandSeparator
												value={fallaciesCount}
											/>
										</Card.Meta>
										<Card.Description>{bio}</Card.Description>
									</Card.Content>
									{fallaciesCount > 0 && (
										<>
											<Card.Content extra>
												{fallaciesCount}{" "}
												{formatPlural(fallaciesCount, "fallacy")}
												<NumberFormat
													displayType={"text"}
													thousandSeparator
													value={fallaciesCount}
												/>
											</Card.Content>
										</>
									)}
								</>
							)}
						</Card>
					)
				})}
			</Card.Group>
		</div>
	)
}

PageList.propTypes = {
	inverted: PropTypes.bool,
	loading: PropTypes.bool,
	loadingMore: PropTypes.bool,
	onClickPage: PropTypes.func,
	pages: PropTypes.arrayOf(PropTypes.shape({}))
}

export default PageList
