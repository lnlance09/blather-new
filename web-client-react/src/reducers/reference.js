const reducer = (state, action) => {
	switch (action.type) {
		case "GET_REFERENCES":
			return {
				...state,
				loaded: true,
				reference: action.ref
			}
		case "UPDATE_REFERENCE":
			return {
				...state,
				reference: action.ref
			}
		default:
			throw new Error()
	}
}

export default reducer
