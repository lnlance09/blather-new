const reducer = (state, action) => {
	switch (action.type) {
		case "SET_MESSAGES":
			return {
				...state,
				messages: action.messages
			}
		default:
			throw new Error()
	}
}

export default reducer
