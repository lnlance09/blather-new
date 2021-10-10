const reducer = (state, action) => {
	switch (action.type) {
		case "GET_ARGUMENTS":
			return {
				...state,
				data: action.arguments,
				error: false,
				loaded: true
			}
		default:
			throw new Error()
	}
}

export default reducer
