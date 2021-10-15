import axios from "axios"

export const getReferenceOptions = async () => {
	return await axios
		.get(`${process.env.REACT_APP_BASE_URL}reference/showOptions`, {
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
