const reducer = (state, action) => {
	switch (action.type) {
		case "REMOVE_IMAGE":
			const newImages = state.images.filter((img, i) => i !== action.key)
			return {
				...state,
				images: newImages
			}
		case "SET_GROUP_OPTIONS":
			return {
				...state,
				groupOptions: action.options
			}
		case "SET_IMAGES":
			const images =
				state.images.length > 0 ? [...state.images, action.image] : [action.image]
			return {
				...state,
				images,
				imagesLoading: false
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
		case "TOGGLE_IMAGES_LOADING":
			return {
				...state,
				imagesLoading: !state.imagesLoading
			}
		default:
			throw new Error()
	}
}

export default reducer
