const reducer = (state, action) => {
	switch (action.type) {
		case "GET_TWEET":
			return {
				...state,
				tweet: action.tweet,
				tweetError: false,
				tweetLoaded: true
			}
		default:
			throw new Error()
	}
}

export default reducer
