const reducer = (state, action) => {
	switch (action.type) {
		case "ADD_ARGUMENT_IMAGE":
			const images = [...state.argument.images.data, action.image]
			return {
				...state,
				argument: {
					...state.argument,
					imageCount: state.argument.imageCount + 1,
					imageOptions: [...state.argument.imageOptions, action.s3Link],
					images: {
						...state.argument.images,
						data: images
					}
				}
			}
		case "GET_ARGUMENT":
			return {
				...state,
				argument: action.argument,
				error: false,
				loaded: true
			}
		case "GET_MODAL_TWEETS":
			const tweets =
				action.page > 1 ? [...state.modalTweets, ...action.tweets] : action.tweets
			return {
				...state,
				modalTweets: tweets
			}
		case "GET_TWEETS":
			return {
				...state,
				tweets: action.tweets
			}
		case "GET_FALLACIES":
			return {
				...state,
				fallacies: action.fallacies
			}
		case "GET_PURVEYORS":
			return {
				...state,
				purveyors: action.purveyors
			}
		default:
			throw new Error()
	}
}

export default reducer
