import {
	Button,
	Card,
	Form,
	Grid,
	Header,
	Icon,
	Input,
	Loader,
	Menu,
	Message,
	Segment,
	TextArea
} from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { DebounceInput } from "react-debounce-input"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/settings"
import logger from "use-reducer-logger"
import Moment from "react-moment"
import PropTypes from "prop-types"
import reducer from "reducers/settings"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const defaultBio = "Apparently, this trader prefers to keep an air of mystery about them."

const Settings = ({ history, match }) => {
	const { state } = useContext(ThemeContext)
	const { auth, bearer, inverted, user } = state
	const { username } = match.params

	const params = new URLSearchParams(window.location.search)
	const tab = params.get("tab")
	const tabs = ["profile_info", "password", "twitter"]

	const [internalState, dispatchInternal] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)

	const { twitter, twitterLinked, twitterLoaded } = internalState

	const [activeItem, setActiveItem] = useState(!tabs.includes(tab) ? "profile_info" : tab)
	const [bio, setBio] = useState(user.bio === defaultBio ? "" : user.bio)
	const [confirmPassword, setConfirmPassword] = useState("")
	const [currentPassword, setCurrentPassword] = useState("")
	const [loadingTwitter, setLoadingTwitter] = useState(false)
	const [newPassword, setNewPassword] = useState("")
	const [newUsername, setNewUsername] = useState(user.username)
	const [usernameAvailable, setUsernameAvailable] = useState(true)
	const [usernameErrorMsg, setUsernameErrorMsg] = useState("That username is available")

	useEffect(() => {
		if (!auth || (auth && username !== user.username)) {
			history.push("/")
			return
		}
		// eslint-disable-next-line
	}, [auth])

	useEffect(() => {
		setActiveItem(!tabs.includes(tab) ? "profile_info" : tab)

		if (tab === "twitter") {
			getTwitterInfo()
		}
		// eslint-disable-next-line
	}, [tab])

	const getRequestToken = () => {
		setLoadingTwitter(true)
		axios
			.get(`${process.env.REACT_APP_BASE_URL}users/twitterRequestToken`)
			.then((response) => {
				const { data } = response
				localStorage.setItem("requestTokenSecret", data.secret)
				localStorage.setItem("requestToken", data.token)
				window.location.href = data.url
			})
			.catch(() => {})
	}

	const changePassword = () => {
		axios
			.post(
				`${process.env.REACT_APP_BASE_URL}users/changePassword`,
				{ currentPassword, newPassword, confirmPassword },
				{
					headers: {
						Authorization: `Bearer ${bearer}`
					}
				}
			)
			.then(async (response) => {
				toast.success("Password changed!")
				setCurrentPassword("")
				setNewPassword("")
				setConfirmPassword("")
			})
			.catch((error) => {
				let errorMsg = ""
				const { errors } = error.response.data

				if (typeof errors.currentPassword !== "undefined") {
					errorMsg = errors.currentPassword[0]
				}

				if (typeof errors.newPassword !== "undefined") {
					errorMsg = errors.newPassword[0]
				}

				if (typeof errors.confirmPassword !== "undefined") {
					errorMsg = errors.confirmPassword[0]
				}

				toast.error(errorMsg)
			})
	}

	const checkUsername = (username) => {
		axios
			.post(
				`${process.env.REACT_APP_BASE_URL}users/checkUsername`,
				{ username },
				{
					headers: {
						Authorization: `Bearer ${bearer}`
					}
				}
			)
			.then(() => {
				setUsernameAvailable(true)
				setUsernameErrorMsg("That username is available")
			})
			.catch((error) => {
				let errorMsg = ""
				const { errors } = error.response.data
				if (typeof errors.username !== "undefined") {
					errorMsg = errors.username[0]
				}

				setUsernameErrorMsg(errorMsg)
				setUsernameAvailable(false)
			})
	}

	const getTwitterInfo = () => {
		axios
			.get(`${process.env.REACT_APP_BASE_URL}users/getTwitterInfo`, {
				headers: {
					Authorization: `Bearer ${bearer}`
				}
			})
			.then(async (response) => {
				const twitter = response.data
				dispatchInternal({
					type: "SET_TWITTER_INFO",
					twitter
				})
			})
			.catch(() => {
				dispatchInternal({
					type: "SET_TWITTER_ERROR"
				})
				console.error("Error fetching Twitter info")
			})
	}

	const updateUser = (params, successMsg) => {
		axios
			.post(`${process.env.REACT_APP_BASE_URL}users/update`, params, {
				headers: {
					Authorization: `Bearer ${bearer}`
				}
			})
			.then(async () => {
				const user = JSON.parse(localStorage.getItem("user"))
				const newUser = {
					...user,
					...params
				}
				localStorage.setItem("user", JSON.stringify(newUser))
				toast.success(successMsg)
			})
			.catch((error) => {
				let errorMsg = ""
				const { status } = error.response
				const { errors } = error.response.data

				if (status === 401) {
					errorMsg = error.response.data.message
				} else {
					if (typeof errors.username !== "undefined") {
						errorMsg = errors.username[0]
					}
				}

				toast.error(errorMsg)
			})
	}

	const onChangeBio = (e, { value }) => {
		setBio(value)
	}

	const onChangeConfirmPassword = (e, { value }) => {
		setConfirmPassword(value)
	}

	const onChangeCurrentPassword = (e, { value }) => {
		setCurrentPassword(value)
	}

	const onChangeNewPassword = (e, { value }) => {
		setNewPassword(value)
	}

	const onChangeUsername = (e) => {
		const value = e.target.value
		setNewUsername(value)
		checkUsername(value)
	}

	return (
		<DefaultLayout
			activeItem="settings"
			containerClassName={`settingsPage ${inverted ? "inverted" : ""}`}
			history={history}
		>
			<DisplayMetaTags page="settings" />

			<Header as="h1" inverted={inverted}>
				Settings
			</Header>

			<Segment basic className="settingsSegment" inverted={inverted}>
				<Grid inverted={inverted} stackable>
					<Grid.Column width={4}>
						<Menu borderless className="big" fluid inverted={inverted} vertical>
							<Menu.Item
								active={activeItem === "profile_info"}
								name="profile info"
								onClick={() => {
									history.push(`/${user.username}/settings?tab=profile_info`)
								}}
							/>
							<Menu.Item
								active={activeItem === "password"}
								name="password"
								onClick={() => {
									history.push(`/${user.username}/settings?tab=password`)
								}}
							/>
							<Menu.Item
								active={activeItem === "twitter"}
								name="twitter"
								onClick={() => {
									history.push(`/${user.username}/settings?tab=twitter`)
								}}
							/>
						</Menu>
					</Grid.Column>
					<Grid.Column width={12}>
						{activeItem === "profile_info" && (
							<>
								<Header content="Update bio" inverted={inverted} />
								<Card className={inverted ? "inverted" : ""} fluid>
									<Card.Content>
										<Form inverted={inverted}>
											<Form.Field>
												<TextArea
													onChange={onChangeBio}
													placeholder="Tell us about yourself..."
													value={bio}
												/>
											</Form.Field>
											<Button
												color="blue"
												content="Update"
												fluid
												onClick={() =>
													updateUser({ bio }, "Your bio has been updated")
												}
											/>
										</Form>
									</Card.Content>
								</Card>

								<Header content="Change username" inverted={inverted} />

								<Card className={inverted ? "inverted" : ""} fluid>
									<Card.Content>
										<Form inverted={inverted}>
											<Form.Group style={{ marginBottom: 0 }}>
												<Form.Field width={12}>
													<div
														className={`ui labeled input fluid ${
															inverted ? "inverted" : ""
														}`}
													>
														<div className={`ui basic label`}>@</div>
														<DebounceInput
															debounceTimeout={800}
															minLength={1}
															onChange={onChangeUsername}
															placeholder="Pick a username"
															value={newUsername}
														/>
													</div>
												</Form.Field>
												<Form.Field width={4}>
													<Button
														color="blue"
														content="Change"
														disabled={
															!usernameAvailable || newUsername === ""
														}
														fluid
														onClick={() =>
															updateUser(
																{ username: newUsername },
																"Username updated"
															)
														}
													/>
												</Form.Field>
											</Form.Group>
										</Form>
									</Card.Content>
								</Card>

								<Message
									className={inverted ? "inverted" : ""}
									error={!usernameAvailable}
									icon
									success={usernameAvailable}
								>
									<Icon
										name={usernameAvailable ? "checkmark" : "warning sign"}
										style={{ fontSize: 28 }}
									/>
									<Message.Content>
										<Message.Header>{usernameErrorMsg}</Message.Header>
									</Message.Content>
								</Message>
							</>
						)}

						{activeItem === "password" && (
							<>
								<Header content="Change password" inverted={inverted} />
								<Card className={inverted ? "inverted" : ""} fluid>
									<Card.Content>
										<Form inverted={inverted}>
											<Form.Field>
												<label>Current password</label>
												<Input
													fluid
													inverted={inverted}
													onChange={onChangeCurrentPassword}
													placeholder="Current password"
													type="password"
													value={currentPassword}
												/>
											</Form.Field>
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
													onClick={() => changePassword()}
												/>
											</Form.Field>
										</Form>
									</Card.Content>
								</Card>
							</>
						)}

						{activeItem === "twitter" && (
							<>
								{twitterLoaded ? (
									<>
										{twitterLinked ? (
											<>
												<Header inverted={inverted}>
													You linked your{" "}
													<a
														href={`https://twitter.com/${twitter.username}`}
														target="_blank"
														rel="noreferrer"
													>
														Twitter account
													</a>{" "}
													on{" "}
													<Moment date={twitter.createdAt} format="lll" />
												</Header>
												<Form inverted={inverted}>
													<Form.Field>
														<label>Token</label>
														<Input
															fluid
															readOnly
															value={twitter.token}
														/>
													</Form.Field>
													<Form.Field>
														<label>Secret</label>
														<Input
															fluid
															readOnly
															value={twitter.secret}
														/>
													</Form.Field>
												</Form>
											</>
										) : (
											<>
												<Button
													color="twitter"
													content="Link your Twitter"
													fluid
													icon="twitter"
													loading={loadingTwitter}
													onClick={getRequestToken}
													size="large"
												/>
											</>
										)}
									</>
								) : (
									<div className="centeredLoader">
										<Loader active inverted={inverted} size="big" />
									</div>
								)}
							</>
						)}
					</Grid.Column>
				</Grid>
			</Segment>
		</DefaultLayout>
	)
}

Settings.propTypes = {
	history: PropTypes.object
}

export default Settings
