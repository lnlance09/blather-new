const reducer = (state, action) => {
	switch (action.type) {
		case "GET_ACTIVITY_TWEETS":
			const tweets =
				action.page > 1 ? [...state.tweets.data, ...action.tweets] : action.tweets
			return {
				...state,
				tweets: {
					data: tweets,
					loaded: true
				}
			}
		default:
			throw new Error()
	}
}

export default reducer
