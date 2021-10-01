const reducer = (state, action) => {
	switch (action.type) {
		case "":
			return {
				...state
			}
		default:
			throw new Error()
	}
}

export default reducer
