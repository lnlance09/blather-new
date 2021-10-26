const initialState = {
	comments: {
		data: [{}, {}, {}],
		loaded: false
	},
	contradictions: {
		data: [{}, {}, {}],
		loaded: false
	},
	error: false,
	fallacies: {
		data: [{}, {}, {}],
		loaded: false
	},
	likes: {
		data: [{}, {}, {}],
		loaded: false
	},
	loaded: false,
	member: {
		name: "",
		username: ""
	},
	targets: {
		data: [{}, {}, {}],
		loaded: false
	}
}

export default initialState
