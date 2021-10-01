const reducer = (state, action) => {
	switch (action.type) {
		case "SEARCH_FALLACIES":
			return {
				...state,
				fallacies: action.fallacies
			}
		case "SEARCH_PAGES":
			return {
				...state,
				pages: action.data
			}
		case "SEARCH_USERS":
			return {
				...state,
				users: action.data
			}
		default:
			throw new Error()
	}
}

export default reducer
