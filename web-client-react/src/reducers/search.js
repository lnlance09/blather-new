const reducer = (state, action) => {
	switch (action.type) {
		case "SEARCH_CONTRADICTIONS":
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
		case "SEARCH_FALLACIES":
			const fallacies =
				action.page > 1 ? [...state.fallacies.data, ...action.fallacies] : action.fallacies
			return {
				...state,
				fallacies: {
					data: fallacies,
					loaded: true
				}
			}
		case "SEARCH_PAGES":
			const pages = action.page > 1 ? [...state.pages.data, ...action.pages] : action.pages
			return {
				...state,
				pages: {
					data: pages,
					loaded: true
				}
			}
		case "SEARCH_TWEETS":
			const tweets =
				action.page > 1 ? [...state.tweets.data, ...action.tweets] : action.tweets
			return {
				...state,
				tweets: {
					data: tweets,
					loaded: true
				}
			}
		default:
			throw new Error()
	}
}

export default reducer
