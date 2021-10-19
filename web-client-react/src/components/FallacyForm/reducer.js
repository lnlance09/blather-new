const reducer = (state, action) => {
	switch (action.type) {
		case "SET_GROUP_OPTIONS":
			return {
				...state,
				groupOptions: action.options
			}
		case "SET_PAGE_OPTIONS":
			return {
				...state,
				pageOptions: action.options
			}
		case "SET_REFERENCE_OPTIONS":
			return {
				...state,
				refOptions: action.options
			}
		default:
			throw new Error()
	}
}

export default reducer
