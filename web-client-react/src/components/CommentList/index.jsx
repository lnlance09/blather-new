import "./style.scss"
import { Button, Comment, Form, Header, Icon, Placeholder, Segment } from "semantic-ui-react"
import { useContext, useEffect, useReducer, useRef, useState } from "react"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import ImagePic from "images/images/image-square.png"
import initialState from "./state"
import logger from "use-reducer-logger"
import Moment from "react-moment"
import defaultImg from "images/avatar/small/steve.jpg"
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
		<Placeholder.Paragraph>
			<Placeholder.Line length="full" />
			<Placeholder.Line length="long" />
			<Placeholder.Line length="short" />
		</Placeholder.Paragraph>
	</Placeholder>
)

const CommentList = ({
	allowReplies,
	bearer,
	// comments,
	history,
	id,
	redirectToComment = false,
	showEmptyMsg = true,
	showReplies = true
}) => {
	const { state } = useContext(ThemeContext)
	const { auth, inverted } = state

	const blockRef = useRef(null)
	const textAreaRef = useRef(null)

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { comments } = internalState

	const [message, setMessage] = useState("")
	const [responseTo, setResponseTo] = useState(null)

	useEffect(() => {
		fetchComments(id)
	}, [id])

	const onSubmitForm = () => {
		if (message === "") {
			return
		}

		postComment(id, message, responseTo, () => {
			setMessage("")
			setResponseTo(null)
		})
	}

	const fetchComments = (id, page = 1) => {
		axios
			.get(`${process.env.REACT_APP_BASE_URL}comments`, {
				params: {
					fallacyId: id,
					page
				}
			})
			.then((response) => {
				const comments = response.data.data
				dispatch({
					type: "GET_COMMENTS",
					comments
				})
			})
			.catch(() => {
				toast.error("Error fetching comments")
			})
	}

	const likeComment = (commentId, responseId = null) => {
		axios
			.post(`${process.env.REACT_APP_BASE_URL}comments/like`, {
				commentId,
				responseId
			})
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

	const postComment = (id, msg, responseTo, callback) => {
		axios
			.post(`${process.env.REACT_APP_BASE_URL}comments/create`, {
				fallacyId: id,
				msg,
				responseTo
			})
			.then((response) => {
				const comment = response.data.data
				callback()
				dispatch({
					type: "POST_COMMENT",
					data: comment
				})
			})
			.catch(() => {
				toast.error("Error posting comment")
			})
	}

	const unlikeComment = (commentId, responseId = null) => {
		axios
			.post(`${process.env.REACT_APP_BASE_URL}comments/unluke`, {
				commentId,
				responseId
			})
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
						onClick={() => history.push(`/users/${user.username}`)}
						onError={(i) => (i.target.src = ImagePic)}
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
						<Comment.Text>{comment.msg}</Comment.Text>
						<Comment.Actions>
							<Comment.Action>
								<span
									onClick={() => {
										if (!auth) {
											history.push("/signin?type=join")
											return
										}

										const payload = {
											commentId: comment.id
										}

										if (isReply) {
											payload.commentId = commentId
											payload.responseId = comment.id
										}

										if (parseInt(comment.likedByMe, 10) === 1) {
											unlikeComment(payload)
										} else {
											likeComment(payload)
										}
									}}
								>
									<Icon
										color={parseInt(likedByMe, 10) === 1 ? "yellow" : null}
										inverted={inverted}
										name="thumbs up"
									/>{" "}
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
											setMessage(`@${user.username} `)
											setResponseTo(commentId)
											window.scrollTo({
												behavior: "smooth",
												top: blockRef.current.offsetTop
											})
											textAreaRef.current.focus()
										}}
									>
										<Icon inverted={inverted} name="reply" /> Reply
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
					type="light"
				/>
			</>
		)
	}

	return (
		<div className="commentsSection">
			<div ref={blockRef}>
				<Form inverted={inverted} onSubmit={onSubmitForm} size="large">
					<textarea
						onChange={(e, { value }) => setMessage(value)}
						placeholder={
							comments.count === 0 ? "Be the first to comment..." : "Add a comment..."
						}
						ref={textAreaRef}
						value={message}
					/>
					<Button
						className="replyBtn"
						color="blue"
						content="Comment"
						fluid
						type="submit"
						size="large"
					/>
				</Form>
			</div>

			{comments.data.length > 0 ? (
				<Comment.Group className="commentsGroup" size="large">
					{comments.data.map((comment, i) => {
						const { responses } = comment
						if (typeof comment.id === "undefined") {
							return <div key={`individualComment${i}`}>{PlaceholderSegment}</div>
						}

						return (
							<Comment
								className={`${redirectToComment ? "redirect" : ""}`}
								key={`individualComment${i}`}
								id={comment.id}
							>
								{SingleComment(comment, comment.id, false, `individualComment${i}`)}

								{responses && responses.length > 0 && showReplies && (
									<Comment.Group size="large">
										{responses.map((response, x) => {
											if (response.id !== null) {
												return (
													<Comment
														className={`${
															redirectToComment ? "redirect" : ""
														}`}
														id={`${comment.id}${response.id}`}
														key={`replyComment${x}`}
													>
														{SingleComment(
															response,
															comment.id,
															true,
															`replyComment${i}`
														)}
													</Comment>
												)
											}

											return null
										})}
									</Comment.Group>
								)}
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
		</div>
	)
}

CommentList.propTypes = {
	id: PropTypes.number,
	redirectToComment: PropTypes.bool,
	showEmptyMsg: PropTypes.bool,
	showReplies: PropTypes.bool
}

export default CommentList
