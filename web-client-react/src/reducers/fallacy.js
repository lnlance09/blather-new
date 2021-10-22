const reducer = (state, action) => {
	switch (action.type) {
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
		case "SET_FALLACY_ERROR":
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
