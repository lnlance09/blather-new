import { createContext } from "react"

const ThemeContext = createContext({
	dispatch: () => {},
	inverted: false,
	state: {},
	toggleInverted: () => {}
})

export default ThemeContext
