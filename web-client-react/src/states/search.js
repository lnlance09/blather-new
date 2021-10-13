const initialState = {
	contradictions: {
		count: 0,
		data: [{}, {}, {}],
		loaded: false
	},
	fallacies: {
		count: 0,
		data: [{}, {}, {}],
		loaded: false
	},
	pageOptions: [],
	pages: {
		count: 0,
		data: [{}, {}, {}, {}, {}, {}],
		loaded: false,
		twitterCount: 0,
		youtubeCount: 0
	},
	tweets: {
		count: 0,
		data: [{}, {}, {}],
		loaded: false
	}
}

export default initialState
