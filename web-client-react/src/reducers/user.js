const reducer = (state, action) => {
	switch (action.type) {
		case "GET_COMMENTS":
			const comments =
				action.page > 1 ? [...state.comments.data, ...action.comments] : action.comments
			return {
				...state,
				comments: {
					data: comments,
					loaded: true
				}
			}
		case "GET_CONTRADICTIONS":
			const contradictions =
				action.page > 1
					? [...state.contradictions.data, ...action.contradictions]
					: action.contradictions
			return {
				...state,
				contradictions: {
					data: contradictions,
					loaded: true
				}
			}
		case "GET_FALLACIES":
			const fallacies =
				action.page > 1 ? [...state.fallacies.data, ...action.fallacies] : action.fallacies
			return {
				...state,
				fallacies: {
					data: fallacies,
					loaded: true
				}
			}
		case "GET_LIKES":
			const likes = action.page > 1 ? [...state.likes.data, ...action.likes] : action.likes
			return {
				...state,
				likes: {
					data: likes,
					loaded: true
				}
			}
		case "GET_TARGETS":
			const targets =
				action.page > 1 ? [...state.targets.data, ...action.targets] : action.targets
			return {
				...state,
				targets: {
					data: targets,
					loaded: true
				}
			}
		case "GET_USER":
			return {
				...state,
				loaded: true,
				member: action.user
			}
		case "SET_USER_ERROR":
			return {
				...state,
				loaded: true,
				error: true
			}
		default:
			throw new Error()
	}
}

export default reducer
