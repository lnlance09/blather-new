const reducer = (state, action) => {
	switch (action.type) {
		case "GET_CONTRADICTIONS":
			const contradictions =
				action.page > 1
					? [...state.contradictions.data, ...action.contradictions]
					: action.contradictions
			return {
				...state,
				contradictions: {
					count: action.total,
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
					count: action.total,
					data: fallacies,
					loaded: true
				}
			}
		case "GET_MODAL_TWEETS":
			const tweets =
				action.page > 1 ? [...state.modalTweets, ...action.tweets] : action.tweets
			return {
				...state,
				modalTweets: tweets
			}
		case "GET_TWEET":
			return {
				...state,
				arguments: action.arguments,
				error: false,
				loaded: true,
				tweet: action.tweet
			}
		case "SET_ARGUMENT_OPTIONS":
			return {
				...state,
				argOptions: action.options
			}
		case "SET_TWEET_ERROR":
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
