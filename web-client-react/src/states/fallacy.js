const initialState = {
	error: false,
	fallacies: [{}, {}, {}],
	fallacy: {
		contradictionTwitter: {
			highlightedText: "",
			id: 0,
			tweet: {}
		},
		contradictionYouTube: {},
		page: {
			bio: "",
			contradictionCount: null,
			externalLink: "",
			fallacyCount: null,
			id: 0,
			image: "",
			name: "",
			network: "",
			socialMediaId: "",
			username: ""
		},
		reference: {
			description: "",
			id: 0,
			name: ""
		},
		twitter: {
			highlightedText: "",
			id: 0,
			tweet: {}
		},
		user: {
			bio: "",
			id: 0,
			image: "",
			name: "",
			username: ""
		},
		youtube: {},
		explanation: "",
		id: null,
		retracted: false,
		s3Link: "",
		slug: "",
		status: 0,
		title: "",
		views: 1,
		createdAt: "",
		updatedAt: ""
	},
	loaded: false
}

export default initialState
