import "react-toastify/dist/ReactToastify.css"
import "./semantic/dist/semantic.min.css"
import "./scss/app.scss"
import { Route, Router, Switch } from "react-router-dom"
import About from "pages/about"
import Activity from "pages/activity"
import Arguments from "pages/arguments"
import Assign from "pages/assign"
import Contact from "pages/contact"
import Fallacy from "pages/fallacies"
import Forgot from "pages/forgot"
import Grifters from "pages/grifters"
import history from "history.js"
import Login from "pages/login"
import NotFound from "pages/notFound"
import Page from "pages/pages"
import Privacy from "pages/privacy"
import Reference from "pages/reference"
import Rules from "pages/rules"
import ScrollToTop from "react-router-scroll-top"
import Search from "pages/search"
import Settings from "pages/settings"
import ThemeProvider from "components/ThemeProvider"
import User from "pages/users"

const App = () => {
	return (
		<div className="app">
			<Router history={history}>
				<ThemeProvider>
					<ScrollToTop>
						<Switch>
							<Route
								exact
								path="/"
								render={(props) => (
									<Assign key={window.location.pathname} {...props} />
								)}
							/>

							<Route component={About} exact path="/about" />

							<Route component={Activity} exact path="/activity" />

							<Route component={Arguments} exact path="/arguments" />

							<Route component={Contact} exact path="/contact" />

							<Route
								exact
								path="/fallacies/:slug"
								render={(props) => (
									<Fallacy key={window.location.pathname} {...props} />
								)}
							/>

							<Route
								exact
								path="/forgot"
								render={(props) => (
									<Forgot key={window.location.pathname} {...props} />
								)}
							/>

							<Route component={Grifters} exact path="/grifters" />

							<Route component={Login} exact path="/login" />

							<Route
								exact
								path="/pages/:network/:slug"
								render={(props) => (
									<Page key={window.location.pathname} {...props} />
								)}
							/>

							<Route component={Privacy} exact path="/privacy" />

							<Route component={Reference} exact path="/reference" />

							<Route component={Rules} exact path="/rules" />

							<Route
								exact
								path="/search"
								render={(props) => (
									<Search key={window.location.pathname} {...props} />
								)}
							/>

							<Route
								exact
								path="/search/:type"
								render={(props) => (
									<Search key={window.location.pathname} {...props} />
								)}
							/>

							<Route
								exact
								path="/search/:item"
								render={(props) => (
									<Search key={window.location.pathname} {...props} />
								)}
							/>

							<Route component={Settings} exact path="/settings" />

							<Route
								exact
								path="/:username"
								render={(props) => (
									<User key={window.location.pathname} {...props} />
								)}
							/>

							<Route path="*" render={(props) => <NotFound {...props} />} />
						</Switch>
					</ScrollToTop>
				</ThemeProvider>
			</Router>
		</div>
	)
}

export default App
