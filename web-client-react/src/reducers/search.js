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
		case "SET_PAGE_OPTIONS":
			return {
				...state,
				pageOptions: action.options
			}
		case "TOGGLE_FALLACIES_LOADED":
			return {
				...state,
				fallacies: {
					...state.fallacies,
					loaded: !state.fallacies.loaded
				}
			}
		case "TOGGLE_TWEETS_LOADED":
			return {
				...state,
				tweets: {
					...state.tweets,
					loaded: !state.tweets.loaded
				}
			}
		default:
			throw new Error()
	}
}

export default reducer
