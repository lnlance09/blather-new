import _ from "underscore"

const reducer = (state, action) => {
	switch (action.type) {
		case "GET_ARGUMENTS":
			return {
				...state,
				args: action.args
			}
		case "GET_COMMENTS":
			const comments =
				action.page > 1 ? [...state.comments.data, ...action.comments] : action.comments
			return {
				...state,
				comments: {
					data: comments,
					loaded: true
				}
			}
		case "GET_FALLACY":
			return {
				...state,
				error: false,
				fallacy: action.fallacy,
				loaded: true
			}
		case "GET_FALLACIES":
			const fallacies =
				action.page > 1 ? [...state.fallacies, ...action.fallacies] : action.fallacies
			return {
				...state,
				fallacies
			}
		case "GET_MODAL_TWEETS":
			const tweets =
				action.page > 1 ? [...state.modalTweets, ...action.tweets] : action.tweets
			return {
				...state,
				modalTweets: tweets
			}
		case "SAVE_SCREENSHOT":
			return {
				...state,
				fallacy: {
					...state.fallacy
				}
			}
		case "SET_FALLACY_ERROR":
			return {
				...state,
				error: true,
				loaded: true
			}
		case "SET_REFERENCE_OPTIONS":
			return {
				...state,
				refOptions: action.options
			}
		case "UPDATE_FALLACY":
			const newExp = _.has(action.data, "explanation")
				? action.data.explanation
				: state.fallacy.explanation

			let newRef = state.fallacy.reference
			if (_.has(action.data, "reference")) {
				newRef = action.data.reference
			}

			let newTitle = state.fallacy.title
			if (_.has(action.data, "title")) {
				newTitle = action.data.title
			}

			return {
				...state,
				fallacy: {
					...state.fallacy,
					explanation: newExp,
					reference: newRef,
					title: newTitle
				}
			}
		default:
			throw new Error()
	}
}

export default reducer
