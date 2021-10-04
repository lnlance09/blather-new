import "./style.scss"
import { Card, Icon, Image, Label, List, Popup } from "semantic-ui-react"
import { getHighlightedText } from "utils/textFunctions"
import { linkHashtags, linkMentions } from "utils/linkifyAdditions"
import { tweetOptions } from "options/tweet"
import ItemPic from "images/images/square-image.png"
import Linkify from "react-linkify"
import Moment from "react-moment"
import NumberFormat from "react-number-format"
import Parser from "html-react-parser"
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import runes from "runes"

const Tweet = ({
	config = tweetOptions,
	counts = {},
	createdAt,
	defaultUserImg = "",
	entities,
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
		displayTextRange,
		externalLink,
		handleHoverOn,
		highlight,
		highlightedText,
		onClickCallback,
		opacity,
		raised,
		redirect,
		showStats
	} = config
	const { isRetweeted, rUser = user } = retweeted
	const { isQuoted, qUser = user } = quoted

	const headerCreatedAt = isRetweeted ? retweeted.createdAt : createdAt
	const headerName = isRetweeted ? rUser.name : user.name
	const headerUsername = isRetweeted ? rUser.username : user.username
	const headerImg = isRetweeted ? rUser.image : user.image
	const headerFullText = isRetweeted ? retweeted.fullText : fullText
	const favCount = isRetweeted ? retweeted.counts.favorites : counts.favorites
	const rtCount = isRetweeted ? retweeted.counts.retweets : counts.retweets

	let qExtEntities = quoted.extendedEntities
	let qFullText = typeof quoted.fullText === "undefined" ? quoted.text : quoted.fullText
	let qName = qUser.name
	let qUsername = qUser.username
	let qTweetId = quoted.tweetId

	if (isRetweeted && typeof retweeted.quoted !== "undefined") {
		const { quoted } = retweeted
		qExtEntities = quoted.extendedEntities
		qFullText = typeof quoted.fullText === "undefined" ? quoted.text : quoted.fullText
		qName = quoted.user.name
		qUsername = quoted.user.screen_name
		qTweetId = quoted.tweetId
	}

	const className = `tweet${redirect || assignable ? " clickable" : ""}`
	const extEntities = retweeted ? JSON.parse(retweeted.extendedEntities) : extendedEntities

	const onClickTweet = (e) => {
		e.stopPropagation()

		if (redirect) {
			history.push(`/tweet/${id}`)
		}

		if (assignable) {
			const url = `/assign?url=https://twitter.com/${user.username}/status/${id}`
			if (e.metaKey) {
				window.open(url, "_blank").focus()
			} else {
				history.push(url)
			}
		}
	}

	const parseMedia = (entities) =>
		entities.media.map((item, i) => {
			if (item.type === "photo" || item.type === "video") {
				return (
					<div className="mediaPic" key={`embed${i}`}>
						<Image
							bordered
							className="mediaImg"
							crossOrigin="anonymous"
							fluid
							onError={(i) => (i.target.src = ItemPic)}
							rounded
							// size={imageSize}
							src={item.media_url_https}
						/>
					</div>
				)
			}
			return null
		})

	const formatTweetText = (text) => {
		const start = displayTextRange[0]
		const end = displayTextRange[1]
		const length = parseInt(end, 10) - parseInt(start, 10)
		return Parser(runes.substr(text, start, length))
	}

	const tweetText = formatTweetText(headerFullText)

	return (
		<div className={className} onClick={() => onClickCallback()} style={{ opacity }}>
			<Card fluid raised={raised}>
				{isRetweeted && (
					<div className="retweetedText">
						<Icon name="retweet" /> {user.name} Retweeted
					</div>
				)}
				<Card.Content onClick={onClickTweet}>
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
						<Linkify
							properties={{
								target: "_blank"
							}}
							sanitize
						>
							{highlight ? (
								<>{getHighlightedText(tweetText, highlightedText)}</>
							) : (
								<>{tweetText}</>
							)}
						</Linkify>
						{extEntities && (
							<div className="extEntitiesWrapper">{parseMedia(extEntities)}</div>
						)}
					</Card.Description>
					{isQuoted && (
						<>
							<Card
								className={`quotedTweet ${
									!redirect && !assignable ? " clickable" : ""
								}`}
								fluid
							>
								<Card.Content
									className="quotedTweetContent"
									onClick={(e) => {
										if (!redirect) {
											e.stopPropagation()
											history.push(`/tweet/${qTweetId}`)
										}
									}}
								>
									<Card.Header className="quotedHeader">
										{qName}{" "}
										<span className="quotedScreenName">@{qUsername}</span>
									</Card.Header>
									<Card.Description className="quotedTextTweet">
										<Linkify
											properties={{
												target: "_blank"
											}}
										>
											{qFullText}
										</Linkify>
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
									<Icon color="pink" inverted name="like" size="large" />{" "}
									<NumberFormat
										displayType={"text"}
										thousandSeparator={true}
										value={rtCount}
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
	config: PropTypes.shape({
		assignable: PropTypes.bool,
		crossOriginAnonymous: PropTypes.bool,
		displayTextRange: PropTypes.array,
		externalLink: PropTypes.bool,
		handleHoverOn: PropTypes.func,
		highlight: PropTypes.bool,
		highlightedText: PropTypes.string,
		imageSize: PropTypes.string,
		onClickCallback: PropTypes.func,
		opacity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		raised: PropTypes.bool,
		redirect: PropTypes.bool,
		showStats: PropTypes.bool
	}),
	createdAt: PropTypes.string,
	entities: PropTypes.string,
	extendedEntities: PropTypes.shape({
		media: PropTypes.array
	}),
	fullText: PropTypes.string,
	id: PropTypes.number,
	quoted: PropTypes.shape({
		counts: PropTypes.shape({
			favorites: PropTypes.number,
			retweets: PropTypes.number
		}),
		entities: PropTypes.string,
		extendedEntities: PropTypes.string,
		fullText: PropTypes.string,
		tweetId: PropTypes.number,
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
		entities: PropTypes.string,
		extendedEntities: PropTypes.string,
		fullText: PropTypes.string,
		tweetId: PropTypes.number,
		user: PropTypes.shape({
			img: PropTypes.string,
			name: PropTypes.string,
			username: PropTypes.string
		})
	}),
	stats: PropTypes.shape({
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
