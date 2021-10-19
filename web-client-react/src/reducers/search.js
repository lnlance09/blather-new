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
					...state.contradictions,
					count: action.total,
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
					...state.fallacies,
					count: action.total,
					data: fallacies,
					loaded: true
				}
			}
		case "SEARCH_PAGES":
			const pages = action.page > 1 ? [...state.pages.data, ...action.pages] : action.pages
			return {
				...state,
				pages: {
					...state.pages,
					count: action.total,
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
					...state.tweets,
					count: action.total,
					data: tweets,
					loaded: true
				}
			}
		case "SET_COUNTS":
			return {
				...state,
				contradictions: {
					...state.contradictions,
					count: action.counts.contradictions
				},
				fallacies: {
					...state.fallacies,
					count: action.counts.fallacies
				},
				pages: {
					...state.pages,
					count: action.counts.pages
				},
				tweets: {
					...state.tweets,
					count: action.counts.tweets
				}
			}
		case "SET_PAGE_OPTIONS":
			return {
				...state,
				pageOptions: action.options
			}
		case "SET_PAGES_TWITTER_COUNT":
			return {
				...state,
				pages: {
					...state.pages,
					twitterCount: action.count
				}
			}
		case "SET_PAGES_YOUTUBE_COUNT":
			return {
				...state,
				pages: {
					...state.pages,
					youtubeCount: action.count
				}
			}
		case "TOGGLE_CONTRADICTIONS_LOADED":
			return {
				...state,
				contradictions: {
					...state.contradictions,
					loaded: !state.contradictions.loaded
				}
			}
		case "TOGGLE_FALLACIES_LOADED":
			return {
				...state,
				fallacies: {
					...state.fallacies,
					loaded: !state.fallacies.loaded
				}
			}
		case "TOGGLE_PAGES_LOADED":
			return {
				...state,
				pages: {
					...state.pages,
					pages: !state.pages.loaded
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
