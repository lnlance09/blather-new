const reducer = (state, action) => {
	switch (action.type) {
		case "SET_TWITTER_INFO":
			return {
				...state,
				twitter: action.twitter
			}
		default:
			throw new Error()
	}
}

export default reducer
