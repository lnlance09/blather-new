import { Divider, Grid, Header, Image, Loader, Menu, Visibility } from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { ReactSVG } from "react-svg"
import { onClickRedirect } from "utils/linkFunctions"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import FallacyList from "components/FallacyList"
import ImageUpload from "components/ImageUpload"
import initialState from "states/user"
import linkifyHtml from "linkify-html"
import logger from "use-reducer-logger"
import Logo from "images/logos/agent.svg"
import NumberFormat from "react-number-format"
import PageList from "components/PageList"
import PlaceholderPic from "images/avatar/large/steve.jpg"
import PropTypes from "prop-types"
import qs from "query-string"
import reducer from "reducers/user"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Member = ({ history, match }) => {
	const query = qs.parse(window.location.search)
	const { tab } = query
	const tabs = ["fallacies", "contradictions", "targets"]

	const { state } = useContext(ThemeContext)
	const { auth, bearer, inverted, user } = state
	const { username } = match.params

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { contradictions, error, fallacies, loaded, member, targets } = internalState

	const [activeItem, setActiveItem] = useState(tabs.includes(tab) ? tab : "fallacies")
	const [imageLoaded, setImageLoaded] = useState(false)

	const [hasMore, setHasMore] = useState(false)
	const [hasMoreC, setHasMoreC] = useState(false)
	const [hasMoreT, setHasMoreT] = useState(false)

	const [loading, setLoading] = useState(true)
	const [loadingC, setLoadingC] = useState(true)
	const [loadingT, setLoadingT] = useState(true)

	const [loadingMore, setLoadingMore] = useState(false)
	const [loadingMoreC, setLoadingMoreC] = useState(false)
	const [loadingMoreT, setLoadingMoreT] = useState(false)

	const [pageNumber, setPageNumber] = useState(1)
	const [pageNumberC, setPageNumberC] = useState(1)
	const [pageNumberT, setPageNumberT] = useState(1)

	useEffect(() => {
		const getUser = async () => {
			await axios
				.get(`${process.env.REACT_APP_BASE_URL}users/${username}`)
				.then(async (response) => {
					const user = response.data.data
					dispatch({
						type: "GET_USER",
						user
					})
					getFallacies([user.id])
					getContradictions([user.id])
					getTargets(user.id)
				})
				.catch(() => {
					dispatch({
						type: "SET_USER_ERROR"
					})
					toast.error("There was an error")
				})
		}

		getUser()
		// eslint-disable-next-line
	}, [username])

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
					type: "GET_USER",
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

	const getContradictions = async (userIds, page = 1) => {
		page === 1 ? setLoadingC(true) : setLoadingMoreC(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}fallacies`, {
				params: {
					with: [
						"contradictionTwitter.tweet",
						"contradictionYouTube.video",
						"twitter.tweet",
						"youtube.video",
						"reference"
					],
					includeContradictions: true,
					page,
					refIds: [21],
					userIds
				}
			})
			.then(async (response) => {
				const { data, meta } = response.data
				dispatch({
					type: "GET_CONTRADICTIONS",
					contradictions: data,
					page
				})
				setPageNumberC(page + 1)
				setHasMoreC(meta.current_page < meta.last_page)
				pageNumberC === 1 ? setLoadingC(false) : setLoadingMoreC(false)
			})
			.catch(() => {
				toast.error("There was an error")
			})
	}

	const getFallacies = async (userIds, page = 1) => {
		page === 1 ? setLoading(true) : setLoadingMore(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}fallacies`, {
				params: {
					with: [
						"contradictionTwitter.tweet",
						"contradictionYouTube.video",
						"twitter.tweet",
						"youtube.video",
						"reference"
					],
					userIds,
					page
				}
			})
			.then((response) => {
				const { data, meta } = response.data
				dispatch({
					type: "GET_FALLACIES",
					fallacies: data,
					page
				})
				setPageNumber(page + 1)
				setHasMore(meta.current_page < meta.last_page)
				pageNumber === 1 ? setLoading(false) : setLoadingMore(false)
			})
			.catch(() => {
				toast.error("There was an error")
			})
	}

	const getTargets = async (id, page = 1) => {
		page === 1 ? setLoadingT(true) : setLoadingMoreT(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}users/getTargets`, {
				params: {
					id,
					page
				}
			})
			.then((response) => {
				const { data, meta } = response.data
				dispatch({
					type: "GET_TARGETS",
					targets: data,
					page
				})
				setPageNumberT(page + 1)
				setHasMoreT(meta.current_page < meta.last_page)
				pageNumberT === 1 ? setLoadingT(false) : setLoadingMoreT(false)
			})
			.catch(() => {
				toast.error("There was an error")
			})
	}

	const handleItemClick = (e, { name }) => {
		setActiveItem(name)
	}

	const onClickFallacy = (e, slug) => {
		onClickRedirect(e, history, `/fallacies/${slug}`)
	}

	const onClickPage = (e, network, slug) => {
		onClickRedirect(e, history, `/pages/${network}/${slug}`)
	}

	const isMyProfile = auth ? user.id === member.id : false

	const ProfilePic = () => {
		if (isMyProfile) {
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
				className={`inverted smooth-image image-${imageLoaded ? "visible" : "hidden"}`}
				fluid
				onError={(i) => (i.target.src = PlaceholderPic)}
				onLoad={() => setImageLoaded(true)}
				rounded
				src={member.image}
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
				<>
					{error && (
						<>
							<div className="centeredLoader">
								<Header as="h1" image textAlign="center">
									<ReactSVG className="errorSvg" src={Logo} />
									<Header.Content>This user does not exist</Header.Content>
								</Header>
							</div>
						</>
					)}

					{!error && (
						<>
							<Grid stackable>
								<Grid.Row>
									<Grid.Column className="imgColumn" width={3}>
										{ProfilePic()}
									</Grid.Column>
									<Grid.Column width={8}>
										<Header as="h1" inverted={inverted}>
											<Header.Content>
												{member.name}
												<Header.Subheader>
													@{member.username}
												</Header.Subheader>
											</Header.Content>
										</Header>
										<Header
											as="p"
											inverted={inverted}
											size="small"
											style={{ marginTop: 0 }}
										/>
										<Header
											inverted={inverted}
											size="small"
											style={{ marginTop: 0 }}
										>
											<div
												dangerouslySetInnerHTML={{
													__html: linkifyHtml(member.bio, {
														className: "linkify"
													})
												}}
											/>
										</Header>
									</Grid.Column>
								</Grid.Row>
							</Grid>

							<Menu secondary pointing size="large">
								<Menu.Item
									active={activeItem === "fallacies"}
									name="fallacies"
									onClick={handleItemClick}
								>
									Fallacies
									{member.fallaciesCount > 0 && (
										<span className="count">
											(
											<NumberFormat
												displayType={"text"}
												thousandSeparator
												value={member.fallaciesCount}
											/>
											)
										</span>
									)}
								</Menu.Item>
								<Menu.Item
									active={activeItem === "contradictions"}
									name="contradictions"
									onClick={handleItemClick}
								>
									Contradictions
									{member.contradictionsCount > 0 && (
										<span className="count">
											(
											<NumberFormat
												displayType={"text"}
												thousandSeparator
												value={member.contradictionsCount}
											/>
											)
										</span>
									)}
								</Menu.Item>
								<Menu.Item
									active={activeItem === "targets"}
									name="targets"
									onClick={handleItemClick}
								>
									Targets
									{member.targetsCount > 0 && (
										<span className="count">
											(
											<NumberFormat
												displayType={"text"}
												thousandSeparator
												value={member.targetsCount}
											/>
											)
										</span>
									)}
								</Menu.Item>
							</Menu>

							{activeItem === "fallacies" && (
								<Visibility
									continuous
									offset={[50, 50]}
									onBottomVisible={() => {
										if (!loading && !loadingMore && hasMore) {
											getFallacies([member.id], pageNumber)
										}
									}}
								>
									<FallacyList
										defaultUserImg={member.image}
										fallacies={fallacies.data}
										history={history}
										inverted={inverted}
										loading={!fallacies.loaded}
										loadingMore={loadingMore}
										onClickFallacy={onClickFallacy}
									/>
								</Visibility>
							)}

							{activeItem === "contradictions" && (
								<Visibility
									continuous
									offset={[50, 50]}
									onBottomVisible={() => {
										if (!loadingC && !loadingMoreC && hasMoreC) {
											getContradictions([member.id], pageNumberC)
										}
									}}
								>
									<FallacyList
										defaultUserImg={member.image}
										fallacies={contradictions.data}
										history={history}
										inverted={inverted}
										loading={!contradictions.loaded}
										loadingMore={loadingMoreC}
										onClickFallacy={onClickFallacy}
									/>
								</Visibility>
							)}

							{activeItem === "targets" && (
								<Visibility
									continuous
									offset={[50, 50]}
									onBottomVisible={() => {
										if (!loadingT && !loadingMoreT && hasMoreT) {
											getTargets(member.id, pageNumberT)
										}
									}}
								>
									<PageList
										history={history}
										inverted={inverted}
										loading={!targets.loaded}
										loadingMore={loadingMoreT}
										onClickPage={onClickPage}
										pages={targets.data}
									/>
								</Visibility>
							)}

							<Divider hidden section />
						</>
					)}
				</>
			) : (
				<div className="centeredLoader">
					<Loader active inverted={inverted} size="big" />
				</div>
			)}
		</DefaultLayout>
	)
}

Member.propTypes = {
	history: PropTypes.object,
	match: PropTypes.object
}

export default Member
