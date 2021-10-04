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
		case "GET_PAGE":
			return {
				...state,
				loaded: true,
				page: action.page
			}
		default:
			throw new Error()
	}
}

export default reducer
