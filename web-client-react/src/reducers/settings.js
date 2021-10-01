const reducer = (state, action) => {
	switch (action.type) {
		case "SET_WALLETS":
			return {
				...state,
				wallets: action.wallets
			}
		default:
			throw new Error()
	}
}

export default reducer
