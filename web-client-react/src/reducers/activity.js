const reducer = (state, action) => {
	switch (action.type) {
		case "GET_ACTIVITY_FALLACIES":
			const fallacies =
				action.page > 1 ? [...state.fallacies.data, ...action.fallacies] : action.fallacies
			return {
				...state,
				fallacies: {
					data: fallacies,
					loaded: true
				}
			}
		default:
			throw new Error()
	}
}

export default reducer
