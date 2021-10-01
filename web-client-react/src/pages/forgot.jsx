import { Button, Card, Container, Form, Header, Input } from "semantic-ui-react"
import { useContext, useEffect, useState } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Forgot = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	const params = new URLSearchParams(window.location.search)
	const reset = params.get("reset")

	const [confirmPassword, setConfirmPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [newPassword, setNewPassword] = useState("")
	const [validCode, setValidCode] = useState(null)

	useEffect(() => {
		verifyForgotCode(reset)
	}, [reset])

	const verifyForgotCode = (code) => {
		axios
			.get(`${process.env.REACT_APP_BASE_URL}users/verifyForgotCode`, {
				params: {
					code
				}
			})
			.then(() => {
				setValidCode(true)
			})
			.catch(() => {
				toast.error("Invalid recovery code")
				setValidCode(false)
			})
	}

	const resetPassword = () => {
		setLoading(true)
		axios
			.post(`${process.env.REACT_APP_BASE_URL}users/recoverPassword`, {
				reset,
				newPassword,
				confirmPassword
			})
			.then(() => {
				toast.success("Password changed!")
				setLoading(false)
				history.push("/login")
			})
			.catch((error) => {
				let errorMsg = ""
				const { status } = error.response
				const { errors } = error.response.data

				if (status === 401) {
					errorMsg = error.response.data.message
				} else {
					if (typeof errors.newPassword !== "undefined") {
						errorMsg = errors.newPassword[0]
					}

					if (typeof errors.confirmPassword !== "undefined") {
						errorMsg = errors.confirmPassword[0]
					}
				}

				toast.error(errorMsg)
				setLoading(false)
			})
	}

	const onChangeConfirmPassword = (e, { value }) => {
		setConfirmPassword(value)
	}

	const onChangeNewPassword = (e, { value }) => {
		setNewPassword(value)
	}

	return (
		<DefaultLayout
			activeItem="forgot"
			containerClassName="forgotPage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="forgot" />

			<Container style={{ padding: 0 }} text>
				{validCode && (
					<>
						<Header
							as="h1"
							className="massive"
							content="Reset your password"
							inverted={inverted}
							style={{ marginTop: 40 }}
							textAlign="center"
						/>
						<Card className={inverted ? "inverted" : null} fluid>
							<Card.Content>
								<Form inverted={inverted} size="large">
									<Form.Field>
										<label>New password</label>
										<Input
											fluid
											inverted={inverted}
											onChange={onChangeNewPassword}
											placeholder="New password"
											type="password"
											value={newPassword}
										/>
									</Form.Field>
									<Form.Field>
										<label>Confirm password</label>
										<Input
											fluid
											inverted={inverted}
											onChange={onChangeConfirmPassword}
											placeholder="Retype new password"
											type="password"
											value={confirmPassword}
										/>
									</Form.Field>
									<Form.Field>
										<Button
											color="blue"
											content="Change"
											fluid
											loading={loading}
											onClick={() => resetPassword()}
											size="large"
										/>
									</Form.Field>
								</Form>
							</Card.Content>
						</Card>
					</>
				)}
			</Container>
		</DefaultLayout>
	)
}

Forgot.propTypes = {
	history: PropTypes.object
}

export default Forgot
