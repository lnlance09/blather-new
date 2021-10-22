import axios from "axios"

export const getReferenceOptions = async (pageIds = null) => {
	return await axios
		.get(`${process.env.REACT_APP_BASE_URL}reference/showOptions`, {
			params: {
				pageIds,
				showCounts: pageIds !== null ? 1 : 0
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
