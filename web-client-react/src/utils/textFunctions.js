import numeral from "numeral"

export const capitalizeWord = (word) => word.slice(0, 1).toUpperCase() + word.slice(1)

export const formatGrammar = (word) => {
	const vowels = ["a", "e", "i", "o", "u"]
	return vowels.indexOf(word.toLowerCase().substring(0, 1)) === -1 ? "a" : "an"
}

export const formatNumber = (count, format = "0a") => numeral(count).format(format)

export const formatPlural = (count, term) => {
	if (term.substr(term.length - 1) === "y") {
		const word = term.substring(0, term.length - 1)
		return parseInt(count, 10) === 1 ? term : `${word}ies`
	}
	return parseInt(count, 10) === 1 ? term : `${term}s`
}

export const hyphenateText = (text) => text.toLowerCase().split(" ").join("-")

export const getHighlightedText = (text, higlight, className = "") => {
	if (typeof text !== "string") {
		return
	}

	const parts = text.split(new RegExp(`(${higlight.replace(/[()]/g, "")})`, "gi"))
	let newText = ""
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i]
		if (part.toLowerCase() === higlight.toLowerCase()) {
			newText += `<b key="${className}Highlighted${i}${part}">${part}</b>`
		} else {
			newText += part
		}
	}

	return newText
}
