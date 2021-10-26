const reducer = (state, action) => {
	switch (action.type) {
		case "GET_COMMENTS":
			return {
				...state,
				comments: {
					data: action.comments,
					loaded: true
				}
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
			let results = state.comments.results
				? [action.comment, ...state.comments.results]
				: action.comment

			if (
				typeof action.comment.response_to !== "undefined" &&
				action.comment.response_to !== null
			) {
				const _comment = state.comments.results.find(
					(comment) =>
						parseInt(comment.id, 10) === parseInt(action.comment.response_to, 10)
				)
				_comment.responses.push(action.comment)
				results = state.comments.results
			}

			return {
				...state,
				comments: {
					count: state.comments.count + 1,
					results
				}
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
