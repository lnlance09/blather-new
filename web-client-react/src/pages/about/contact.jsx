import { Button, Form, Header } from "semantic-ui-react"
import { useContext, useState } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Contact = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	const [msg, setMsg] = useState("")

	const onChangeMsg = (e) => {
		setMsg(e.target.value)
	}

	const sendMsg = () => {
		axios
			.post(`${process.env.REACT_APP_BASE_URL}contact`, {
				msg
			})
			.then(() => {
				toast.success("Thanks for contacting us!")
				setMsg("")
			})
			.catch((error) => {
				const { status } = error.response
				const { errors } = error.response.data
				let errorMsg = error.response.data.message

				if (status === 401) {
					errorMsg = error.response.data.message
				}

				if (status === 422) {
					if (typeof errors.msg !== "undefined") {
						errorMsg = errors.msg[0]
					}
				}

				toast.error(errorMsg)
			})
	}

	return (
		<DefaultLayout activeItem="contact" containerClassName="contactPage" history={history}>
			<DisplayMetaTags page="contact" />

			<Header as="h1" content="Contact Us" inverted={inverted} />

			<p className="description">
				Let us know what's on your mind or if you have any suggestions
			</p>

			<Form inverted={inverted}>
				<Form.Field>
					<textarea
						onChange={onChangeMsg}
						placeholder="What's up?"
						rows={10}
						value={msg}
					/>
				</Form.Field>
				<Form.Field>
					<Button
						color="blue"
						content="Send"
						disabled={msg === ""}
						fluid
						onClick={sendMsg}
					/>
				</Form.Field>
			</Form>
		</DefaultLayout>
	)
}

Contact.propTypes = {
	history: PropTypes.object
}

export default Contact
