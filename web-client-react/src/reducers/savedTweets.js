const reducer = (state, action) => {
	switch (action.type) {
		case "GET_TWEETS":
			const tweets =
				action.page > 1 ? [...state.tweets.data, ...action.tweets] : action.tweets
			return {
				...state,
				loaded: true,
				tweets
			}
		default:
			throw new Error()
	}
}

export default reducer
