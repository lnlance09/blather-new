const reducer = (state, action) => {
	switch (action.type) {
		case "GET_TWEET":
			return {
				...state,
				tweet: action.tweet,
				tweetError: false,
				tweetLoaded: true
			}
		case "GET_TWEET_CONTRADICTION":
			return {
				...state,
				cTweet: action.tweet,
				cTweetError: false,
				cTweetLoaded: true
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
