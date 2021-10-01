import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css"
import "./style.scss"
import { useRef, useState } from "react"
import { Button, Divider, Form, Grid, Header, Segment } from "semantic-ui-react"
import { getConfig } from "options/toast"
import { dateDiff } from "utils/dateFunctions"
import { toast } from "react-toastify"
import axios from "axios"
import moment from "moment"
import NumberFormat from "react-number-format"
import SemanticDatepicker from "react-semantic-ui-datepickers"
import PropTypes from "prop-types"

const toastConfig = getConfig()
toast.configure(toastConfig)

const PredictionForm = ({ auth, coin, days = 30, defaultPrice = "", history, inverted }) => {
	const defaultDate = moment().add(days, "days").toDate()

	const explanation = useRef(null)
	const [date, setDate] = useState(defaultDate)
	const [daysFromNow, setDaysFromNow] = useState(days)
	const [loading, setLoading] = useState(false)
	const [operator, setOperator] = useState("more")
	const [price, setPrice] = useState(defaultPrice)

	const calculatePriceDiff = (oldPrice, newPrice) => {
		const price = parseFloat(newPrice - oldPrice, 10)
		const percent = (price / oldPrice) * 100
		return {
			percentDiff: percent.toFixed(2),
			priceDiff: price
		}
	}

	const changeDate = (e, data) => {
		setDate(data.value)
		const days = dateDiff(null, data.value)
		setDaysFromNow(days)
	}

	const submitPrediction = async () => {
		setLoading(true)
		await axios
			.post(
				`${process.env.REACT_APP_BASE_URL}predictions/create`,
				{
					coin: coin.id,
					explanation: explanation.current.value,
					predictionPrice: price,
					targetDate: date
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("bearer")}`
					}
				}
			)
			.then((response) => {
				const { data } = response.data
				history.push(`/predictions/${data.id}`)
			})
			.catch((error) => {
				let errorMsg = ""
				const { status } = error.response
				const { errors } = error.response.data

				if (status === 401 || status === 403) {
					errorMsg = error.response.data.message
				} else {
					if (typeof errors.targetDate !== "undefined") {
						errorMsg = errors.targetDate[0]
					}

					if (typeof errors.predictionPrice !== "undefined") {
						errorMsg = errors.predictionPrice[0]
					}

					if (typeof errors.coin !== "undefined") {
						errorMsg = errors.coin[0]
					}
				}

				setLoading(false)
				toast.error(errorMsg)
			})
	}

	const { percentDiff, priceDiff } = calculatePriceDiff(coin.lastPrice, price)

	const formIsValid = priceDiff !== 0 && date !== ""

	return (
		<div className={`predictionFormComponent ${inverted ? "inverted" : null}`}>
			<Form size="large">
				<Form.Group widths="equal">
					<Form.Field>
						<div className={`ui labeled input ${inverted ? "inverted" : ""}`}>
							<div className="ui basic label">$</div>
							<NumberFormat
								decimalScale={price > 1 ? 2 : 6}
								onValueChange={(values) => {
									const { value } = values
									setPrice(value)
									const { priceDiff } = calculatePriceDiff(defaultPrice, value)
									setOperator(priceDiff > 0 ? "more" : "less")
								}}
								thousandSeparator
								thousandsGroupStyle="dollar"
								value={price}
							/>
						</div>
					</Form.Field>
					<Form.Field className="dateField">
						<SemanticDatepicker
							className="fluid inverted"
							datePickerOnly
							filterDate={(date) => {
								const now = new Date()
								return date >= now
							}}
							format="MMM D, YYYY"
							inverted={inverted}
							onChange={changeDate}
							placeholder="Pick a date"
							showOutsideDays
							value={date}
						/>
					</Form.Field>
				</Form.Group>
				{formIsValid && (
					<>
						<Divider inverted={inverted} />
						<Grid divided inverted={inverted} stackable>
							<Grid.Row>
								<Grid.Column width={8}></Grid.Column>
								<Grid.Column width={8}>
									<Segment basic inverted={inverted}>
										<Header as="p" inverted={inverted}>
											You're predicting that {coin.symbol} will be worth{" "}
											<span className={operator === "more" ? "green" : "red"}>
												{percentDiff}%
											</span>{" "}
											{operator}{" "}
											<span className="daysFromNow">{daysFromNow} days</span>{" "}
											from now
										</Header>
										<textarea
											name="explanation"
											placeholder="What's your reasoning for this opinion? (Optional)"
											ref={explanation}
											rows={8}
										/>
									</Segment>
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</>
				)}
			</Form>
			<Divider inverted={inverted} />
			<Button
				color="blue"
				content="Predict"
				disabled={!formIsValid}
				fluid
				loading={loading}
				onClick={() => {
					if (auth) {
						submitPrediction()
						return
					}

					history.push("/login")
				}}
				size="large"
			/>
		</div>
	)
}

PredictionForm.propTypes = {
	auth: PropTypes.bool,
	coin: PropTypes.shape({
		category: PropTypes.string,
		circulatingSupply: PropTypes.number,
		cmcId: PropTypes.number,
		description: PropTypes.string,
		id: PropTypes.number,
		lastPrice: PropTypes.number,
		logo: PropTypes.string,
		marketCap: PropTypes.number,
		maxSupply: PropTypes.number,
		name: PropTypes.string,
		percentages: PropTypes.shape({
			"1h": PropTypes.number,
			"24h": PropTypes.number,
			"7d": PropTypes.number,
			"30d": PropTypes.number,
			"60d": PropTypes.number,
			"90d": PropTypes.number
		}),
		predictionsCount: PropTypes.number,
		slug: PropTypes.string,
		symbol: PropTypes.string,
		totalSupply: PropTypes.number
	}),
	days: PropTypes.number,
	defaultPrice: PropTypes.number,
	inverted: PropTypes.bool
}

export default PredictionForm
