const reducer = (state, action) => {
	switch (action.type) {
		case "GET_FALLACY":
			return {
				...state,
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
		default:
			throw new Error()
	}
}

export default reducer
