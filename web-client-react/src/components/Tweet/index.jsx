import "./style.scss"
import { getHighlightedText } from "utils/textFunctions"
import { linkHashtags, linkMentions } from "utils/linkifyAdditions"
import { Card, Icon, Image, Label, List, Popup } from "semantic-ui-react"
import ItemPic from "images/images/square-image.png"
import Linkify from "react-linkify"
import Moment from "react-moment"
import NumberFormat from "react-number-format"
import Parser from "html-react-parser"
import PropTypes from "prop-types"
import React, { useState } from "react"
import runes from "runes"

const Tweet = ({
	assignable,
	color,
	createdAt,
	displayTextRange,
	extendedEntities,
	externalLink,
	fullText,
	handleHoverOn,
	highlight,
	highlightedText,
	history,
	imageSize,
	id,
	isQuoteStatus,
	onClickCallback,
	opacity,
	profileImg,
	quoted,
	raised,
	redirect,
	retweeted,
	showStats,
	stats,
	user
}) => {
	const { img } = this.state

	const className = `tweet${redirect || assignable ? " clickable" : ""}`
	const extEntities = retweeted ? retweeted.extendedEntities : extendedEntities

	const CardHeader = () => {
		let name = user.name
		let screenName = user.screen_name

		if (retweeted) {
			createdAt = new Date(retweeted.createdAt)
			name = retweeted.user.name
			profileImg = retweeted.user.profile_image_url_https.replace("_normal", "")
			screenName = retweeted.user.screen_name
		}

		profileImg += `?v=${new Date().getTime()}`

		return (
			<div>
				<Image
					bordered
					circular
					className="tweetUserImg"
					crossOrigin="anonymous"
					floated="left"
					onError={(i) => {
						if (img === profileImg) {
							i.target.src = ItemPic
						} else {
							i.target.src = profileImg
							this.setState({ img: profileImg })
						}
					}}
					src={profileImg}
				/>
				<Card.Header
					className={`tweetUserName ${externalLink ? "link" : ""}`}
					onClick={(e) => {
						if (externalLink) {
							e.stopPropagation()
							history.push(`/pages/twitter/${screenName}`)
						}
					}}
				>
					{name}
				</Card.Header>
				<Card.Meta className="tweetUserScreenName">
					@{screenName} •
					<span className="tweetTime">
						<Moment date={createdAt} format="MMM DD, YYYY" />
					</span>
				</Card.Meta>
			</div>
		)
	}

	const ParseMedia = () =>
		extEntities.media.map((item, i) => {
			if (item.type === "photo" || item.type === "video") {
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
			}
			return null
		})

	const QuotedTweet = () => {
		let quotedExtEntities = quoted.extendedEntities
		let quotedFullText = typeof quoted.fullText === "undefined" ? quoted.text : quoted.fullFext
		let quotedName = user.name
		let quotedScreenName = quoted.user.screen_name
		let quotedTweetId = quoted.id_str
		if (retweeted && typeof retweeted.quoted !== "undefined") {
			quotedExtEntities = retweeted.quoted.extendedEntities
			quotedFullText =
				typeof retweeted.quoted.fullText === "undefined"
					? retweeted.quoted.text
					: retweeted.quoted.fullText
			quotedName = retweeted.quoted.user.name
			quotedScreenName = retweeted.quoted.user.screen_name
			quotedTweetId = retweeted.quoted.id_str
		}

		return (
			<Card className={`quotedTweet ${!redirect && !assignable ? " clickable" : ""}`} fluid>
				<Card.Content
					className="quotedTweetContent"
					onClick={(e) => {
						if (!redirect) {
							e.stopPropagation()
							history.push(`/tweet/${quotedTweetId}`)
						}
					}}
				>
					<Card.Header className="quotedHeader">
						{quotedName} <span className="quotedScreenName">@{quotedScreenName}</span>
					</Card.Header>
					<Card.Description className="quotedTextTweet">
						<Linkify
							properties={{
								target: "_blank"
							}}
						>
							{quotedFullText}
						</Linkify>
						{quotedExtEntities && <>{ParseMedia(quotedExtEntities)}</>}
					</Card.Description>
				</Card.Content>
			</Card>
		)
	}

	const TweetText = () => {
		const start = displayTextRange[0]
		const end = displayTextRange[1]
		const length = parseInt(end, 10) - parseInt(start, 10)
		const retweetedText =
			typeof retweeted.fullText === "undefined" ? retweeted.text : retweeted.fullText
		return Parser(
			retweeted
				? runes.substr(retweetedText, start, length)
				: runes.substr(fullText, start, length)
		)
	}

	const LinkifiedTweet = (
		<Linkify
			properties={{
				target: "_blank"
			}}
			sanitize
		>
			{highlight && id ? getHighlightedText(TweetText(), highlightedText) : TweetText()}
		</Linkify>
	)

	return (
		<div className={className} onClick={() => onClickCallback()} style={{ opacity }}>
			<Card color={color} fluid raised={raised}>
				{retweeted && (
					<div className="retweetedText">
						<Icon name="retweet" /> {user.name} Retweeted
					</div>
				)}
				<Card.Content
					onClick={(e) => {
						if (redirect) {
							e.stopPropagation()
							history.push(`/tweet/${id}`)
						}

						if (assignable) {
							e.stopPropagation()
							const url = `/assign?url=https://twitter.com/${user.screen_name}/status/${id}`
							if (!e.metaKey) {
								history.push(url)
							} else {
								window.open(url, "_blank").focus()
							}
						}
					}}
				>
					{CardHeader()}
					<Card.Description className="linkifyTweet" onMouseUp={handleHoverOn}>
						{LinkifiedTweet}
						{extEntities && <>{ParseMedia()}</>}
					</Card.Description>
					{isQuoteStatus && QuotedTweet()}
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
										value={retweeted ? retweeted.favorites : stats.favorites}
									/>
								</Label>
							</List.Item>
							<List.Item className="favoriteItem">
								<Label>
									<Icon color="pink" inverted name="like" size="large" />{" "}
									<NumberFormat
										displayType={"text"}
										thousandSeparator={true}
										value={retweeted ? retweeted.retweets : stats.retweets}
									/>
								</Label>
							</List.Item>
						</List>
						<List floated="right" horizontal>
							{externalLink && (
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
																`https://twitter.com/${user.screenName}/status/${id}`,
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
							)}
						</List>
					</Card.Content>
				)}
			</Card>
		</div>
	)
}

