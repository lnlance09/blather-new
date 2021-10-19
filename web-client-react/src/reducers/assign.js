const reducer = (state, action) => {
	switch (action.type) {
		case "GET_GROUPS_BY_PAGE":
			return {
				...state,
				groups: action.groups
			}
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
		case "RESET_TWEET":
			return {
				...state,
				tweet: {},
				tweetError: false,
				tweetLoaded: false
			}
		case "RESET_TWEET_CONTRADICTION":
			return {
				...state,
				cTweet: {},
				cTweetError: false,
				cTweetLoaded: false
			}
		default:
			throw new Error()
	}
}

export default reducer
