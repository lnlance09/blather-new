import "./style.scss"
import linkifyHtml from "linkify-html"
import "linkify-plugin-hashtag"
import "linkify-plugin-mention"
import { Card, Icon, Image, Label, List, Popup } from "semantic-ui-react"
import { getHighlightedText } from "utils/textFunctions"
import { tweetOptions } from "options/tweet"
import _ from "underscore"
import ItemPic from "images/images/square-image.png"
import Moment from "react-moment"
import NumberFormat from "react-number-format"
import PlaceholderPic from "images/images/image-square.png"
import PropTypes from "prop-types"

const Tweet = ({
	config = tweetOptions,
	counts = {},
	createdAt,
	defaultUserImg = PlaceholderPic,
	extendedEntities = {
		media: []
	},
	fullText,
	history,
	id,
	quoted = {
		counts: {},
		isQuoted: false
	},
	retweeted = {
		counts: {},
		isRetweeted: false
	},
	user
}) => {
	const {
		assignable,
		crossOriginAnonymous,
		externalLink,
		handleHoverOn,
		// highlight,
		highlightedText,
		imageSize,
		onClickCallback,
		opacity,
		raised,
		showStats
	} = config
	const { isRetweeted } = retweeted
	const rUser = isRetweeted ? retweeted.user : {}

	const { isQuoted } = quoted
	const qUser = isQuoted ? quoted.user : {}

	const headerCreatedAt = isRetweeted ? retweeted.createdAt : createdAt
	const headerName = isRetweeted ? rUser.name : user.name
	const headerUsername = isRetweeted ? rUser.username : user.username
	const headerImg = isRetweeted ? rUser.image : user.image
	const headerFullText = isRetweeted ? retweeted.fullText : fullText
	const favCount = isRetweeted ? retweeted.counts.favorites : counts.favorites
	const rtCount = isRetweeted ? retweeted.counts.retweets : counts.retweets

	let extEntities = extendedEntities
	if (retweeted && !_.isEmpty(retweeted.extendedEntities)) {
		extEntities = retweeted.extendedEntities
	}

	let qExtEntities = quoted.extendedEntities
	let qFullText = _.isEmpty(quoted.fullText) ? "" : quoted.fullText
	let qName = qUser.name
	let qUsername = qUser.username
	let qTweetId = quoted.tweetId

	if (isRetweeted && !_.isEmpty(retweeted.quoted)) {
		const { quoted } = retweeted
		qFullText = _.isEmpty(quoted.fullText) ? "" : quoted.fullText
		qExtEntities = quoted.extendedEntities
		qName = quoted.user.name
		qUsername = quoted.user.screen_name
		qTweetId = quoted.tweetId
	}

	let tweetText = headerFullText
	if (!_.isEmpty(highlightedText)) {
		tweetText = getHighlightedText(headerFullText, highlightedText)
	}
	const linkifiedTweetText = linkifyHtml(tweetText, {
		className: "linkify",
		formatHref: {
			mention: (val) => `/pages/twitter${val}`,
			hashtag: (val) => val
		}
	})

	let qTweetText = qFullText
	if (isQuoted && !_.isEmpty(highlightedText)) {
		qTweetText = getHighlightedText(qFullText, highlightedText)
	}
	const linkifiedQTweetText = linkifyHtml(qTweetText, {
		className: "linkify",
		formatHref: {
			mention: (val) => `/pages/twitter${val}`,
			hashtag: (val) => val
		}
	})

	const className = `tweet${!assignable ? " clickable" : ""}`

	const parseMedia = (entities) => {
		return entities.media.map((item, i) => {
			if (item.type !== "photo" && item.type !== "video") {
				return null
			}
			return (
				<div className="mediaPic" key={`embed${i}`}>
					<Image
						bordered
						className="mediaImg"
						crossOrigin="anonymous"
						onError={(i) => (i.target.src = ItemPic)}
						rounded
						size={imageSize}
						src={item.media_url_https}
					/>
				</div>
			)
		})
	}

	const trigger = (
		<List.Content>
			<List.Header>
				<Icon
					name="twitter"
					onClick={() =>
						window.open(`https://twitter.com/${user.screenName}/status/${id}`, "_blank")
					}
					size="large"
				/>
			</List.Header>
		</List.Content>
	)

	return (
		<div
			className={`tweet ${className}`}
			onClick={(e) => onClickCallback(e, history, id)}
			style={{ opacity }}
		>
			<Card fluid raised={raised}>
				{isRetweeted && (
					<div className="retweetedText">
						<Icon name="retweet" /> {user.name} Retweeted
					</div>
				)}
				<Card.Content>
					<Image
						bordered
						circular
						className="tweetUserImg"
						crossOrigin={crossOriginAnonymous ? "anonymous" : null}
						floated="left"
						onError={(i) => {
							const newImg = headerImg !== defaultUserImg ? defaultUserImg : ItemPic
							i.target.src = newImg
						}}
						src={headerImg}
					/>
					<Card.Header
						className={`tweetUserName ${externalLink ? "link" : ""}`}
						onClick={(e) => {
							if (externalLink) {
								e.stopPropagation()
								history.push(`/pages/twitter/${headerUsername}`)
							}
						}}
					>
						{headerName}
					</Card.Header>
					<Card.Meta className="tweetUserScreenName">
						@{headerUsername} •
						<span className="tweetTime">
							<Moment date={headerCreatedAt} format="MMM DD, YYYY" />
						</span>
					</Card.Meta>
					<Card.Description className="linkifyTweet" onMouseUp={handleHoverOn}>
						<div
							dangerouslySetInnerHTML={{
								__html: linkifiedTweetText
							}}
						/>
						{extEntities && (
							<div className="extEntitiesWrapper">{parseMedia(extEntities)}</div>
						)}
					</Card.Description>
					{isQuoted && (
						<>
							<Card
								className={`quotedTweet ${!assignable ? " clickable" : ""}`}
								fluid
							>
								<Card.Content
									className="quotedTweetContent"
									onClick={(e) => {
										e.stopPropagation()
										history.push(`/tweet/${qTweetId}`)
									}}
								>
									<Card.Header className="quotedHeader">
										{qName}{" "}
										<span className="quotedScreenName">@{qUsername}</span>
									</Card.Header>
									<Card.Description className="quotedTextTweet">
										<div
											dangerouslySetInnerHTML={{
												__html: linkifiedQTweetText
											}}
										/>
										{qExtEntities && <>{parseMedia(qExtEntities)}</>}
									</Card.Description>
								</Card.Content>
							</Card>
						</>
					)}
				</Card.Content>

				{showStats && (
					<Card.Content extra>
						<List floated="left" horizontal>
							<List.Item>
								<Label>
									<Icon color="blue" inverted name="retweet" size="large" />{" "}
									<NumberFormat
										displayType={"text"}
										thousandSeparator={true}
										value={favCount}
									/>
								</Label>
							</List.Item>
							<List.Item className="favoriteItem">
								<Label>
									<Icon color="red" inverted name="like" size="large" />{" "}
									<NumberFormat
										displayType={"text"}
										thousandSeparator={true}
										value={rtCount}
									/>
								</Label>
							</List.Item>
							{counts.fallacies > 0 && (
								<List.Item className="fallacyItem">
									<Label>
										<Icon
											color="yellow"
											inverted
											name="sticky note"
											size="large"
										/>{" "}
										<NumberFormat
											displayType={"text"}
											thousandSeparator={true}
											value={counts.fallacies}
										/>
									</Label>
								</List.Item>
							)}
						</List>
						{externalLink && (
							<List floated="right" horizontal>
								<List.Item className="externalLinkListItem">
									<Popup
										className="twitterExternalPopup"
										content="View on Twitter"
										position="bottom left"
										trigger={trigger}
									/>
								</List.Item>
							</List>
						)}
					</Card.Content>
				)}
			</Card>
		</div>
	)
}

