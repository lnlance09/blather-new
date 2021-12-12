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
				tweetLoaded: true,
				video: {},
				videoError: false,
				videoLoaded: false
			}
		case "GET_TWEET_CONTRADICTION":
			return {
				...state,
				cTweet: action.tweet,
				cTweetError: false,
				cTweetLoaded: true,
				cVideo: {},
				cVideoError: false,
				cVideoLoaded: false
			}
		case "GET_VIDEO":
			return {
				...state,
				video: action.video,
				videoError: false,
				videoLoaded: true,
				tweet: {},
				tweetError: false,
				tweetLoaded: false
			}
		case "GET_VIDEO_CONTRADICTION":
			return {
				...state,
				cVideo: action.video,
				cVideoError: false,
				cVideoLoaded: true,
				cTweet: {},
				cTweetError: false,
				cTweetLoaded: false
			}
		case "RESET_CONTRADICTING_TWEET":
			return {
				...state,
				cTweet: {},
				cTweetError: false,
				cTweetLoaded: false
			}
		case "RESET_TWEET":
			return {
				...state,
				tweet: {},
				tweetError: false,
				tweetLoaded: false
			}
		case "RESET_VIDEO":
			return {
				...state,
				video: {},
				videoError: false,
				videoLoaded: false
			}
		case "RESET_TWEET_CONTRADICTION":
			return {
				...state,
				cTweet: {},
				cTweetError: false,
				cTweetLoaded: false
			}
		case "RESET_VIDEO_CONTRADICTION":
			return {
				...state,
				cVideo: {},
				cVideoError: false,
				cVideoLoaded: false
			}
		default:
			throw new Error()
	}
}

export default reducer
