const initialState = {
	argOptions: [],
	contradictions: {
		count: 0,
		data: [{}, {}, {}],
		loaded: false
	},
	error: false,
	fallacies: {
		count: 0,
		data: [{}, {}, {}],
		loaded: false
	},
	loaded: false,
	modalTweets: [],
	tweet: {}
}

export default initialState
