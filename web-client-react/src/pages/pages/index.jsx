import {
	Button,
	Grid,
	Header,
	Image,
	Label,
	Loader,
	Menu,
	Segment,
	Visibility
} from "semantic-ui-react"
import { useContext, useEffect, useReducer, useState } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import ContradictionList from "components/ContradictionList"
import DefaultLayout from "layouts/default"
import FallacyList from "components/FallacyList"
import initialState from "states/page"
import logger from "use-reducer-logger"
import PlaceholderPic from "images/images/image-square.png"
import PropTypes from "prop-types"
import reducer from "reducers/page"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Page = ({ history, match }) => {
	const { state } = useContext(ThemeContext)
	const { inverted } = state
	const { network, slug } = match.params

	const [internalState, dispatchInternal] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { contradictions, fallacies, loaded, page } = internalState

	const [activeItem, setActiveItem] = useState("contradictions")
	const [hasMore, setHasMore] = useState(false)
	const [hasMoreC, setHasMoreC] = useState(false)
	const [loading, setLoading] = useState(true)
	const [loadingC, setLoadingC] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [loadingMoreC, setLoadingMoreC] = useState(false)
	const [imageLoaded, setImageLoaded] = useState(false)
	const [pageNumber, setPageNumber] = useState(1)
	const [pageNumberC, setPageNumberC] = useState(1)

	useEffect(() => {
		const getPage = async (slug) => {
			await axios
				.get(`${process.env.REACT_APP_BASE_URL}pages/${network}/${slug}`)
				.then(async (response) => {
					const page = response.data.data
					dispatchInternal({
						type: "GET_PAGE",
						page
					})
					getFallacies(page.id)
					getContradictions(page.id)
				})
				.catch(() => {
					toast.error("There was an error")
				})
		}

		getPage(slug)
		// eslint-disable-next-line
	}, [slug])

	const getContradictions = async (pageId, page = 1) => {
		if (page === 1) {
			setLoadingC(true)
		} else {
			setLoadingMoreC(true)
		}

		await axios
			.get(`${process.env.REACT_APP_BASE_URL}fallacies`, {
				params: {
					with: [
						"contradictionTwitter.tweet",
						"contradictionYouTube.video",
						"twitter.tweet",
						"youtube.video"
					],
					includeContradictions: true,
					page,
					pageId,
					refId: 21
				}
			})
			.then(async (response) => {
				const { data, meta } = response.data
				dispatchInternal({
					type: "GET_CONTRADICTIONS",
					contradictions: data,
					page
				})
				setPageNumberC(pageNumberC + 1)
				setHasMoreC(meta.current_page < meta.last_page)
				if (pageNumberC === 1) {
					setLoadingC(false)
				} else {
					setLoadingMoreC(false)
				}
			})
			.catch(() => {
				toast.error("There was an error")
			})
	}

	const getFallacies = async (pageId, page = 1) => {
		if (page === 1) {
			setLoading(true)
		} else {
			setLoadingMore(true)
		}

		await axios
			.get(`${process.env.REACT_APP_BASE_URL}fallacies`, {
				params: {
					with: ["reference", "user", "twitter.tweet", "youtube.video"],
					page,
					pageId
				}
			})
			.then(async (response) => {
				const { data, meta } = response.data
				dispatchInternal({
					type: "GET_FALLACIES",
					fallacies: data,
					page
				})
				setPageNumber(pageNumber + 1)
				setHasMore(meta.current_page < meta.last_page)
				if (pageNumber === 1) {
					setLoading(false)
				} else {
					setLoadingMore(false)
				}
			})
			.catch(() => {
				toast.error("There was an error")
			})
	}

	const handleItemClick = (e, { name }) => {
		setActiveItem(name)
	}

	const onClickFallacy = (e, slug) => {
		if (e.metaKey) {
			window.open(`/fallacies/${slug}`, "_blank").focus()
		} else {
			history.push(`/fallacies/${slug}`)
		}
	}

	return (
		<DefaultLayout
			activeItem=""
			containerClassName="socialMediaPage"
			history={history}
			inverted={inverted}
		>
			<DisplayMetaTags page="page" state={internalState} />
			{loaded ? (
				<>
					<Grid stackable>
						<Grid.Row>
							<Grid.Column className="imgColumn" width={2}>
								<Segment>
									<Image
										bordered
										className={`inverted smooth-image image-${
											imageLoaded ? "visible" : "hidden"
										}`}
										fluid
										onError={(i) => (i.target.src = PlaceholderPic)}
										onLoad={() => setImageLoaded(true)}
										src={page.image}
									/>
								</Segment>
							</Grid.Column>
							<Grid.Column width={14}>
								<Header as="h1" inverted={inverted}>
									<Header.Content>
										{page.name}
										<Header.Subheader>@{page.username}</Header.Subheader>
									</Header.Content>
									<Button
										circular
										className={`networkBtn ${inverted ? "inverted" : null}`}
										color={network}
										compact
										icon={network}
										onClick={() => {
											window.open(page.externalLink, "_blank").focus()
										}}
										size="small"
									/>
								</Header>
								<Header
									as="p"
									inverted={inverted}
									size="small"
									style={{ marginTop: 0 }}
								></Header>
								<Header
									as="p"
									inverted={inverted}
									size="small"
									style={{ marginTop: 0 }}
								>
									{page.bio}
								</Header>
							</Grid.Column>
						</Grid.Row>
					</Grid>

					<Menu attached="top" tabular size="large">
						<Menu.Item
							active={activeItem === "fallacies"}
							name="fallacies"
							onClick={handleItemClick}
						>
							Fallacies
							<Label color="red">{page.fallacyCount}</Label>
						</Menu.Item>
						<Menu.Item
							active={activeItem === "contradictions"}
							name="contradictions"
							onClick={handleItemClick}
						>
							Contradictions
							<Label color="red">{page.contradictionCount}</Label>
						</Menu.Item>
					</Menu>

					<Segment attached>
						{activeItem === "fallacies" && (
							<Visibility
								continuous
								offset={[50, 50]}
								onBottomVisible={() => {
									if (!loading && !loadingMore && hasMore) {
										getFallacies(page.id, pageNumber)
									}
								}}
							>
								<FallacyList
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
										getContradictions(page.id, pageNumberC)
									}
								}}
							>
								<ContradictionList
									contradictions={contradictions.data}
									defaultUserImg={page.image}
									history={history}
									inverted={inverted}
									loading={!contradictions.loaded}
									loadingMore={loadingMoreC}
									onClickContradiction={onClickFallacy}
								/>
							</Visibility>
						)}
					</Segment>
				</>
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