Tweet.propTypes = {
	assignable: PropTypes.bool,
	bearer: PropTypes.string,
	color: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
	createdAt: PropTypes.string,
	displayTextRange: PropTypes.array,
	extendedEntities: PropTypes.shape({
		media: PropTypes.array
	}),
	externalLink: PropTypes.bool,
	fullText: PropTypes.string,
	handleHoverOn: PropTypes.func,
	highlight: PropTypes.bool,
	highlightedText: PropTypes.string,
	id: PropTypes.string,
	imageSize: PropTypes.string,
	isQuoteStatus: PropTypes.bool,
	key: PropTypes.string,
	onClickCallback: PropTypes.func,
	opacity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	profileImg: PropTypes.string,
	quoted: PropTypes.oneOfType([
		PropTypes.bool,
		PropTypes.shape({
			counts: PropTypes.shape({
				favorites: PropTypes.number,
				retweets: PropTypes.number
			}),
			entities: PropTypes.string,
			extendedEntities: PropTypes.string,
			fullText: PropTypes.string,
			tweetId: PropTypes.number
		})
	]),
	raised: PropTypes.bool,
	redirect: PropTypes.bool,
	retweeted: PropTypes.oneOfType([
		PropTypes.bool,
		PropTypes.shape({
			counts: PropTypes.shape({
				favorites: PropTypes.number,
				retweets: PropTypes.number
			}),
			entities: PropTypes.string,
			extendedEntities: PropTypes.string,
			fullText: PropTypes.string,
			tweetId: PropTypes.number
		})
	]),
	showStats: PropTypes.bool,
	stats: PropTypes.shape({
		favorites: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		retweets: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
	}),
	user: PropTypes.shape({
		description: PropTypes.string,
		id: PropTypes.number,
		location: PropTypes.string,
		name: PropTypes.string,
		profile_image_url: PropTypes.string,
		screen_name: PropTypes.string
	})
}

Tweet.defaultProps = {
	assignable: false,
	color: null,
	displayTextRange: [0, 280],
	extendedEntities: {
		media: []
	},
	externalLink: false,
	fullText: "",
	highlight: false,
	imageSize: "tiny",
	isQuoteStatus: false,
	onClickCallback: () => null,
	opacity: 1,
	quoted: {
		user: {}
	},
	raised: false,
	redirect: false,
	retweeted: {
		user: {}
	},
	showStats: true,
	stats: {},
	user: {}
}

export default Tweet
