const reducer = (state, action) => {
	switch (action.type) {
		case "GET_FALLACIES":
			const fallacies =
				action.page > 1 ? [...state.fallacies.data, ...action.fallacies] : action.fallacies
			return {
				...state,
				fallacies: {
					data: fallacies,
					loading: false
				}
			}
		case "GET_USER":
			return {
				...state,
				loaded: true,
				trader: action.trader
			}
		case "SET_LOADING_FALLACIES":
			return {
				...state,
				fallacies: {
					...state.fallacies,
					loading: true
				}
			}
		default:
			throw new Error()
	}
}

export default reducer
