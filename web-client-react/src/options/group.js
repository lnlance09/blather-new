import axios from "axios"

export const getGroupsOptions = async () => {
	return await axios
		.get(`${process.env.REACT_APP_BASE_URL}groups/showOptions`, {
			params: {
				showCounts: 1
			}
		})
		.then((response) => {
			const { data } = response.data
			return data
		})
		.catch(() => {
			console.error("There was an error")
		})
}
