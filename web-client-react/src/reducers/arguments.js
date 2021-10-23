const reducer = (state, action) => {
	switch (action.type) {
		case "GET_ARGUMENTS":
			return {
				...state,
				args: action.args,
				error: false,
				loaded: true
			}
		case "SET_ARGUMENT_OPTIONS":
			return {
				...state,
				argOptions: action.options
			}
		case "UPDATE_ARGUMENTS":
			return {
				...state,
				args: action.args
			}
		default:
			throw new Error()
	}
}

export default reducer
