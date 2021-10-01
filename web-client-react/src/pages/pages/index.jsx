import {
	Button,
	Card,
	Divider,
	Header,
	Icon,
	Image,
	Label,
	List,
	Loader,
	Segment
} from "semantic-ui-react"
import { useContext, useEffect, useReducer } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { RedditShareButton, TwitterShareButton } from "react-share"
import { getConfig } from "options/toast"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { dateDiff } from "utils/dateFunctions"
import { setIconColor, setIconName } from "utils/textFunctions"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/page"
import logger from "use-reducer-logger"
import moment from "moment"
import Moment from "react-moment"
import NumberFormat from "react-number-format"
import PlaceholderPic from "images/images/image-square.png"
import PropTypes from "prop-types"
import reducer from "reducers/page"
import ThemeContext from "themeContext"
import UserPic from "images/avatar/large/steve.jpg"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Page = ({ history, match }) => {
	const { dispatch, state } = useContext(ThemeContext)
	const { inverted } = state
	const { slug } = match.params
	const params = new URLSearchParams(window.location.search)
	const clear = params.get("clear")

	const [internalState, dispatchInternal] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { loaded, prediction } = internalState

	useEffect(() => {
		const getPrediction = async (slug) => {
			await axios
				.get(`${process.env.REACT_APP_BASE_URL}predictions/${slug}`)
				.then(async (response) => {
					const prediction = response.data.data
					dispatchInternal({
						type: "GET_PREDICTION",
						prediction
					})
				})
				.catch(() => {
					toast.error("There was an error")
				})
		}

		if (clear === "1") {
			clearNotification(slug)
		}

		getPrediction(slug)
		// eslint-disable-next-line
	}, [slug])

	const clearNotification = (slug) => {
		dispatch({
			type: "CLEAR_NOTIFICATION",
			id: parseInt(slug, 10)
		})
	}

	const { coin, createdAt, currentPrice, predictionPrice, status, targetDate, user } = prediction
	const showCardPic = status === "Correct" && user.predictionsReserved
	const title = loaded
		? `${coin.symbol} to ${predictionPrice} on ${moment(targetDate).format("MMM D, YYYY")}`
		: ""

	return (
		<DefaultLayout
			activeItem="search"
			containerClassName="socialMediaPage"
			history={history}
			inverted={inverted}
		>
			<DisplayMetaTags page="page" state={internalState} />
			{loaded ? (
				<></>
			) : (
				<div className="centeredLoader">
					<Loader active inverted={inverted} size="big" />
				</div>
			)}
		</DefaultLayout>
	)
}

Page.propTypes = {
	history: PropTypes.object,
	match: PropTypes.object
}

export default Page
