import { Loader } from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import FallacyList from "components/FallacyList"
import initialState from "states/fallacy"
import logger from "use-reducer-logger"
import PropTypes from "prop-types"
import reducer from "reducers/fallacy"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Fallacy = ({ history, match }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state
	const { slug } = match.params

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { loaded } = internalState

	const [hasMore, setHasMore] = useState(false)
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [page, setPage] = useState(1)

	useEffect(() => {
		const getFallacy = async (slug) => {
			await axios
				.get(`${process.env.REACT_APP_BASE_URL}fallacies/${slug}`)
				.then(async (response) => {
					const fallacy = response.data.data
					dispatch({
						type: "GET_FALLACY",
						fallacy
					})
				})
				.catch(() => {
					toast.error("There was an error")
				})
		}

		getFallacy(slug)
	}, [slug])

	const getRelatedFallacies = async (coinId, page = 1) => {
		if (page === 1) {
			setLoading(true)
		} else {
			setLoadingMore(true)
		}

		await axios
			.get(`${process.env.REACT_APP_BASE_URL}fallacies`, {
				params: {
					coinId,
					page
				}
			})
			.then((response) => {
				const { data, meta } = response.data
				dispatch({
					type: "GET_FALLACIES",
					predictions: data,
					page
				})
				setPage(page + 1)
				setHasMore(meta.current_page < meta.last_page)
				if (page === 1) {
					setLoading(false)
				} else {
					setLoadingMore(false)
				}
			})
			.catch(() => {
				toast.error("There was an error")
			})
	}

	const onClickFallacy = (e, id) => {
		if (!e.metaKey) {
			history.push(`/fallacies/${id}`)
		} else {
			window.open(`/fallacies/${id}`, "_blank").focus()
		}
	}

	return (
		<DefaultLayout
			activeItem="fallacies"
			containerClassName="fallacyPage"
			history={history}
			inverted={inverted}
		>
			<DisplayMetaTags page="fallacy" state={internalState} />
			{loaded ? (
				<>
					<FallacyList
						fallacies={internalState.fallacies}
						loading={loading}
						loadingMore={loadingMore}
						onClickFallacy={onClickFallacy}
					/>
				</>
			) : (
				<div className="centeredLoader">
					<Loader active inverted={inverted} size="big" />
				</div>
			)}
		</DefaultLayout>
	)
}

Fallacy.propTypes = {
	history: PropTypes.object,
	match: PropTypes.object
}

export default Fallacy
