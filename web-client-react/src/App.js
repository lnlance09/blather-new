import "react-toastify/dist/ReactToastify.css"
import "./semantic/dist/semantic.min.css"
import "./scss/app.scss"
import { Route, Router, Switch } from "react-router-dom"
import About from "pages/about/"
import Activity from "pages/activity"
import Argument from "pages/arguments/show"
import Arguments from "pages/arguments/"
import Assign from "pages/assign"
import Contact from "pages/about/contact"
import Fallacy from "pages/fallacies/show"
import Forgot from "pages/auth/forgot"
import Grifters from "pages/grifters"
import Groups from "pages/groups"
import history from "history.js"
import Login from "pages/auth/"
import Page from "pages/pages/show"
import Privacy from "pages/about/privacy"
import Reference from "pages/reference"
import Rules from "pages/about/rules"
import SavedTweets from "pages/savedTweets"
import ScrollToTop from "react-router-scroll-top"
import Search from "pages/search"
import Settings from "pages/users/settings"
import ThemeProvider from "components/ThemeProvider"
import Tweet from "pages/tweets/show"
import Tweets from "pages/tweets/"
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

							<Route
								exact
								path="/arguments"
								render={(props) => (
									<Arguments key={window.location.pathname} {...props} />
								)}
							/>

							<Route
								exact
								path="/arguments/:slug"
								render={(props) => (
									<Argument key={window.location.pathname} {...props} />
								)}
							/>

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

							<Route component={Groups} exact path="/groups" />

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

							<Route
								path="/tweet/:id"
								render={(props) => (
									<Tweet key={window.location.pathname} {...props} />
								)}
							/>

							<Route
								exact
								path="/tweets/saved"
								render={(props) => (
									<SavedTweets key={window.location.pathname} {...props} />
								)}
							/>

							<Route
								exact
								path="/tweets"
								render={(props) => (
									<Tweets key={window.location.pathname} {...props} />
								)}
							/>

							<Route
								path="/tweets/:id"
								render={(props) => (
									<Tweet key={window.location.pathname} {...props} />
								)}
							/>

							<Route
								path="/videos/:id"
								render={(props) => (
									<Video key={window.location.pathname} {...props} />
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
								exact
								path="/:username/settings"
								render={(props) => (
									<Settings key={window.location.pathname} {...props} />
								)}
							/>
						</Switch>
					</ScrollToTop>
				</ThemeProvider>
			</Router>
		</div>
	)
}

export default App
