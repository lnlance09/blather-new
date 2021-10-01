import { Divider, Header } from "semantic-ui-react"
import { useContext } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { Link } from "react-router-dom"
import DefaultLayout from "layouts/default"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const Rules = ({ history }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state

	return (
		<DefaultLayout
			activeItem="rules"
			containerClassName="rulesPage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="rules" />

			<Header as="h1" content="Rules" inverted={inverted} />

			<Header as="h2" content="Edits" inverted={inverted} />
			<Header as="p" inverted={inverted}>
				Predictions cannot be edited after they have been submitted. This is meant to
				prevent people from trying to save face after one of their predictions fails to
				materialize.
			</Header>

			<Header as="h2" content="Timing" inverted={inverted} />
			<Header as="p" inverted={inverted}>
				At the very least, predictions must be made one day in advance. Predictions are
				corrected four times per day or every six hours. If a coin's price is within margin
				of what you predicted at any one of those four times, the prediction will be deemed
				correct.
			</Header>

			<Header as="h2" content="Margin of error" inverted={inverted} />
			<Header as="p" inverted={inverted}>
				Price predictions that come within 5% of the actual price of the given coin on the
				given date are deemed accurate or correct.
			</Header>

			<Header as="h2" content="Stablecoins" inverted={inverted} />
			<Header as="p" inverted={inverted}>
				For reasons that should be fairly obvious, predictions about stablecoins cannot be
				made.
			</Header>

			<Header as="h2" content="Wallets" inverted={inverted} />
			<Header as="p" inverted={inverted}>
				You can use your own wallet address or create a new{" "}
				<Link to="/wallet/create">Ethereum wallet</Link> to start getting paid for your
				crypto analysis.
			</Header>

			<Divider hidden />
		</DefaultLayout>
	)
}

Rules.propTypes = {
	history: PropTypes.object
}

export default Rules
