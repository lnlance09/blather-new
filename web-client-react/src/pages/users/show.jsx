import { Image, Loader } from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
// import { CopyToClipboard } from "react-copy-to-clipboard"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import ImageUpload from "components/ImageUpload"
import initialState from "states/user"
import logger from "use-reducer-logger"
import PlaceholderPic from "images/avatar/large/steve.jpg"
import PropTypes from "prop-types"
import reducer from "reducers/user"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Member = ({ history, match }) => {
	const { state } = useContext(ThemeContext)
	const { auth, bearer, inverted, user } = state
	const { username } = match.params

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { loaded, member } = internalState

	// const [activeItem, setActiveItem] = useState(null)
	// eslint-disable-next-line
	const [hasMore, setHasMore] = useState(false)
	const [imageLoaded, setImageLoaded] = useState(false)
	// eslint-disable-next-line
	const [loadingMore, setLoadingMore] = useState(false)
	// eslint-disable-next-line
	const [page, setPage] = useState(1)

	useEffect(() => {
		const getuser = async (user) => {
			await axios
				.get(`${process.env.REACT_APP_BASE_URL}users/${username}`)
				.then(async (response) => {
					const user = response.data.data
					dispatch({
						type: "GET_user",
						user
					})
					getPredictions(user.id, null)
				})
				.catch(() => {
					toast.error("There was an error")
				})
		}

		getuser(username)
	}, [username])

	const getPredictions = async (userId, status, sort = "created_at", dir = "desc", page = 1) => {
		dispatch({
			type: "SET_LOADING_PREDICTIONS"
		})

		await axios
			.get(`${process.env.REACT_APP_BASE_URL}predictions`, {
				params: {
					userId,
					status,
					sort,
					dir,
					page
				}
			})
			.then((response) => {
				const { data, meta } = response.data
				dispatch({
					type: "GET_PREDICTIONS",
					predictions: data,
					page
				})
				setPage(page + 1)
				setHasMore(meta.current_page < meta.last_page)
				if (page > 1) {
					setLoadingMore(false)
				}
			})
			.catch(() => {
				toast.error("There was an error")
			})
	}

	// eslint-disable-next-line
	const onClickUser = (e, id) => {
		if (!e.metaKey) {
			history.push(`/${id}`)
		} else {
			window.open(`/${id}`, "_blank").focus()
		}
	}

	const changeProfilePic = async (file) => {
		const formData = new FormData()
		formData.set("file", file)

		await axios
			.post(`${process.env.REACT_APP_BASE_URL}users/profilePic`, formData, {
				headers: {
					Authorization: `Bearer ${bearer}`,
					"Content-Type": "multipart/form-data",
					enctype: "multipart/form-data"
				}
			})
			.then((response) => {
				const { data } = response.data
				localStorage.setItem("user", JSON.stringify(data))

				dispatch({
					type: "GET_user",
					user: data
				})
			})
			.catch((error) => {
				let errorMsg = ""
				const { status } = error.response
				const { errors } = error.response.data

				if (status === 403) {
					errorMsg = error.response.data.message
				} else {
					if (typeof errors.file !== "undefined") {
						errorMsg = errors.file[0]
					}
				}

				toast.error(errorMsg)
			})
	}

	// eslint-disable-next-line
	const isMyProfile = auth ? user.id === member.id : false

	// eslint-disable-next-line
	const ProfilePic = () => {
		if (auth && user.id === member.id) {
			return (
				<ImageUpload
					callback={(file) => changeProfilePic(file)}
					img={user.image === null ? PlaceholderPic : user.image}
					inverted={inverted}
				/>
			)
		}

		return (
			<Image
				bordered
				circular
				className={`inverted smooth-image image-${imageLoaded ? "visible" : "hidden"}`}
				onError={(i) => (i.target.src = PlaceholderPic)}
				onLoad={() => setImageLoaded(true)}
				style={{
					height: 175,
					width: 175
				}}
				src={user.image}
			/>
		)
	}

	return (
		<DefaultLayout
			activeItem="users"
			containerClassName="userPage"
			history={history}
			inverted={inverted}
			textAlign="center"
		>
			<DisplayMetaTags page="user" state={internalState} />
			{loaded ? (
				<></>
			) : (
				<>
					<div className="centeredLoader">
						<Loader active inverted={inverted} size="big" />
					</div>
				</>
			)}
		</DefaultLayout>
	)
}

Member.propTypes = {
	history: PropTypes.object,
	match: PropTypes.object
}

export default Member
