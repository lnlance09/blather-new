import axios from "axios"

export const getArgumentOptions = async () => {
	return await axios
		.get(`${process.env.REACT_APP_BASE_URL}arguments/showOptions`, {
			params: {}
		})
		.then((response) => {
			const { data } = response.data
			return data
		})
		.catch(() => {
			console.error("There was an error")
		})
}

export const argumentOptions = [
	{ key: 1, text: "Right-Wing Arguments", value: 1 },
	{ key: 2, text: "MLM Arguments (Coming Soon)", value: 2, disabled: true },
	{ key: 3, text: "Anti-Vaxx Arguments (Coming Soon)", value: 3, disabled: true },
	{ key: 4, text: "Evangelical Arguments (Coming Soon)", value: 4, disabled: true },
	{ key: 5, text: "Cryptocurrency Arguments (Coming Soon)", value: 5, disabled: true },
	{ key: 6, text: "Wantraprenur Arguments (Coming Soon)", value: 6, disabled: true }
]
