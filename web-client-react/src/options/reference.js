import axios from "axios"

export const getReferenceOptions = async (pageIds = null, basic = false) => {
	return await axios
		.get(`${process.env.REACT_APP_BASE_URL}reference/showOptions`, {
			params: {
				basic: basic !== false ? 1 : 0,
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
