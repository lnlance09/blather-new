import "./style.scss"
import linkifyHtml from "linkify-html"
import "linkify-plugin-mention"
import {
	Button,
	Comment,
	Form,
	Grid,
	Header,
	Icon,
	Image,
	Placeholder,
	Segment
} from "semantic-ui-react"
import { useContext, useEffect, useReducer, useRef, useState } from "react"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import _ from "underscore"
import axios from "axios"
import defaultImg from "images/avatar/small/steve.jpg"
import initialState from "./state"
import logger from "use-reducer-logger"
import Moment from "react-moment"
import PropTypes from "prop-types"
import ReactTooltip from "react-tooltip"
import reducer from "./reducer"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const PlaceholderSegment = (
	<Placeholder fluid>
		<Placeholder.Header image>
			<Placeholder.Line />
			<Placeholder.Line />
		</Placeholder.Header>
	</Placeholder>
)

const CommentList = ({
	allowReplies = true,
	comments,
	fallacyId,
	history,
	redirectToComment = false,
	showEmptyMsg = true,
	showForm = true,
	showReplies = true,
	size = "large"
}) => {
	const { state } = useContext(ThemeContext)
	const { auth, inverted, user } = state

	const blockRef = useRef(null)
	const textAreaRef = useRef(null)

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const iComments = internalState.comments

	const [responseTo, setResponseTo] = useState(null)

	useEffect(() => {
		dispatch({
			type: "SET_COMMENTS",
			comments
		})
	}, [comments])

	const onSubmitForm = () => {
		postComment(fallacyId, () => {
			setResponseTo(null)
			textAreaRef.current.value = ""
			toast.success("Comment added!")
		})
	}

	const postComment = (id, callback) => {
		const msg = _.isEmpty(textAreaRef.current) ? "" : textAreaRef.current.value
		if (msg === "") {
			return
		}

		axios
			.post(
				`${process.env.REACT_APP_BASE_URL}comments/create`,
				{
					fallacyId: id,
					msg,
					responseTo
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("bearer")}`
					}
				}
			)
			.then((response) => {
				const comment = response.data.data
				dispatch({
					type: "POST_COMMENT",
					comment,
					responseTo
				})
				callback(response)
			})
			.catch(() => {
				toast.error("Error posting comment")
			})
	}

	const likeComment = (commentId, responseId = null) => {
		axios
			.post(
				`${process.env.REACT_APP_BASE_URL}comments/like`,
				{
					commentId,
					responseId
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("bearer")}`
					}
				}
			)
			.then(() => {
				dispatch({
					type: "LIKE_COMMENT",
					commentId,
					responseId
				})
			})
			.catch(() => {
				toast.error("Error liking comment")
			})
	}

	const unlikeComment = (commentId, responseId = null) => {
		axios
			.post(
				`${process.env.REACT_APP_BASE_URL}comments/unlike`,
				{
					commentId,
					responseId
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("bearer")}`
					}
				}
			)
			.then(() => {
				dispatch({
					type: "UNLIKE_COMMENT",
					commentId,
					responseId
				})
			})
			.catch(() => {
				toast.error("Error unliking comment")
			})
	}

	const SingleComment = (comment, commentId, isReply, key) => {
		const { likeCount, likedByMe, user } = comment
		return (
			<>
				<Comment key={key}>
					<Comment.Avatar
						as="a"
						data-for={key}
						data-iscapture="true"
						data-tip={`${user.username}`}
						onClick={() => history.push(`/${user.username}`)}
						onError={(i) => (i.target.src = defaultImg)}
						size="tiny"
						src={user.image ? user.image : defaultImg}
					/>
					<Comment.Content>
						<Comment.Author as="a" onClick={() => history.push(`/${user.username}`)}>
							{user.name}
						</Comment.Author>
						<Comment.Metadata>
							<Moment date={comment.createdAt} fromNow />
						</Comment.Metadata>
						<Comment.Text
							dangerouslySetInnerHTML={{
								__html: linkifyHtml(comment.msg, {
									className: "linkify",
									formatHref: {
										mention: (val) => `${process.env.REACT_APP_URL}${val}`
										// hashtag: (val) => val
									}
								})
							}}
						/>
						<Comment.Actions>
							<Comment.Action>
								<span
									onClick={() => {
										if (!auth) {
											history.push("/auth")
											return
										}

										const responseId = isReply ? comment.id : null
										if (likedByMe) {
											unlikeComment(commentId, responseId)
										} else {
											likeComment(commentId, responseId)
										}
									}}
								>
									<Icon color="blue" inverted={inverted} name="thumbs up" />{" "}
									{likedByMe ? (
										<span className="likeThis">Liked</span>
									) : (
										<span>Like</span>
									)}
								</span>
								{likeCount > 0 && <span className="likeCount">{likeCount}</span>}
							</Comment.Action>
							{allowReplies && (
								<Comment.Action>
									<span
										onClick={() => {
											setResponseTo(commentId)
											textAreaRef.current.value = `@${user.username} `
											textAreaRef.current.focus()
										}}
									>
										<Icon color="green" inverted={inverted} name="reply" />{" "}
										Reply
									</span>
								</Comment.Action>
							)}
						</Comment.Actions>
					</Comment.Content>
				</Comment>
				<ReactTooltip
					className="tooltipClass"
					effect="solid"
					id={key}
					multiline={false}
					place="left"
					type="dark"
				/>
			</>
		)
	}

	const showResponses = (commentId, responses) => (
		<>
			{responses && responses.length > 0 && (
				<Comment.Group size="large">
					{responses.map((r, x) => {
						if (r.id !== null) {
							return (
								<Comment
									className={`${redirectToComment ? "redirect" : ""}`}
									id={`${commentId}${r.id}`}
									key={`replyComment${x}`}
								>
									{SingleComment(r, commentId, true, `replyComment${x}`)}
								</Comment>
							)
						}

						return null
					})}
				</Comment.Group>
			)}
		</>
	)

	return (
		<div className="commentsSection">
			<Segment>
				{showForm && (
					<div ref={blockRef}>
						<Grid>
							<Grid.Row>
								<Grid.Column computer={1} mobile={3}>
									<Image circular src={auth ? user.image : defaultImg} />
								</Grid.Column>
								<Grid.Column computer={15} mobile={13}>
									<Form inverted={inverted} onSubmit={onSubmitForm}>
										<textarea
											placeholder={
												comments.count === 0
													? "Be the first to comment..."
													: "Add a comment..."
											}
											ref={textAreaRef}
											rows={4}
										/>
										<Button
											className="replyBtn"
											color="blue"
											content="Comment"
											fluid
											type="submit"
										/>
									</Form>
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</div>
				)}

				{iComments.length > 0 ? (
					<Comment.Group className="commentsGroup" size={size}>
						{iComments.map((comment, i) => {
							if (_.isEmpty(comment)) {
								return (
									<Comment key={`individualComment${i}`}>
										<Comment.Content>{PlaceholderSegment}</Comment.Content>
									</Comment>
								)
							}

							return (
								<Comment
									className={`${redirectToComment ? "redirect" : ""}`}
									key={`individualComment${i}`}
									id={comment.id}
								>
									{SingleComment(
										comment,
										comment.id,
										false,
										`individualComment${i}`
									)}

									{showResponses(comment.id, comment.responses.data)}
								</Comment>
							)
						})}
					</Comment.Group>
				) : (
					<>
						{showEmptyMsg && (
							<Segment inverted={inverted} placeholder>
								<Header icon inverted={inverted} textAlign="center">
									<Icon color="blue" inverted={inverted} name="comment" />
									No comments
								</Header>
							</Segment>
						)}
					</>
				)}
			</Segment>
		</div>
	)
}

CommentList.propTypes = {
	fallacyId: PropTypes.number,
	redirectToComment: PropTypes.bool,
	showEmptyMsg: PropTypes.bool,
	showForm: PropTypes.bool,
	showReplies: PropTypes.bool
}

export default CommentList
