import "./style.scss"
import { Button, Container, Dropdown, Icon, Image, Menu, Sidebar } from "semantic-ui-react"
import { ReactSVG } from "react-svg"
import { useContext, useEffect, useReducer, useState } from "react"
import defaultImg from "images/images/image.png"
import Echo from "laravel-echo"
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
	const { auth, bearer, inverted, notifications, user } = state

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
			pointing="top"
			trigger={
				<div className="trigger item">
					<Icon circular color="yellow" name="bell" size="large" />
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
			className={`profileDropdown ${inverted ? "inverted" : null}`}
			icon={false}
			pointing="top"
			trigger={
				<>
					{user && (
						<>
							<span style={{ marginLeft: "12px", marginRight: "12px" }}>
								{user.name}
							</span>
							<Image
								avatar
								bordered
								onError={(i) => (i.target.src = defaultImg)}
								src={user.img}
							/>
						</>
					)}
				</>
			}
		>
			<Dropdown.Menu>
				<Dropdown.Item onClick={() => history.push(`/${user.username}`)}>
					Profile
				</Dropdown.Item>
				<Dropdown.Item onClick={() => history.push("/settings")}>Settings</Dropdown.Item>
				<Dropdown.Item onClick={() => history.push("/settings?tab=fallacies")}>
					Fallacies
				</Dropdown.Item>
				<Dropdown.Item onClick={() => history.push("/settings?tab=targets")}>
					Targets
				</Dropdown.Item>
				<Dropdown.Item onClick={() => history.push("/settings?tab=comments")}>
					Comments
				</Dropdown.Item>
				<Dropdown.Divider />
				<Dropdown.Item onClick={logout}>Sign Out</Dropdown.Item>
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
							active={activeItem === "arguments"}
							onClick={() => history.push("/arguments")}
						>
							Arguments
						</Menu.Item>
						<Menu.Item
							active={activeItem === "grifters"}
							onClick={() => history.push("/grifters")}
						>
							Grfiters
						</Menu.Item>
						<Menu.Item
							active={activeItem === "reference"}
							onClick={() => history.push("/reference")}
						>
							Reference
						</Menu.Item>
						<Menu.Item
							active={activeItem === "search"}
							onClick={() => history.push("/search")}
						>
							Search
						</Menu.Item>
						<Menu.Item position="right">
							{BellDropdown}
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
