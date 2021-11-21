import "./style.scss"
import linkifyHtml from "linkify-html"
import "linkify-plugin-hashtag"
import "linkify-plugin-mention"
import { Card, Icon, Image, Label, List, Popup } from "semantic-ui-react"
import { useContext, useEffect, useState } from "react"
import { getHighlightedText } from "utils/textFunctions"
import { tweetOptions } from "options/tweet"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import _ from "underscore"
import axios from "axios"
import ItemPic from "images/images/square-image.png"
import Moment from "react-moment"
import NumberFormat from "react-number-format"
import PlaceholderPic from "images/images/image-square.png"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"
import UrlPic from "images/images/white-image.png"

const toastConfig = getConfig()
toast.configure(toastConfig)

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
	user,
	urls = {}
}) => {
	const { state, dispatch } = useContext(ThemeContext)
	const { savedTweets } = state

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
		showSaveOption,
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
			mention: (val) => `${process.env.REACT_APP_URL}pages/twitter/${val}`,
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
			mention: (val) => `${process.env.REACT_APP_URL}pages/twitter/${val}`,
			hashtag: (val) => val
		}
	})

	const className = `tweet${!assignable ? " clickable" : ""}`

	let imgUrl = headerImg
	imgUrl += crossOriginAnonymous ? `?t=${new Date()}` : ""

	const hasMedia = _.has(extEntities, "media") ? extEntities.media.length > 0 : false
	const showUrl = !_.isEmpty(urls.url) && !hasMedia

	const [hasSaved, setHasSaved] = useState(false)
	const [saveLoading, setSaveLoading] = useState(false)
	const [hovering, setHovering] = useState(false)

	let saveImgName = saveLoading ? "circle notch" : "save"
	if (hasSaved) {
		saveImgName = hovering ? "close" : "checkmark"
	}

	useEffect(() => {
		const savedTweets = localStorage.getItem("savedTweets")
		if (!_.isEmpty(savedTweets)) {
			const hasSaved = JSON.parse(savedTweets).includes(id)
			setHasSaved(hasSaved)
		}
	}, [id])

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

	const archiveTweet = async (id) => {
		return await axios
			.get(`${process.env.REACT_APP_BASE_URL}tweets/${id}`)
			.then(() => true)
			.catch(() => false)
	}

	const saveTweet = async (id) => {
		if (!savedTweets.includes(id)) {
			setSaveLoading(true)
			const archived = await archiveTweet(id)
			setSaveLoading(false)

			if (!archived) {
				return
			}

			dispatch({
				type: "SET_SAVED_TWEETS",
				tweet: id
			})
			setHasSaved(true)
			toast.info("Tweet added!")
			return
		}

		dispatch({
			type: "CLEAR_TWEET",
			id
		})
		setHasSaved(false)
		toast.error("Tweet removed!")
	}

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
						crossOrigin={crossOriginAnonymous ? "true" : null}
						floated="left"
						onError={(i) => {
							const newImg = headerImg !== defaultUserImg ? defaultUserImg : ItemPic
							i.target.src = newImg
						}}
						src={imgUrl}
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
						{hasMedia && (
							<div className="extEntitiesWrapper">{parseMedia(extEntities)}</div>
						)}
					</Card.Description>
					{showUrl && (
						<Card
							className="urlCard"
							onClick={(e) => {
								e.stopPropagation()
								window.open(urls.url, "_blank").focus()
							}}
						>
							{!_.isEmpty(urls.image) && (
								<Image
									onError={(i) => (i.target.src = UrlPic)}
									src={urls.image}
									wrapped
								/>
							)}
							<Card.Content>
								<Card.Header>{urls.title}</Card.Header>
								<Card.Meta>
									<span className="date">{urls.url}</span>
								</Card.Meta>
								<Card.Description className="links">
									{urls.description}
								</Card.Description>
							</Card.Content>
						</Card>
					)}
					{isQuoted && (
						<Card className={`quotedTweet ${!assignable ? " clickable" : ""}`} fluid>
							<Card.Content
								className="quotedTweetContent"
								onClick={(e) => {
									e.stopPropagation()
									history.push(`/tweet/${qTweetId}`)
								}}
							>
								<Card.Header className="quotedHeader">
									{qName} <span className="quotedScreenName">@{qUsername}</span>
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
						</List>
						{showSaveOption && (
							<List floated="right" horizontal>
								<List.Item className="saveTweet">
									<Label>
										<Icon
											className={`saveTweet ${hasSaved ? "saved" : ""}`}
											color={hasSaved ? (hovering ? "red" : "teal") : "blue"}
											loading={saveLoading}
											name={saveImgName}
											onBlur={() => setHovering(!hovering)}
											onClick={(e) => {
												e.stopPropagation()
												saveTweet(id.toString())
											}}
											onMouseEnter={() => setHovering(true)}
											onMouseLeave={() => setHovering(false)}
											size="large"
										/>
									</Label>
								</List.Item>
							</List>
						)}
						{externalLink && (
							<List floated="right" horizontal>
								<List.Item className="externalLinkListItem">
									<Popup
										className="twitterExternalPopup"
										content="View on Twitter"
										position="bottom left"
										trigger={
											<List.Content>
												<List.Header>
													<Icon
														name="twitter"
														onClick={() =>
															window.open(
																`https://twitter.com/${user.username}/status/${id}`,
																"_blank"
															)
														}
														size="large"
													/>
												</List.Header>
											</List.Content>
										}
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
		showSaveOption: PropTypes.bool,
		showStats: PropTypes.bool
	}),
	createdAt: PropTypes.string,
	extendedEntities: PropTypes.oneOfType([
		PropTypes.shape({
			media: PropTypes.array
		}),
		PropTypes.string
	]),
	fullText: PropTypes.string,
	id: PropTypes.string,
	quoted: PropTypes.shape({
		counts: PropTypes.shape({
			favorites: PropTypes.number,
			retweets: PropTypes.number
		}),
		extendedEntities: PropTypes.oneOfType([
			PropTypes.shape({
				media: PropTypes.array
			}),
			PropTypes.string
		]),
		fullText: PropTypes.string,
		tweetId: PropTypes.string,
		user: PropTypes.shape({
			image: PropTypes.string,
			name: PropTypes.string,
			username: PropTypes.string
		})
	}),
	retweeted: PropTypes.shape({
		counts: PropTypes.shape({
			favorites: PropTypes.number,
			retweets: PropTypes.number
		}),
		extendedEntities: PropTypes.oneOfType([
			PropTypes.shape({
				media: PropTypes.array
			}),
			PropTypes.string
		]),
		fullText: PropTypes.string,
		tweetId: PropTypes.string,
		user: PropTypes.shape({
			image: PropTypes.string,
			name: PropTypes.string,
			username: PropTypes.string
		})
	}),
	stats: PropTypes.shape({
		fallacies: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		favorites: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		retweets: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
	}),
	urls: PropTypes.oneOfType([
		PropTypes.shape({
			description: PropTypes.string,
			image: PropTypes.string,
			title: PropTypes.string,
			url: PropTypes.string
		}),
		PropTypes.arrayOf(
			PropTypes.shape({
				description: PropTypes.string,
				image: PropTypes.string,
				title: PropTypes.string,
				url: PropTypes.string
			})
		)
	]),
	user: PropTypes.shape({
		image: PropTypes.string,
		name: PropTypes.string,
		username: PropTypes.string
	})
}

export default Tweet
