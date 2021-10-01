const reducer = (state, action) => {
	switch (action.type) {
		case "GET_REFERENCE":
			return {
				...state,
				reference: action.ref
			}
		default:
			throw new Error()
	}
}

export default reducer
