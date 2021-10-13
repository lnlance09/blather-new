import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css"
import "./style.scss"
import { useEffect, useState } from "react"
import { Button, Divider, Form } from "semantic-ui-react"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import PropTypes from "prop-types"

const toastConfig = getConfig()
toast.configure(toastConfig)

const FallacyForm = ({ auth, history, inverted }) => {
	const [explanation, setExplanation] = useState("")
	const [formIsValid, setFormIsValid] = useState(false)
	const [loading, setLoading] = useState(false)

	const submitFallacy = async () => {
		setLoading(true)
		await axios
			.post(
				`${process.env.REACT_APP_BASE_URL}fallacies/create`,
				{
					tweetId: ""
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

				setLoading(false)
				toast.error(errorMsg)
			})
	}

	return (
		<div className={`fallacyFormComponent ${inverted ? "inverted" : null}`}>
			<Form size="large">
				<Form.Group widths="equal">
					<Form.Field></Form.Field>
					<Form.Field className="dateField"></Form.Field>
				</Form.Group>
				{formIsValid && (
					<>
						<Divider inverted={inverted} />
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
						submitFallacy()
						return
					}

					history.push("/login")
				}}
				size="large"
			/>
		</div>
	)
}

FallacyForm.propTypes = {
	auth: PropTypes.bool,
	inverted: PropTypes.bool
}

export default FallacyForm
