import "./style.scss"
import linkifyHtml from "linkify-html"
import "linkify-plugin-hashtag"
import "linkify-plugin-mention"
import { Card, Header, Icon, Image, Placeholder, Segment } from "semantic-ui-react"
import { formatPlural } from "utils/textFunctions"
import NumberFormat from "react-number-format"
import PlaceholderPic from "images/images/image-square.png"
import PropTypes from "prop-types"

const PageList = ({
	emptyMsg = "No results...",
	history,
	inverted,
	loading,
	loadingMore,
	onClickPage,
	pages
}) => {
	const showEmptyMsg = pages.length === 0 && !loading

	const PlaceholderContent = (
		<Card.Content>
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
		</Card.Content>
	)

	return (
		<div className="pageList">
			<Card.Group className={inverted ? "inverted" : ""} itemsPerRow={3} stackable>
				{pages.map((page, i) => {
					const { bio, image, name, network, socialMediaId, username } = page
					const twitterBio = bio
						? linkifyHtml(bio, {
								className: "linkify",
								formatHref: {
									mention: (val) =>
										`${process.env.REACT_APP_URL}pages/twitter/${val}`,
									hashtag: (val) => val
								}
						  })
						: null
					const slug = username === "" ? socialMediaId : username

					return (
						<Card key={`page${i}`} onClick={(e) => onClickPage(e, network, slug)}>
							{loading ? (
								<>{PlaceholderContent}</>
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
										{username !== "" && <Card.Meta>@{username}</Card.Meta>}
										<Card.Description
											dangerouslySetInnerHTML={{
												__html: network === "twitter" ? twitterBio : bio
											}}
										/>
									</Card.Content>
									{page.fallacyCount > 0 && (
										<Card.Content extra>
											Assigned{" "}
											<NumberFormat
												displayType={"text"}
												thousandSeparator
												value={page.fallacyCount}
											/>{" "}
											{formatPlural(page.fallacyCount, "fallacy")}
										</Card.Content>
									)}
									{page.contradictionCount > 0 && (
										<Card.Content extra>
											Assigned{" "}
											<NumberFormat
												displayType={"text"}
												thousandSeparator
												value={page.contradictionCount}
											/>{" "}
											{formatPlural(page.contradictionCount, "contradiction")}
										</Card.Content>
									)}
								</>
							)}
						</Card>
					)
				})}
				{loadingMore && (
					<>
						<Card>{PlaceholderContent}</Card>
						<Card>{PlaceholderContent}</Card>
						<Card>{PlaceholderContent}</Card>
					</>
				)}
			</Card.Group>

			{showEmptyMsg && (
				<Segment placeholder>
					<Header icon>
						<Icon className="twitterIcon" name="twitter" />
						{emptyMsg}
					</Header>
				</Segment>
			)}
		</div>
	)
}

PageList.propTypes = {
	emptyMsg: PropTypes.string,
	inverted: PropTypes.bool,
	loading: PropTypes.bool,
	loadingMore: PropTypes.bool,
	onClickPage: PropTypes.func,
	pages: PropTypes.arrayOf(PropTypes.shape({}))
}

export default PageList
