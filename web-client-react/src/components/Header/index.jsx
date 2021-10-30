import "./style.scss"
import { Button, Container, Dropdown, Icon, Image, Label, Menu, Sidebar } from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { ReactSVG } from "react-svg"
import defaultImg from "images/avatar/small/veronika.jpg"
// import Echo from "laravel-echo"
import initialState from "./state"
import logger from "use-reducer-logger"
import Logo from "images/logos/brain.svg"
import NumberFormat from "react-number-format"
import PropTypes from "prop-types"
import reducer from "./reducer"
import ThemeContext from "themeContext"

window.Pusher = require("pusher-js")

const PageHeader = ({ activeItem, history, q, simple }) => {
	const { state, dispatch } = useContext(ThemeContext)
	const { auth, inverted, notifications, user } = state

	const username = auth ? user.username : "anonymous"
	const { contradictionsCount, fallaciesCount, targetsCount } = user

	// eslint-disable-next-line
	const [internalState, dispatchInternal] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const [sidebarVisible, setSidebarVisible] = useState(false)

	useEffect(() => {
		/*
		if (typeof window.Echo === "undefined") {
			if (auth) {
				window.Echo = new Echo({
					auth: {
						headers: {
							Authorization: `Bearer ${bearer}`
						}
					},
					authEndpoint: "http://localhost/broadcasting/auth",
					broadcaster: "pusher",
					cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
					key: process.env.REACT_APP_PUSHER_APP_KEY,
					forceTLS: true
				})

				window.Echo.private(`users.${user.id}`).listen("ApplicationSent", (e) => {
					incrementNotification()
				})
			} else {
				window.Echo = new Echo({
					broadcaster: "pusher",
					cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
					key: process.env.REACT_APP_PUSHER_APP_KEY,
					forceTLS: true
				})
			}

			window.Echo.channel("publicPredictions").listen("PredictionCreated", (e) => {
				const { prediction } = e
				addNotification(prediction)
			})
		}
		*/
		// eslint-disable-next-line
	}, [])

	// eslint-disable-next-line
	const addNotification = (prediction) => {
		dispatch({
			type: "SET_NOTIFICATIONS",
			prediction
		})
	}

	const clearAllNotifications = () => {
		localStorage.removeItem("notifications")
		dispatch({
			type: "CLEAR_ALL_NOTIFICATIONS"
		})
	}

	// eslint-disable-next-line
	const incrementNotification = () => {
		dispatch({
			type: "INCREMENT_UNREAD_COUNT"
		})
	}

	const logout = () => {
		localStorage.removeItem("auth")
		localStorage.removeItem("bearer")
		localStorage.removeItem("unreadCount")
		localStorage.removeItem("user")
		localStorage.removeItem("verify")
		// window.Echo.leave(`users.${user.id}`)
		dispatch({
			type: "LOGOUT"
		})
	}

	const BellDropdown = (
		<Dropdown
			className={`bellDropdown ${inverted ? "inverted" : null}`}
			direction="right"
			icon={false}
			trigger={
				<div className="trigger item">
					<Icon circular color="yellow" inverted name="bell" />
					{notifications.length > 0 && (
						<div className="top floating ui red label small">
							{notifications.length}
						</div>
					)}
				</div>
			}
		>
			<Dropdown.Menu>
				{notifications.length === 0 ? (
					<>
						<Dropdown.Item>
							<Dropdown.Header>You're all up to date!</Dropdown.Header>
						</Dropdown.Item>
					</>
				) : (
					<>
						<div style={{ maxHeight: 360, overflowY: "scroll" }}>
							{notifications.map((item, i) => {
								return (
									<Dropdown.Item
										className="paddedDropdownItem"
										key={`${item.id}${i}`}
										onClick={() =>
											history.push(`/predictions/${item.id}?clear=1`)
										}
										value={item.id}
									>
										<Image avatar src={item.coin.logo} />
										<div style={{ marginLeft: 8, display: "inline-block" }}>
											{item.user.username} predicted ${item.coin.symbol} at{" "}
											<NumberFormat
												decimalScale={item.predictionPrice > 1 ? 2 : 6}
												displayType={"text"}
												prefix={"$"}
												thousandSeparator
												value={item.predictionPrice}
											/>
										</div>
									</Dropdown.Item>
								)
							})}
						</div>
						<>
							<Dropdown.Divider />
							<Dropdown.Header>
								<Button
									color="red"
									compact
									content="Clear all"
									onClick={clearAllNotifications}
									style={{ marginBottom: 7 }}
								/>
							</Dropdown.Header>
						</>
					</>
				)}
			</Dropdown.Menu>
		</Dropdown>
	)

	const ProfileDropdown = (
		<Dropdown
			className={`profileDropdown ${auth ? "auth" : ""}`}
			icon={false}
			trigger={
				<Image
					circular
					inline
					onError={(i) => (i.target.src = defaultImg)}
					size="mini"
					src={user.image ? user.image : defaultImg}
				/>
			}
		>
			<Dropdown.Menu>
				<Dropdown.Item onClick={() => history.push(`/${username}?tab=fallacies`)}>
					Fallacies
					{fallaciesCount > 0 && (
						<Label color="red" horizontal>
							{fallaciesCount}
						</Label>
					)}
				</Dropdown.Item>
				<Dropdown.Item onClick={() => history.push(`/${username}?tab=contradictions`)}>
					Contradictions
					{contradictionsCount > 0 && (
						<Label color="red" horizontal>
							{contradictionsCount}
						</Label>
					)}
				</Dropdown.Item>
				<Dropdown.Item onClick={() => history.push(`/${username}?tab=targets`)}>
					Targets
					{targetsCount > 0 && (
						<Label color="red" horizontal>
							{targetsCount}
						</Label>
					)}
				</Dropdown.Item>

				{auth && (
					<>
						<Dropdown.Divider />
						<Dropdown.Item onClick={() => history.push(`/${username}/settings`)}>
							Settings
						</Dropdown.Item>
					</>
				)}

				<Dropdown.Divider />

				{auth ? (
					<Dropdown.Item onClick={logout}>Sign Out</Dropdown.Item>
				) : (
					<Dropdown.Item onClick={() => history.push("/auth")}>Sign In</Dropdown.Item>
				)}
			</Dropdown.Menu>
		</Dropdown>
	)

	return (
		<div className="pageHeaderComponent">
			{simple ? (
				<Container className="basicHeaderContainer" fluid textAlign="center">
					<ReactSVG className="simpleLogo" onClick={() => history.push("/")} src={Logo} />
				</Container>
			) : (
				<Menu borderless fixed="top" fluid inverted>
					<Container className="desktop">
						<Menu.Item className="logoItem">
							<ReactSVG
								className="simpleLogo"
								onClick={() => history.push("/")}
								src={Logo}
							/>
						</Menu.Item>
						<Menu.Item
							active={activeItem === "activity"}
							onClick={() => {
								history.push("/activity")
							}}
						>
							Activity
						</Menu.Item>
						<Menu.Item
							active={activeItem === "tweets"}
							onClick={() => {
								history.push("/tweets")
							}}
						>
							Tweets
						</Menu.Item>
						<Menu.Item
							active={activeItem === "grifters"}
							onClick={() => history.push("/grifters")}
						>
							Grifters
						</Menu.Item>
						<Menu.Item
							active={activeItem === "groups"}
							onClick={() => history.push("/groups")}
						>
							Groups
						</Menu.Item>
						<Menu.Item
							active={activeItem === "arguments"}
							onClick={() => history.push("/arguments")}
						>
							Args
						</Menu.Item>
						<Menu.Item
							active={activeItem === "reference"}
							onClick={() => history.push("/reference")}
						>
							Ref
						</Menu.Item>
						<Menu.Item position="right">
							<div className="iconsWrapper">
								<Icon
									circular
									className="tweetsIcon"
									inverted
									name="twitter"
									onClick={() => history.push("/tweets/saved")}
								/>
								<Icon
									circular
									className="searchIcon"
									color="red"
									inverted
									name="search"
									onClick={() => history.push("/search")}
								/>
								{BellDropdown}
							</div>
							{ProfileDropdown}
						</Menu.Item>
					</Container>

					<Container className="mobile">
						<Menu.Item className="logoItem">
							<ReactSVG
								className="simpleLogo"
								onClick={() => history.push("/")}
								src={Logo}
							/>
						</Menu.Item>
						<Menu.Item position="right">
							{BellDropdown}
							<Icon
								color={sidebarVisible ? "green" : null}
								inverted
								name="ellipsis horizontal"
								onClick={() => setSidebarVisible(!sidebarVisible)}
								size="big"
							/>
						</Menu.Item>
					</Container>
				</Menu>
			)}

			<Sidebar
				as={Menu}
				direction="bottom"
				icon="labeled"
				inverted={inverted}
				onHide={() => setSidebarVisible(false)}
				size="massive"
				style={{ textAlign: "left" }}
				vertical
				visible={sidebarVisible}
			>
				<Menu.Item as="a" onClick={() => history.push("/activity")}>
					Activity
				</Menu.Item>
				{auth ? (
					<>
						<Menu.Item as="a" onClick={() => history.push(`/${user.username}`)}>
							🌞 Profile
						</Menu.Item>
						<Menu.Item as="a" onClick={() => history.push("/settings")}>
							⚙️ Settings
						</Menu.Item>
					</>
				) : (
					<Menu.Item as="a" onClick={() => history.push("/login")}>
						👉 Sign In
					</Menu.Item>
				)}
			</Sidebar>
		</div>
	)
}

PageHeader.propTypes = {
	activeItem: PropTypes.string,
	history: PropTypes.object,
	q: PropTypes.string,
	simple: PropTypes.bool,
	toggleSearchMode: PropTypes.func
}

PageHeader.defaultProps = {
	activeItem: null,
	q: "",
	simple: false
}

export default PageHeader
