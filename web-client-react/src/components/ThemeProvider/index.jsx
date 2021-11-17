import { useReducer } from "react"
import logger from "use-reducer-logger"
import ThemeContext from "themeContext"

let auth = localStorage.getItem("auth")
let bearer = localStorage.getItem("bearer")
let notifications = localStorage.getItem("notifications")
let unreadCount = localStorage.getItem("unreadCount")
let user = localStorage.getItem("user")
let verify = localStorage.getItem("verify")

const initialState = {
	auth: auth === null || auth === "false" ? false : true,
	bearer,
	inverted: false,
	notifications: notifications === null ? [] : JSON.parse(notifications),
	unreadCount,
	user: user === null ? {} : JSON.parse(user),
	verify: verify === null || verify === "false" ? false : true
}

const reducer = (state, action) => {
	const { data } = action

	switch (action.type) {
		case "CLEAR_ALL_NOTIFICATIONS":
			return {
				...state,
				notifications: []
			}
		case "CLEAR_NOTIFICATION":
			const removed = state.notifications.filter((item, i) => item.id !== action.id)
			localStorage.setItem("notifications", JSON.stringify(removed))

			return {
				...state,
				notifications: removed
			}
		case "DECREMENT_UNREAD_COUNT":
			return {
				...state,
				unreadCount: state.unreadCount - 1
			}
		case "INCREMENT_UNREAD_COUNT":
			return {
				...state,
				unreadCount: state.unreadCount + 1
			}
		case "LOGOUT":
			return {
				...state,
				auth: false,
				bearer: null,
				unreadCount: null,
				user: {},
				verify: false
			}
		case "SET_MESSAGES":
			return {
				...state
			}
		case "SET_NOTIFICATIONS":
			const notifications =
				state.notifications.length > 0
					? [action.prediction, ...state.notifications]
					: [action.prediction]
			localStorage.setItem("notifications", JSON.stringify(notifications))

			return {
				...state,
				notifications
			}
		case "SET_UNREAD_COUNT":
			return {
				...state,
				unreadCount: action.count
			}
		case "SET_USER_DATA":
			return {
				...state,
				auth: true,
				bearer: data.bearer,
				user: data.user,
				verify: data.verify
			}
		case "TOGGLE_INVERTED":
			return {
				...state,
				inverted: !state.inverted
			}
		case "VERIFY_EMAIL":
			return {
				...state,
				verify: false
			}
		default:
			throw new Error()
	}
}

const ThemeProvider = ({ children }) => {
	const [state, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)

	return <ThemeContext.Provider value={{ state, dispatch }}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
