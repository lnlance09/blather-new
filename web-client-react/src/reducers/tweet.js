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
					data: fallacies,
					loaded: true
				}
			}
		case "GET_TWEET":
			return {
				...state,
				error: false,
				loaded: true,
				tweet: action.tweet
			}
		default:
			throw new Error()
	}
}

export default reducer
