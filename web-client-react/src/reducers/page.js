const reducer = (state, action) => {
	switch (action.type) {
		case "GET_ARGUMENTS":
			return {
				...state,
				args: action.args
			}
		case "GET_CONTRADICTIONS":
			const contradictions =
				action.page > 1
					? [...state.contradictions.data, ...action.contradictions]
					: action.contradictions
			return {
				...state,
				contradictions: {
					data: contradictions,
					loaded: true
				}
			}
		case "GET_FALLACIES":
			const fallacies =
				action.page > 1 ? [...state.fallacies.data, ...action.fallacies] : action.fallacies
			return {
				...state,
				fallacies: {
					data: fallacies,
					loaded: true
				}
			}
		case "GET_MODAL_TWEETS":
			const mTweets =
				action.page > 1 ? [...state.modalTweets, ...action.tweets] : action.tweets
			return {
				...state,
				modalTweets: mTweets
			}
		case "GET_PAGE":
			return {
				...state,
				loaded: true,
				page: action.page
			}
		case "GET_TWEETS":
			const tweets =
				action.page > 1 ? [...state.tweets.data, ...action.tweets] : action.tweets
			return {
				...state,
				tweets: {
					data: tweets,
					loaded: true
				}
			}
		case "SET_PAGE_ERROR":
			return {
				...state,
				error: true,
				loaded: true
			}
		default:
			throw new Error()
	}
}

export default reducer
