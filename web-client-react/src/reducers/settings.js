const reducer = (state, action) => {
	switch (action.type) {
		case "SET_TWITTER_ERROR":
			return {
				...state,
				twitterLinked: false,
				twitterLoaded: true
			}
		case "SET_TWITTER_INFO":
			return {
				...state,
				twitter: action.twitter,
				twitterLinked: true,
				twitterLoaded: true
			}
		default:
			throw new Error()
	}
}

export default reducer
