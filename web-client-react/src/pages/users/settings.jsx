import {
	Button,
	Card,
	Divider,
	Form,
	Grid,
	Header,
	Icon,
	Input,
	Label,
	List,
	Menu,
	Message,
	Segment,
	TextArea
} from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { DebounceInput } from "react-debounce-input"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import fileDownload from "js-file-download"
import initialState from "states/settings"
import logger from "use-reducer-logger"
import Moment from "react-moment"
import PropTypes from "prop-types"
import reducer from "reducers/settings"
import ThemeContext from "themeContext"
import validator from "validator"

const toastConfig = getConfig()
toast.configure(toastConfig)

const defaultBio = "Apparently, this trader prefers to keep an air of mystery about them."

const Settings = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { auth, bearer, inverted, user } = state

	const [internalState, dispatchInternal] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { wallets } = internalState

	const params = new URLSearchParams(window.location.search)
	const tab = params.get("tab")
	const tabs = ["profile_info", "password", "wallets"]

	const [activeItem, setActiveItem] = useState(!tabs.includes(tab) ? "profile_info" : tab)
	const [address, setAddress] = useState("")
	const [bio, setBio] = useState(user.bio === defaultBio ? "" : user.bio)
	const [confirmPassword, setConfirmPassword] = useState("")
	const [createMode, setCreateMode] = useState(false)
	const [currentPassword, setCurrentPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [useDisabled, setUseDisabled] = useState(false)
	const [username, setUsername] = useState(user.username)
	const [usernameAvailable, setUsernameAvailable] = useState(true)
	const [usernameErrorMsg, setUsernameErrorMsg] = useState("That username is available")
	const [walletAddress, setWalletAddress] = useState("")
	const [walletPrivateKey, setWalletPrivateKey] = useState("")
	const [walletPublicKey, setWalletPublicKey] = useState("")

	useEffect(() => {
		if (!auth) {
			history.push("/")
			return
		}

		getWallets()
		// eslint-disable-next-line
	}, [auth])

	useEffect(() => {
		setActiveItem(!tabs.includes(tab) ? "profile_info" : tab)
		// eslint-disable-next-line
	}, [tab])

	const addWallet = async (address) => {
		return await axios
			.post(
				`${process.env.REACT_APP_BASE_URL}users/wallet`,
				{ address },
				{
					headers: {
						Authorization: `Bearer ${bearer}`
					}
				}
			)
			.then((response) => {
				dispatchInternal({
					type: "SET_WALLETS",
					wallets: response.data.data
				})
				toast.success("Wallet added")
				return true
			})
			.catch((error) => {
				let errorMsg = ""
				const { errors } = error.response.data
				if (typeof errors.address !== "undefined") {
					errorMsg = errors.address[0]
				}

				toast.error(errorMsg)
				return false
			})
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

	const createWallet = () => {
		axios
			.post(`${process.env.REACT_APP_BASE_URL}wallet/create`)
			.then(async (response) => {
				const { address, privateKey, publicKey } = response.data.wallet
				setWalletAddress(address)
				setWalletPrivateKey(privateKey)
				setWalletPublicKey(publicKey)

				const content = `address: ${address} \npublic key: ${publicKey} \nprivate key: ${privateKey}`
				fileDownload(content, `ether-wallet-${address}-recovery.txt`)

				toast.success("Wallet successfully created!")
			})
			.catch((error) => {
				toast.error("Error create new wallet")
			})
	}

	const getWallets = () => {
		axios
			.get(`${process.env.REACT_APP_BASE_URL}users/wallets`, {
				headers: {
					Authorization: `Bearer ${bearer}`
				}
			})
			.then((response) => {
				dispatchInternal({
					type: "SET_WALLETS",
					wallets: response.data.data
				})
			})
			.catch((error) => {
				toast.error(error.response.data.message)
			})
	}

	const makePrimary = (address) => {
		axios
			.post(
				`${process.env.REACT_APP_BASE_URL}wallet/primary`,
				{ address },
				{
					headers: {
						Authorization: `Bearer ${bearer}`
					}
				}
			)
			.then(() => {
				getWallets()
				window.scroll({ top: 0, behavior: "smooth" })
				toast.success("Made your primary wallet!")
			})
			.catch((error) => {
				console.error(error)
			})
	}

	const updateUser = (params, successMsg) => {
		axios
			.post(`${process.env.REACT_APP_BASE_URL}users/update`, params, {
				headers: {
					Authorization: `Bearer ${bearer}`
				}
			})
			.then(async (response) => {
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

	const onChangeAddress = (e, { value }) => {
		setAddress(value)
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
		setUsername(value)
		checkUsername(value)
	}

	return (
		<DefaultLayout
			activeItem="settings"
			containerClassName={`settingsPage ${inverted ? "inverted" : null}`}
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="settings" />

			<Header as="h1" inverted={inverted}>
				Settings
			</Header>

			<Segment basic className="settingsSegment" inverted={inverted}>
				<Grid inverted={inverted} relaxed="very" stackable>
					<Grid.Column width={4}>
						<Menu className="big" fluid inverted={inverted} secondary vertical>
							<Menu.Item
								active={activeItem === "profile_info"}
								name="profile info"
								onClick={() => {
									history.push("/settings?tab=profile_info")
								}}
							/>
							<Menu.Item
								active={activeItem === "password"}
								name="password"
								onClick={() => {
									history.push("/settings?tab=password")
								}}
							/>
							<Menu.Item
								active={activeItem === "wallets"}
								name="wallets"
								onClick={() => {
									history.push("/settings?tab=wallets")
								}}
							>
								Wallets
								{wallets.length > 0 && <Label color="red">{wallets.length}</Label>}
							</Menu.Item>
						</Menu>
					</Grid.Column>
					<Grid.Column width={12}>
						{activeItem === "profile_info" && (
							<>
								<Header content="Update bio" inverted={inverted} />
								<Card className={inverted ? "inverted" : null} fluid>
									<Card.Content>
										<Form inverted={inverted} size="large">
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
												size="large"
											/>
										</Form>
									</Card.Content>
								</Card>

								<Header content="Change username" inverted={inverted} />
								<Card className={inverted ? "inverted" : null} fluid>
									<Card.Content>
										<Form inverted={inverted} size="large">
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
															value={username}
														/>
													</div>
												</Form.Field>
												<Form.Field width={4}>
													<Button
														color="blue"
														content="Change"
														disabled={
															!usernameAvailable || username === ""
														}
														fluid
														onClick={() =>
															updateUser(
																{ username },
																"Username updated"
															)
														}
														size="large"
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
								<Card className={inverted ? "inverted" : null} fluid>
									<Card.Content>
										<Form inverted={inverted} size="large">
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
													size="large"
												/>
											</Form.Field>
										</Form>
									</Card.Content>
								</Card>
							</>
						)}

						{activeItem === "wallets" && (
							<>
								<Header inverted={inverted}>Add an existing wallet</Header>
								<Card className={inverted ? "inverted" : null} fluid>
									<Card.Content>
										<Form inverted={inverted} size="large">
											<Form.Group style={{ marginBottom: 0 }}>
												<Form.Field width={12}>
													<Input
														fluid
														icon="ethereum"
														iconPosition="left"
														onChange={onChangeAddress}
														placeholder="Enter an Ethereum address"
														value={address}
													/>
												</Form.Field>
												<Form.Field width={4}>
													<Button
														color="green"
														content="Add"
														disabled={
															!validator.isEthereumAddress(address)
														}
														fluid
														icon="plus"
														onClick={async () => {
															const add = await addWallet(address)
															console.log("add", add)
															if (add) {
																setAddress("")
															}
														}}
														size="large"
													/>
												</Form.Field>
											</Form.Group>
										</Form>
									</Card.Content>
								</Card>

								<Divider hidden />

								<Header inverted={inverted}>Create a new wallet</Header>
								<Card className={inverted ? "inverted" : null} fluid>
									<Card.Content>
										<Form inverted={inverted} size="large">
											<Form.Field className="newWallet">
												<label>Address</label>
												<CopyToClipboard
													text={walletAddress}
													onCopy={() => toast.warn("Copied to clipboard")}
												>
													<Input
														disabled={!createMode}
														fluid
														icon="paperclip"
														iconPosition="left"
														readOnly
														value={walletAddress}
													/>
												</CopyToClipboard>
											</Form.Field>
											<Form.Field className="newWallet">
												<label>Public key</label>
												<CopyToClipboard
													text={walletAddress}
													onCopy={() => toast.warn("Copied to clipboard")}
												>
													<Input
														disabled={!createMode}
														fluid
														icon="paperclip"
														iconPosition="left"
														readOnly
														value={walletPublicKey}
													/>
												</CopyToClipboard>
											</Form.Field>
											<Form.Field className="newWallet">
												<label>Private key</label>
												<CopyToClipboard
													text={walletAddress}
													onCopy={() => toast.warn("Copied to clipboard")}
												>
													<Input
														disabled={!createMode}
														fluid
														icon="paperclip"
														iconPosition="left"
														readOnly
														value={walletPrivateKey}
													/>
												</CopyToClipboard>
											</Form.Field>
											<Form.Field>
												{createMode ? (
													<Button.Group fluid size="large">
														<Button
															color="green"
															content="Use this wallet"
															disabled={useDisabled}
															icon="checkmark"
															onClick={() => {
																addWallet(walletAddress)
																setUseDisabled(true)
															}}
														/>
														<Button.Or />
														<Button
															color="blue"
															content="Create another"
															icon="plus"
															onClick={() => {
																createWallet()
																setUseDisabled(false)
															}}
														/>
													</Button.Group>
												) : (
													<Button
														color="blue"
														content="Create a wallet"
														fluid
														icon="ethereum"
														onClick={() => {
															createWallet()
															setCreateMode(true)
															setUseDisabled(false)
														}}
														size="large"
													/>
												)}
											</Form.Field>
										</Form>
									</Card.Content>
								</Card>

								<Divider hidden section />

								<List divided inverted={inverted} relaxed="very" size="big">
									{wallets.map((item, i) => {
										return (
											<List.Item key={`wallet${i}`}>
												<List.Icon
													color="blue"
													inverted={inverted}
													name="ethereum"
													size="large"
													style={{ float: "left" }}
												/>
												{item.primary ? (
													<Button
														active
														content="Primary"
														color="orange"
														inverted={inverted}
														style={{ float: "right" }}
													/>
												) : (
													<Button
														className="makePrimary"
														color="green"
														content="Make Primary Wallet"
														onClick={() => makePrimary(item.address)}
														style={{ float: "right" }}
													/>
												)}

												<List.Content>
													<List.Header>{item.address}</List.Header>
													<List.Description>
														<Moment date={item.createdAt} fromNow /> •{" "}
														<a
															href={`https://etherscan.io/address/${item.address}`}
															target="_blank"
															rel="noreferrer"
														>
															view on etherscan
														</a>
													</List.Description>
												</List.Content>
											</List.Item>
										)
									})}
								</List>
							</>
						)}
					</Grid.Column>
				</Grid>
			</Segment>
			<Divider hidden section />
		</DefaultLayout>
	)
}

Settings.propTypes = {
	history: PropTypes.object
}

export default Settings
