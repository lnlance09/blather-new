const initialState = {
	contradictions: {
		count: 0,
		data: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		loaded: false
	},
	fallacies: {
		count: 0,
		data: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		loaded: false
	},
	pageOptions: [],
	pageOptionsTwitter: [],
	pages: {
		count: 0,
		data: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		loaded: false,
		twitterCount: 0,
		youtubeCount: 0
	},
	refOptions: [],
	tweets: {
		count: 0,
		data: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		loaded: false
	}
}

export default initialState
