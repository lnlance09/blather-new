import _ from "underscore"

const reducer = (state, action) => {
	switch (action.type) {
		case "SET_COMMENTS":
			return {
				...state,
				comments: action.comments
			}
		case "LIKE_COMMENT":
			const comment = state.comments.find((comment) => comment.id === action.commentId)

			if (_.has(action, "responseId") && !_.isNull(action.responseId)) {
				const response = comment.responses.data.find(
					(response) => response.id === action.responseId
				)
				response.likeCount++
				response.likedByMe = true
			} else {
				comment.likeCount++
				comment.likedByMe = true
			}

			return {
				...state,
				comments: state.comments
			}
		case "POST_COMMENT":
			let results = state.comments ? [action.comment, ...state.comments] : action.comment

			if (_.has(action, "responseTo") && !_.isNull(action.responseTo)) {
				const _comment = state.comments.find((comment) => comment.id === action.responseTo)
				_comment.responses.data.push(action.comment)
				results = state.comments
			}

			return {
				...state,
				comments: results
			}
		case "UNLIKE_COMMENT":
			const _comment = state.comments.find((comment) => comment.id === action.commentId)

			if (_.has(action, "responseId") && !_.isNull(action.responseId)) {
				const _response = _comment.responses.data.find(
					(response) => response.id === action.responseId
				)
				_response.likeCount--
				_response.likedByMe = false
			} else {
				_comment.likeCount--
				_comment.likedByMe = false
			}

			return {
				...state,
				comments: state.comments
			}
		default:
			throw new Error()
	}
}

export default reducer
