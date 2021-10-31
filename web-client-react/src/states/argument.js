const initialState = {
	argument: {
		contradictionCount: 0,
		contradictionOptions: [],
		contradictions: [],
		description: "",
		exampleCount: 0,
		explanation: "",
		id: 0,
		imageCount: 0,
		imageOptions: [],
		images: {
			data: []
		},
		slug: "",
		tweetCount: 0,
		tweets: []
	},
	error: false,
	fallacies: [],
	loaded: false,
	modalTweets: [],
	purveyors: [],
	tweets: []
}

export default initialState