Tweet.propTypes = {
	config: PropTypes.shape({
		assignable: PropTypes.bool,
		crossOriginAnonymous: PropTypes.bool,
		externalLink: PropTypes.bool,
		handleHoverOn: PropTypes.func,
		highlight: PropTypes.bool,
		highlightedText: PropTypes.string,
		imageSize: PropTypes.string,
		onClickCallback: PropTypes.func,
		opacity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		raised: PropTypes.bool,
		showStats: PropTypes.bool
	}),
	createdAt: PropTypes.string,
	extendedEntities: PropTypes.shape({
		media: PropTypes.array
	}),
	fullText: PropTypes.string,
	id: PropTypes.string,
	quoted: PropTypes.shape({
		counts: PropTypes.shape({
			favorites: PropTypes.number,
			retweets: PropTypes.number
		}),
		extendedEntities: PropTypes.string,
		fullText: PropTypes.string,
		tweetId: PropTypes.string,
		user: PropTypes.shape({
			img: PropTypes.string,
			name: PropTypes.string,
			username: PropTypes.string
		})
	}),
	retweeted: PropTypes.shape({
		counts: PropTypes.shape({
			favorites: PropTypes.number,
			retweets: PropTypes.number
		}),
		extendedEntities: PropTypes.string,
		fullText: PropTypes.string,
		tweetId: PropTypes.string,
		user: PropTypes.shape({
			img: PropTypes.string,
			name: PropTypes.string,
			username: PropTypes.string
		})
	}),
	stats: PropTypes.shape({
		fallacies: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		favorites: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		retweets: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
	}),
	user: PropTypes.shape({
		img: PropTypes.string,
		name: PropTypes.string,
		username: PropTypes.string
	})
}

export default Tweet
