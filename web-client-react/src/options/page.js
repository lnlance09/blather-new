import axios from "axios"

export const getDropdownOptions = async () => {
	return await axios
		.get(`${process.env.REACT_APP_BASE_URL}pages/showOptions`, {
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
