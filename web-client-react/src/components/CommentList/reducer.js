const reducer = (state, action) => {
	switch (action.type) {
		case "SET_COMMENTS":
			return {
				...state,
				comments: action.comments
			}
		case "LIKE_COMMENT":
			const comment = state.comments.results.find(
				(comment) => comment.id === action.commentId
			)

			if (typeof responseId !== "undefined") {
				const response = comment.responses.find(
					(response) => response.id === action.responseId
				)
				response.likeCount++
				response.likedByMe = "1"
			} else {
				comment.likeCount++
				comment.likedByMe = "1"
			}

			return {
				...state,
				comments: {
					...state.comments,
					results: state.comments.results
				}
			}
		case "POST_COMMENT":
			let results = state.comments ? [action.comment, ...state.comments] : action.comment

			if (typeof action.responseTo !== "undefined" && action.responseTo !== null) {
				const _comment = state.comments.find((comment) => comment.id === action.responseTo)
				_comment.responses.push(action.comment)
				results = state.comments
			}

			return {
				...state,
				comments: results
			}
		case "UNLIKE_COMMENT":
			const _comment = state.comments.results.find(
				(comment) => comment.id === action.commentId
			)

			if (typeof _responseId !== "undefined") {
				const _response = _comment.responses.find(
					(response) => response.id === action.responseId
				)
				_response.likeCount--
				_response.likedByMe = 0
			} else {
				_comment.likeCount--
				_comment.likedByMe = 0
			}

			return {
				...state,
				comments: {
					...state.comments,
					results: state.comments.results
				}
			}
		default:
			throw new Error()
	}
}

export default reducer
