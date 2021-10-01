const reducer = (state, action) => {
	switch (action.type) {
		case "GET_PAGE":
			return {
				...state,
				page: action.page
			}
		default:
			throw new Error()
	}
}

export default reducer
