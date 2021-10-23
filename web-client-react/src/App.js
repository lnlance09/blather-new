import "react-toastify/dist/ReactToastify.css"
import "./semantic/dist/semantic.min.css"
import "./scss/app.scss"
import { Route, Router, Switch } from "react-router-dom"
import About from "pages/about/"
import Activity from "pages/activity"
import Arguments from "pages/arguments/"
import Assign from "pages/assign"
import Contact from "pages/about/contact"
import Fallacy from "pages/fallacies/show"
import Forgot from "pages/auth/forgot"
import Grifters from "pages/grifters"
import history from "history.js"
import Login from "pages/auth/"
import NotFound from "pages/notFound"
import Page from "pages/pages/show"
import Privacy from "pages/about/privacy"
import Reference from "pages/reference"
import Rules from "pages/about/rules"
import ScrollToTop from "react-router-scroll-top"
import Search from "pages/search"
import Settings from "pages/users/settings"
import ThemeProvider from "components/ThemeProvider"
import Tweet from "pages/tweets/show"
import User from "pages/users/show"
import Video from "pages/videos/show"

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

							<Route
								exact
								path="/assign"
								render={(props) => (
									<Assign key={window.location.pathname} {...props} />
								)}
							/>

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

							<Route component={Login} exact path="/auth" />

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
								path="/search"
								render={(props) => (
									<Search key={window.location.pathname} {...props} />
								)}
							/>

							<Route component={Settings} exact path="/settings" />

							<Route
								path="/tweets/:id"
								render={(props) => (
									<Tweet key={window.location.pathname} {...props} />
								)}
							/>

							<Route
								exact
								path="/:username"
								render={(props) => (
									<User key={window.location.pathname} {...props} />
								)}
							/>

							<Route
								path="/videos/:id"
								render={(props) => (
									<Video key={window.location.pathname} {...props} />
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
