import {
	Button,
	Card,
	Divider,
	Form,
	Header,
	Icon,
	Image,
	List,
	Placeholder,
	Segment,
	Transition,
	Visibility
} from "semantic-ui-react"
import { useContext, useEffect, useReducer, useRef, useState } from "react"
import { RedditShareButton, TwitterShareButton } from "react-share"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { Link } from "react-router-dom"
import { ReactSVG } from "react-svg"
import { onClickRedirect } from "utils/linkFunctions"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import _ from "underscore"
import axios from "axios"
import CommentList from "components/CommentList"
import defaultImg from "images/images/image-square.png"
import DefaultLayout from "layouts/default"
import FallacyExample from "components/FallacyExample"
import html2canvas from "html2canvas"
import initialState from "states/fallacy"
import logger from "use-reducer-logger"
import Logo from "images/logos/agent.svg"
import Marked from "marked"
import Moment from "react-moment"
import PropTypes from "prop-types"
import reducer from "reducers/fallacy"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const PlaceholderSegment = (
	<Placeholder fluid style={{ height: 220 }}>
		<Placeholder.Image image />
	</Placeholder>
)

const Fallacy = ({ history, match }) => {
	const { state } = useContext(ThemeContext)
	const { auth, inverted } = state
	const authUser = state.user

	const { slug } = match.params
	const url = `${window.location.origin}/fallacies/${slug}`

	const explanationRef = useRef(null)

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { comments, error, fallacy, loaded } = internalState
	const { createdAt, id, page, reference, retracted, title, user } = fallacy
	const { contradictionTweet, contradictionYouTube, twitter } = fallacy

	const canScreenshot =
		(twitter && contradictionYouTube === null) || (twitter && contradictionTweet)
	const canRetract = false
	const canEdit = auth ? authUser.id === user.id : false

	const [downloading, setDownloading] = useState(false)
	const [editingExp, setEditingExp] = useState(false)
	const [verticalMode, setVerticalMode] = useState(true)
	const [visible, setVisible] = useState(false)

	const [hasMoreC, setHasMoreC] = useState(false)
	const [loadingC, setLoadingC] = useState(true)
	const [loadingMoreC, setLoadingMoreC] = useState(false)
	const [pageNumberC, setPageNumberC] = useState(1)

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
					setVisible(true)
					getComments(fallacy.id)
				})
				.catch(() => {
					dispatch({
						type: "SET_FALLACY_ERROR"
					})
					toast.error("There was an error")
				})
		}

		getFallacy(slug)
		// eslint-disable-next-line
	}, [slug])

	const captureScreenshot = () => {
		const el = "fallacyMaterial"
		const filename = `${reference.name}-by-${page.name}-${createdAt}`
		setDownloading(true)

		html2canvas(document.getElementById(el), {
			allowTaint: true,
			background: "#000",
			scale: 2,
			scrollX: 0,
			scrollY: -window.scrollY,
			useCORS: true
		}).then((canvas) => {
			const ctx = canvas.getContext("2d")
			ctx.globalAlpha = 1
			ctx.fillStyle = "#000"

			const img = canvas.toDataURL("image/png")
			saveScreenshot(id, img)

			let link = document.createElement("a")
			link.download = `${filename}.png`
			link.href = img
			link.click()

			setDownloading(false)
		})
	}

	const getComments = async (fallacyId, page = 1) => {
		page === 1 ? setLoadingC(true) : setLoadingMoreC(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}comments`, {
				params: {
					page,
					fallacyId
				}
			})
			.then(async (response) => {
				const { data, meta } = response.data
				dispatch({
					type: "GET_COMMENTS",
					comments: data,
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

	// eslint-disable-next-line
	const getRelatedFallacies = async (fallacyId, page = 1) => {
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}fallacies/related`, {
				params: {
					fallacyId,
					page
				}
			})
			.then((response) => {
				const { data } = response.data
				dispatch({
					type: "GET_FALLACIES",
					fallacies: data,
					page
				})
			})
			.catch(() => {
				toast.error("There was an error")
			})
	}

	const onClickFallacy = (e, slug) => {
		onClickRedirect(e, history, `/fallacies/${slug}`)
	}

	const retractLogic = (e, { value }) => {}

	const saveScreenshot = async (id, img) => {
		await axios
			.post(`${process.env.REACT_APP_BASE_URL}fallacies/saveScreenshot`, {
				id,
				slug
			})
			.then((response) => {
				const { data } = response.data
				dispatch({
					type: "SAVE_SCREENSHOT",
					data
				})
			})
			.catch(() => {
				toast.error("There was an error")
			})
	}

	const updateFallacy = async (id) => {
		const explanation = _.isEmpty(explanationRef.current) ? "" : explanationRef.current.value

		await axios
			.post(`${process.env.REACT_APP_BASE_URL}fallacies/update`, {
				id,
				explanation
			})
			.then((response) => {
				const { data } = response.data
				dispatch({
					type: "UPDATE_FALLACY",
					data
				})
			})
			.catch(() => {
				toast.error("Error updating fallacy")
			})
	}

	return (
		<DefaultLayout activeItem="fallacies" containerClassName="fallacyPage" history={history}>
			<DisplayMetaTags page="fallacy" state={internalState} />
			{loaded ? (
				<>
					{error && (
						<div className="centeredLoader">
							<Header as="h1" image textAlign="center">
								<ReactSVG className="errorSvg" src={Logo} />
								<Header.Content>This fallacy does not exist</Header.Content>
							</Header>
						</div>
					)}

					{!error && (
						<>
							<Header as="h1" className="fallacyHeader">
								{title} #{id}
								<Header.Subheader>
									Assigned to{" "}
									<Link to={`/pages/${page.network}/${page.username}`}>
										{page.name}
									</Link>
								</Header.Subheader>
							</Header>
							<Transition animation="scale" duration={900} visible={visible}>
								<div id="fallacyMaterial">
									<FallacyExample
										colored={fallacy.reference.id === 21}
										contradictionTwitter={fallacy.contradictionTwitter}
										contradictionYouTube={fallacy.contradictionYouTube}
										createdAt={fallacy.createdAt}
										crossOriginAnonymous={true}
										defaultUserImg={fallacy.page.image}
										explanation={fallacy.explanation}
										history={history}
										id={fallacy.id}
										onClickFallacy={onClickFallacy}
										onClickTweet={(e, history, id) =>
											onClickRedirect(e, history, `/tweets/${id}`)
										}
										reference={fallacy.reference}
										showExplanation={false}
										slug={fallacy.slug}
										stacked
										twitter={fallacy.twitter}
										youtube={fallacy.youtube}
										user={fallacy.user}
										verticalMode={verticalMode}
									/>
								</div>
							</Transition>

							<List className="shareList" horizontal size="mini">
								<List.Item>
									<TwitterShareButton title={title} url={url}>
										<Button circular color="twitter" icon="twitter" />
									</TwitterShareButton>
								</List.Item>
								<List.Item>
									<RedditShareButton url={url}>
										<Button circular color="orange" icon="reddit alien" />
									</RedditShareButton>
								</List.Item>
								<List.Item position="right">
									<CopyToClipboard
										onCopy={() => toast.success("Copied")}
										text={url}
									>
										<Button circular color="blue" icon="paperclip" />
									</CopyToClipboard>
								</List.Item>
								{canScreenshot && (
									<List.Item position="right">
										<Button
											circular
											className="screenshotButton"
											color="olive"
											icon="camera"
											loading={downloading}
											onClick={captureScreenshot}
											style={{ verticalAlign: "none" }}
										/>
									</List.Item>
								)}
								<List.Item position="right">
									<Button
										circular
										color="yellow"
										icon="shuffle"
										onClick={() => setVerticalMode(!verticalMode)}
										style={{ verticalAlign: "none" }}
									/>
								</List.Item>
							</List>

							<Segment basic className="explanationSegment">
								<Header>
									<Image
										circular
										onError={(i) => (i.target.src = defaultImg)}
										src={user.image}
									/>
									<Header.Content>
										{user.name}
										<Header.Subheader>
											<Moment date={fallacy.createdAt} fromNow />
											{canEdit && (
												<>
													{" "}
													•{" "}
													<span
														className={`editExp ${
															editingExp ? "red" : "blue"
														}`}
														onClick={() => setEditingExp(!editingExp)}
													>
														{editingExp ? "Cancel" : "Edit"}
													</span>
												</>
											)}
										</Header.Subheader>
									</Header.Content>
								</Header>
								{editingExp ? (
									<Form>
										<Form.Field>
											<textarea
												defaultValue={fallacy.explanation}
												placeholder="Explain why this is fallacious"
												ref={explanationRef}
											/>
										</Form.Field>
										<Form.Field>
											<Button
												color="blue"
												content="Save"
												fluid
												onClick={() => updateFallacy(id)}
											/>
										</Form.Field>
									</Form>
								) : (
									<div
										dangerouslySetInnerHTML={{
											__html: Marked(fallacy.explanation)
										}}
									/>
								)}
							</Segment>

							<Divider hidden />

							<Card className="retractionCard" fluid>
								<Card.Content>
									<Image
										bordered
										circular
										floated="right"
										onClick={() => history.push(`/${user.username}`)}
										onError={(i) => (i.target.src = defaultImg)}
										size="mini"
										src={page.image}
									/>
									<Card.Header>
										{retracted
											? "Retracted"
											: "Still waiting for a retraction..."}
									</Card.Header>
									<Card.Meta>
										{retracted ? (
											`Nice work, ${user.name}`
										) : (
											<>
												Waiting for{" "}
												<Moment
													ago
													date={createdAt}
													fromNow
													interval={60000}
												/>
												...
											</>
										)}
									</Card.Meta>
									<Card.Description>
										{retracted ? (
											<>
												<Link to={`/pages/${page.username}`}>
													{page.name}
												</Link>{" "}
												has admitted that this is poor reasoning.
											</>
										) : (
											<p>
												{canRetract ? (
													`${page.name}, this is an opportunity to show your
												followers that you have enough courage to admit that
												you were wrong.`
												) : (
													<>
														<Link
															to={`/pages/${page.network}/${page.username}`}
														>
															{page.name}
														</Link>
														, you can retract this by{" "}
														<Link to="/signin">signing in</Link>.
													</>
												)}
											</p>
										)}
									</Card.Description>
								</Card.Content>
								<Card.Content extra>
									{retracted ? (
										<Button active color="green" fluid size="large">
											<Icon name="checkmark" />
											Retracted
										</Button>
									) : (
										<Button
											content="Retract"
											disabled={!canRetract}
											fluid
											negative
											onClick={retractLogic}
										/>
									)}
								</Card.Content>
							</Card>

							<Divider hidden />

							<Segment secondary>
								<Header as="h3">{reference.name}</Header>
								<p>{reference.description}</p>
							</Segment>

							<Divider hidden />

							<Visibility
								continuous
								offset={[50, 50]}
								onBottomVisible={() => {
									if (!loadingC && !loadingMoreC && hasMoreC) {
										getComments(fallacy.id, pageNumberC)
									}
								}}
							>
								<CommentList
									comments={comments.data}
									fallacyId={id}
									history={history}
									showEmptyMsg={false}
								/>
							</Visibility>

							<Divider hidden section />
						</>
					)}
				</>
			) : (
				<div className="placeholderWrapper">
					<Segment basic style={{ height: "50px" }}></Segment>
					<Segment stacked>
						{PlaceholderSegment}
						<Divider section />
						{PlaceholderSegment}
					</Segment>
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
