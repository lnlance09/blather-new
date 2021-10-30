const reducer = (state, action) => {
	switch (action.type) {
		case "GET_GROUPS":
			return {
				...state,
				groups: action.groups,
				loaded: true
			}
		case "SET_GROUPS_ERROR":
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
