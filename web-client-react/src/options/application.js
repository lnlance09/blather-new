let _cashOptions = [
	{
		key: "lessThan50k",
		name: "lessThan50k",
		text: "Less than $50,000",
		value: 0
	},
	{
		key: "lessThan250k",
		name: "lessThan250k",
		text: "Less than $250,000",
		value: 1
	},
	{
		key: "lessThan500k",
		name: "lessThan500k",
		text: "Less than $500,000",
		value: 2
	},
	{
		key: "lessThan1m",
		name: "lessThan1m",
		text: "Less than $1,000,000",
		value: 3
	},
	{
		key: "lessThan10m",
		name: "lessThan10m",
		text: "Less than $10,000,000",
		value: 4
	}
]

export const cashOptions = _cashOptions

export const getCashText = (value) => {
	const options = _cashOptions.filter((item) => item.value === parseInt(value, 10))
	return options.length === 0 ? null : options[0].text
}

let _timeOptions = [
	{
		key: "shortTerm",
		name: "shortTerm",
		text: "Short Term (1 - 6 months)",
		value: "short"
	},
	{
		key: "mediumTerm",
		name: "mediumTerm",
		text: "Mid Term (6 - 12 months)",
		value: "mid"
	},
	{
		key: "longTerm",
		name: "longTerm",
		text: "Long Term (More than 1 year)",
		value: "long"
	}
]

export const timeOptions = _timeOptions

export const getTimeText = (value) => {
	const options = _timeOptions.filter((item) => item.value === value)
	return options.length === 0 ? null : options[0].text
}

export const _yearsOptions = [
	{
		key: "lessThanYear",
		name: "lessThanYear",
		text: "Less than a year",
		value: 0
	},
	{
		key: "oneYear",
		name: "oneYear",
		text: "1 - 3 years",
		value: 1
	},
	{
		key: "twoYear",
		name: "twoYear",
		text: "3 - 5 Years",
		value: 2
	},
	{
		key: "threeYear",
		name: "threeYear",
		text: "+5 years",
		value: 3
	}
]

export const yearsOptions = _yearsOptions

export const getYearsText = (value) => {
	const options = _yearsOptions.filter((item) => item.value === parseInt(value, 10))
	return options.length === 0 ? null : options[0].text
}
