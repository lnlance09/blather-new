import {
	Button,
	Card,
	Container,
	Divider,
	Dropdown,
	Feed,
	Form,
	Grid,
	Header,
	Icon,
	Image,
	Input,
	List,
	Modal,
	Placeholder,
	Segment,
	Transition,
	Visibility
} from "semantic-ui-react"
import { useContext, useEffect, useReducer, useRef, useState } from "react"
import { TwitterShareButton } from "react-share"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { Link } from "react-router-dom"
import { ReactSVG } from "react-svg"
import { dataUrlToFile } from "utils/fileFunctions"
import { onClickRedirect } from "utils/linkFunctions"
import { DisplayMetaTags } from "utils/metaFunctions"
import { formatPlural } from "utils/textFunctions"
import { getDropdownOptions } from "options/page"
import { getReferenceOptions } from "options/reference"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import _ from "underscore"
import axios from "axios"
import CommentList from "components/CommentList"
import defaultImg from "images/avatar/small/steve.jpg"
import DefaultLayout from "layouts/default"
import FallacyExample from "components/FallacyExample"
import fileDownload from "js-file-download"
import html2canvas from "html2canvas"
import ImageUpload from "components/ImageUpload"
import initialState from "states/fallacy"
import logger from "use-reducer-logger"
import Logo from "images/logos/npc.svg"
import Marked from "marked"
import moment from "moment"
import Moment from "react-moment"
import PropTypes from "prop-types"
import reducer from "reducers/fallacy"
import ThemeContext from "themeContext"
import TimeField from "react-simple-timefield"
import TweetList from "components/TweetList"

const toastConfig = getConfig()
toast.configure(toastConfig)

const PlaceholderSegment = (
	<Placeholder fluid style={{ height: 320 }}>
		<Placeholder.Image />
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
	const {
		args,
		comments,
		error,
		fallacies,
		fallacy,
		loaded,
		modalTweets,
		pageOptions,
		refOptions
	} = internalState
	const { createdAt, group, id, page, reference, retracted, title, user } = fallacy
	const { contradictionTwitter, contradictionYouTube, twitter, youtube } = fallacy

	const canScreenshot =
		(twitter && contradictionYouTube === null) || (twitter && contradictionTwitter)
	const canRetract = false
	const canEdit = auth ? authUser.id === user.id : false

	const [downloading, setDownloading] = useState(false)
	const [editingExp, setEditingExp] = useState(false)
	const [modalOpen, setModalOpen] = useState(false)
	const [refId, setRefId] = useState(1)
	const [showTweetUrls, setShowTweetUrls] = useState(false)
	const [verticalMode, setVerticalMode] = useState(false)
	const [visible, setVisible] = useState(false)

	const [hasMoreC, setHasMoreC] = useState(false)
	const [loadingC, setLoadingC] = useState(true)
	const [loadingMoreC, setLoadingMoreC] = useState(false)
	const [pageNumberC, setPageNumberC] = useState(1)

	const [hasMoreT, setHasMoreT] = useState(false)
	const [loadingT, setLoadingT] = useState(true)
	const [loadingMoreT, setLoadingMoreT] = useState(false)
	const [pageNumberT, setPageNumberT] = useState(1)

	const [highlightedText, setHighlightedText] = useState("")
	const [highlightedText2, setHighlightedText2] = useState("")

	const [currentArg, setCurrentArg] = useState("")
	const [currentArgCount, setCurrentArgCount] = useState(0)

	const [startTime, setStartTime] = useState(0)
	const [endTime, setEndTime] = useState(0)
	const [startTimeCont, setStartTimeCont] = useState(0)
	const [endTimeCont, setEndTimeCont] = useState(0)

	const [assignee, setAssignee] = useState(null)

	const canEditAssignee = youtube || contradictionYouTube

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
					getArguments(fallacy)
					setRefId(fallacy.reference.id)
					setAssignee(fallacy.page.id)

					const { contradictionTwitter, contradictionYouTube, twitter, youtube } = fallacy
					if (_.has(twitter, "highlightedText")) {
						const highlightedText =
							twitter.highlightedText === null ? "" : twitter.highlightedText
						setHighlightedText(highlightedText)
					}

					if (_.has(contradictionTwitter, "highlightedText")) {
						const highlightedText2 =
							contradictionTwitter.highlightedText === null
								? ""
								: contradictionTwitter.highlightedText
						setHighlightedText2(highlightedText2)
					}

					if (!_.isEmpty(youtube)) {
						setStartTime(youtube.startTime)
						setEndTime(youtube.endTime)
					}

					if (!_.isEmpty(contradictionYouTube)) {
						setStartTimeCont(contradictionYouTube.startTime)
						setEndTimeCont(contradictionYouTube.endTime)
					}
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

	useEffect(() => {
		const getRefOptions = async () => {
			const options = await getReferenceOptions(null, true)
			dispatch({
				type: "SET_REFERENCE_OPTIONS",
				options
			})
		}

		getRefOptions()
	}, [])

	useEffect(() => {
		const getPageOptions = async () => {
			const options = await getDropdownOptions(null)
			dispatch({
				type: "SET_PAGE_OPTIONS",
				options
			})
		}
		getPageOptions()
	}, [])

	const saveScreenshot = async (id, file) => {
		const formData = new FormData()
		formData.set("file", file)

		await axios
			.post(`${process.env.REACT_APP_BASE_URL}fallacies/saveScreenshot?id=${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					enctype: "multipart/form-data"
				}
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

	const captureScreenshot = () => {
		const el = document.getElementById("fallacyMaterial")
		const filename = `${reference.name}-by-${page.name}`
		setDownloading(true)
		el.classList.add("downloading")

		html2canvas(el, {
			allowTaint: true,
			scale: 2,
			scrollX: 0,
			scrollY: -window.scrollY,
			useCORS: true
		}).then(async (canvas) => {
			const ctx = canvas.getContext("2d")
			ctx.globalAlpha = 1

			const img = canvas.toDataURL("image/png")
			const file = await dataUrlToFile(img, "file.png")
			saveScreenshot(id, file)
			fileDownload(file, `${filename}.png`)

			el.classList.remove("downloading")
			setDownloading(false)
		})
	}

	const getArguments = async (fallacy) => {
		const { contradictionTwitter, id, page, twitter } = fallacy
		const pageId = page.id

		await axios
			.get(`${process.env.REACT_APP_BASE_URL}arguments/getArgumentsByFallacy`, {
				params: {
					id,
					pageId
				}
			})
			.then(async (response) => {
				const { data } = response.data
				dispatch({
					type: "GET_ARGUMENTS",
					args: data
				})

				let network = "twitter"
				const tweetIds = []
				if (!_.isEmpty(twitter)) {
					tweetIds.push(twitter.tweet.id)
				}

				if (!_.isEmpty(contradictionTwitter)) {
					tweetIds.push(contradictionTwitter.tweet.id)
				}

				const argIds = await data.map((arg) => arg.id)
				getRelatedFallacies(id, argIds, network, tweetIds)
				getTweets(argIds, [pageId])
			})
			.catch(() => {
				toast.error("There was an error")
			})
	}

	const getComments = async (fallacyId, page = 1) => {
		page === 1 ? setLoadingC(true) : setLoadingMoreC(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}comments`, {
				params: {
					page,
					fallacyId
				},
				headers: {
					Authorization: `Bearer ${localStorage.getItem("bearer")}`
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

	const getRelatedFallacies = async (id, args, network, tweetIds) => {
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}fallacies/related`, {
				params: {
					id,
					args,
					network,
					tweetIds
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

	const getTweets = async (argIds, pageIds, page = 1) => {
		page === 1 ? setLoadingT(true) : setLoadingMoreT(true)
		await axios
			.get(`${process.env.REACT_APP_BASE_URL}tweets`, {
				params: {
					argIds,
					pageIds,
					page
				}
			})
			.then((response) => {
				const { data, meta } = response.data
				dispatch({
					type: "GET_MODAL_TWEETS",
					tweets: data,
					page,
					total: meta.total
				})
				setPageNumberT(page + 1)
				setHasMoreT(true)
				page === 1 ? setLoadingT(false) : setLoadingMoreT(false)
			})
			.catch(() => {
				console.error("There was an error")
			})
	}

	const changeHighlightedText = (e, { value }) => {
		setHighlightedText(value)
	}

	const changeHighlightedText2 = (e, { value }) => {
		setHighlightedText2(value)
	}

	const onChangeAssignee = (e, { value }) => {
		setAssignee(value)
	}

	const onChangeRef = (e, { value }) => {
		setRefId(value)
	}

	const onClickFallacy = (e, slug) => {
		onClickRedirect(e, history, `/fallacies/${slug}`)
	}

	const retractLogic = () => {}

	const updateFallacy = async (id) => {
		const explanation = _.isEmpty(explanationRef.current) ? "" : explanationRef.current.value
		if (explanation === "") {
			return
		}

		await axios
			.post(
				`${process.env.REACT_APP_BASE_URL}fallacies/update`,
				{
					id,
					assignee,
					highlightedText,
					highlightedText2,
					explanation,
					refId,
					startTime,
					endTime,
					startTimeCont,
					endTimeCont
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("bearer")}`
					}
				}
			)
			.then((response) => {
				const data = response.data
				dispatch({
					type: "UPDATE_FALLACY",
					data
				})
				setEditingExp(false)
				toast.success("Updated!")
			})
			.catch(() => {
				toast.error("Error updating fallacy")
			})
	}

	const explanationSegment = (
		<>
			{loaded && !error ? (
				<Segment className="explanationSegment">
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
											className={`editExp ${editingExp ? "red" : "blue"}`}
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
								<Dropdown
									clearable
									fluid
									onChange={onChangeRef}
									options={refOptions}
									placeholder="Fallacy"
									selection
									value={refId}
								/>
							</Form.Field>
							<Form.Field>
								<textarea
									defaultValue={fallacy.explanation}
									placeholder="Explain why this is fallacious"
									ref={explanationRef}
								/>
							</Form.Field>
							{twitter && (
								<Form.Field>
									<label>Highlighted Text 1</label>
									<Input
										fluid
										onChange={changeHighlightedText}
										placeholder="Highlighted text"
										value={highlightedText}
									/>
								</Form.Field>
							)}
							{contradictionTwitter && (
								<Form.Field>
									<label>Highlighted Text 2</label>
									<Input
										fluid
										onChange={changeHighlightedText2}
										placeholder="Highlighted text 2"
										value={highlightedText2}
									/>
								</Form.Field>
							)}
							{canEditAssignee && (
								<Form.Field>
									<label>Assigned To</label>
									<Dropdown
										clearable
										fluid
										loading={pageOptions.length === 0}
										onChange={onChangeAssignee}
										options={pageOptions}
										placeholder="Assignee"
										search
										selection
										value={assignee}
									/>
								</Form.Field>
							)}
							{youtube && (
								<>
									<Header size="small">Video One</Header>
									<Form.Group widths="equal">
										<Form.Field>
											<label>Start Time</label>
											<TimeField
												input={
													<Form.Input
														fluid
														icon="hourglass start"
														placeholder="Start time"
														type="text"
													/>
												}
												onChange={(e, value) => {
													const time = moment.duration(value).asSeconds()
													setStartTime(time)
												}}
												showSeconds={true}
												value={`00:${moment
													.duration(youtube.startTime, "seconds")
													.format("mm:ss")}`}
											/>
										</Form.Field>
										<Form.Field>
											<label>End Time</label>
											<TimeField
												input={
													<Form.Input
														fluid
														icon="hourglass end"
														placeholder="End time"
														type="text"
													/>
												}
												onChange={(e, value) => {
													const time = moment.duration(value).asSeconds()
													setEndTime(time)
												}}
												showSeconds={true}
												value={`00:${moment
													.duration(youtube.endTime, "seconds")
													.format("mm:ss")}`}
											/>
										</Form.Field>
									</Form.Group>
								</>
							)}
							{contradictionYouTube && (
								<>
									<Header size="small">Video Two</Header>
									<Form.Group widths="equal">
										<Form.Field>
											<label>Start Time</label>
											<TimeField
												input={
													<Form.Input
														fluid
														icon="hourglass start"
														placeholder="Start time"
														type="text"
													/>
												}
												onChange={(e, value) => {
													const time = moment.duration(value).asSeconds()
													setStartTimeCont(time)
												}}
												showSeconds={true}
												value={`00:${moment
													.duration(
														contradictionYouTube.startTime,
														"seconds"
													)
													.format("mm:ss")}`}
											/>
										</Form.Field>
										<Form.Field>
											<label>End Time</label>
											<TimeField
												input={
													<Form.Input
														fluid
														icon="hourglass end"
														placeholder="End time"
														type="text"
													/>
												}
												onChange={(e, value) => {
													const time = moment.duration(value).asSeconds()
													setEndTimeCont(time)
												}}
												showSeconds={true}
												value={`00:${moment
													.duration(
														contradictionYouTube.endTime,
														"seconds"
													)
													.format("mm:ss")}`}
											/>
										</Form.Field>
									</Form.Group>
								</>
							)}
							<Form.Field>
								<Grid>
									<Grid.Row>
										<Grid.Column computer={14} mobile={12}>
											<Button
												color="black"
												content="Save"
												fluid
												onClick={() => updateFallacy(id)}
											/>
										</Grid.Column>
										<Grid.Column
											computer={2}
											mobile={4}
											style={{ paddingLeft: 0 }}
										>
											<ImageUpload
												as="button"
												btnSize="medium"
												// callback={(file) => addImage(file)}
												headerSize="tiny"
												inverted={inverted}
												msg="add image"
											/>
										</Grid.Column>
									</Grid.Row>
								</Grid>
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
			) : null}
		</>
	)

	const retractionCard = (
		<>
			{loaded && !error ? (
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
							{retracted ? "Retracted" : "Still waiting for a retraction..."}
						</Card.Header>
						<Card.Meta>
							{retracted ? (
								`Nice work, ${user.name}`
							) : (
								<>
									Waiting for{" "}
									<Moment ago date={createdAt} fromNow interval={60000} />
									...
								</>
							)}
						</Card.Meta>
						<Card.Description>
							{retracted ? (
								<>
									<Link to={`/pages/${page.username}`}>{page.name}</Link> has
									admitted that this is poor reasoning.
								</>
							) : (
								<p>
									{canRetract ? (
										`${page.name}, this is an opportunity to show your
												followers that you have enough courage to admit that
												you were wrong.`
									) : (
										<>
											<Link to={`/pages/${page.network}/${page.username}`}>
												{page.name}
											</Link>
											, you can retract this by{" "}
											<Link to="/auth">signing in</Link>.
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
			) : null}
		</>
	)

	const shareList = (
		<Segment textAlign="center">
			{loaded && !error ? (
				<List className="shareList" horizontal size="mini">
					<List.Item>
						<TwitterShareButton className="twitterShareBtn" title={title} url={url}>
							<Icon
								circular
								className="twitterIcon"
								inverted
								name="twitter"
								style={{
									fontSize: "18px"
								}}
							/>
						</TwitterShareButton>
					</List.Item>
					<List.Item position="right">
						<CopyToClipboard onCopy={() => toast.success("Copied")} text={url}>
							<Button circular color="yellow" icon="paperclip" />
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
							color="blue"
							icon="shuffle"
							onClick={() => {
								setVerticalMode(!verticalMode)
								window.scroll({
									top: 0,
									left: 0,
									behavior: "smooth"
								})
							}}
							style={{ verticalAlign: "none" }}
						/>
					</List.Item>
					<List.Item position="right">
						<Button
							circular
							color="black"
							icon={showTweetUrls ? "unlinkify" : "linkify"}
							onClick={() => {
								setShowTweetUrls(!showTweetUrls)
								window.scroll({
									top: 0,
									left: 0,
									behavior: "smooth"
								})
							}}
							style={{ verticalAlign: "none" }}
						/>
					</List.Item>
				</List>
			) : null}
		</Segment>
	)

	const argumentsCard = (
		<>
			{loaded && !error ? (
				<Card className="purveyorsCard" fluid>
					<Card.Content>
						<Card.Header>Arguments</Card.Header>
					</Card.Content>
					<Card.Content>
						{args.length === 0 ? (
							<Segment basic textAlign="center">
								<ReactSVG className="simpleLogo" src={Logo} />
							</Segment>
						) : (
							<Feed>
								{args.map((a, i) => (
									<Feed.Event key={`arg${i}`}>
										<Feed.Content>
											<Feed.Summary>
												<Link to={`/arguments/${a.slug}`}>
													{a.description}
												</Link>
												<Feed.Meta
													onClick={async () => {
														await getTweets([a.id], [page.id])
														setCurrentArg(a.description)
														setCurrentArgCount(a.tweetCount)
														setModalOpen(true)
													}}
												>
													<Feed.Like>
														<Icon color="green" name="recycle" /> has
														recycled this argument{" "}
														<span className="red">{a.tweetCount} </span>
														{formatPlural(a.tweetCount, "time")}
													</Feed.Like>
												</Feed.Meta>
											</Feed.Summary>
										</Feed.Content>
									</Feed.Event>
								))}
							</Feed>
						)}
					</Card.Content>
				</Card>
			) : null}
		</>
	)

	const relatedFallaciesCard = (
		<>
			{loaded && !error ? (
				<Card className="purveyorsCard" fluid>
					<Card.Content>
						<Card.Header>Related Fallacies</Card.Header>
					</Card.Content>
					<Card.Content>
						{fallacies.length === 0 ? (
							<Segment basic textAlign="center">
								<ReactSVG className="simpleLogo" src={Logo} />
							</Segment>
						) : (
							<Feed>
								{fallacies.map((f, i) => {
									if (_.isEmpty(f.page)) {
										return null
									}

									return (
										<Feed.Event key={`related${i}`}>
											<Feed.Label>
												<Image
													onError={(i) => (i.target.src = defaultImg)}
													src={f.page.image}
												/>
											</Feed.Label>
											<Feed.Content>
												<Feed.Summary>
													<Link to={`/fallacies/${f.slug}`}>
														{f.title} #{f.id}
													</Link>
												</Feed.Summary>
												<Feed.Extra text>
													<Moment date={f.createdAt} fromNow />
												</Feed.Extra>
											</Feed.Content>
										</Feed.Event>
									)
								})}
							</Feed>
						)}
					</Card.Content>
				</Card>
			) : null}
		</>
	)

	return (
		<DefaultLayout
			activeItem="fallacies"
			containerClassName="fallacyPage"
			history={history}
			useContainer={false}
		>
			<DisplayMetaTags page="fallacy" state={internalState} />
			{loaded ? (
				<>
					{error && (
						<Container>
							<div className="centeredLoader">
								<Header as="h1" image textAlign="center">
									<ReactSVG className="errorSvg" src={Logo} />
									<Header.Content>This fallacy does not exist</Header.Content>
								</Header>
							</div>
						</Container>
					)}

					{!error && (
						<>
							<Container className="exampleWrapper">
								<Header as="h1" className="fallacyHeader">
									{title} #{id}
									<Header.Subheader>
										Assigned to{" "}
										<Link to={`/pages/${page.network}/${page.username}`}>
											{page.name}
										</Link>
									</Header.Subheader>
								</Header>
							</Container>
							<div className="animationWrapper">
								<Container id="fallacyMaterial">
									<Transition animation="scale" duration={900} visible={visible}>
										<FallacyExample
											colored={reference.id === 21}
											contradictionTwitter={contradictionTwitter}
											contradictionYouTube={contradictionYouTube}
											createdAt={createdAt}
											crossOriginAnonymous={true}
											defaultUserImg={page.image}
											explanation={fallacy.explanation}
											group={group}
											newHighlightedText={highlightedText}
											newHighlightedTextC={highlightedText2}
											history={history}
											id={fallacy.id}
											onClickFallacy={onClickFallacy}
											onClickTweet={(e, history, id) =>
												onClickRedirect(e, history, `/tweets/${id}`)
											}
											reference={reference}
											showExplanation={false}
											showTweetUrls={showTweetUrls}
											slug={fallacy.slug}
											stacked
											twitter={twitter}
											youtube={youtube}
											user={user}
											verticalMode={verticalMode}
										/>
									</Transition>
								</Container>
							</div>

							<div className="bottomHalf">
								<Container>
									<Grid stackable>
										<Grid.Column width={11}>
											{explanationSegment}
											{retractionCard}

											<Segment>
												<Header as="h3">{reference.name}</Header>
												<p>{reference.description}</p>
											</Segment>

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
										</Grid.Column>
										<Grid.Column width={5}>
											{shareList}
											{argumentsCard}
											{relatedFallaciesCard}
										</Grid.Column>
									</Grid>
								</Container>
							</div>

							<Modal
								basic
								centered={false}
								closeIcon
								dimmer="blurring"
								onClose={() => setModalOpen(false)}
								onOpen={() => setModalOpen(true)}
								open={modalOpen}
								size="large"
							>
								<Modal.Content>
									<Segment>
										<Header>
											{currentArg}
											<Header.Subheader>
												<Icon color="green" name="recycle" />
												{page.name} has recycled this argument{" "}
												<b>{currentArgCount}</b>{" "}
												{formatPlural(currentArgCount, "time")}
											</Header.Subheader>
										</Header>
										<Divider hidden />
										<Visibility
											continuous
											offset={[50, 50]}
											onBottomVisible={() => {
												if (!loadingT && !loadingMoreT && hasMoreT) {
													getTweets([id], [page.id], pageNumberT)
												}
											}}
										>
											<TweetList
												history={history}
												inverted={inverted}
												loading={false}
												loadingMore={false}
												showTweetUrls={false}
												showSaveOption={false}
												tweets={modalTweets}
											/>
										</Visibility>
									</Segment>
								</Modal.Content>
							</Modal>
						</>
					)}
				</>
			) : (
				<div className="placeholderWrapper">
					<Container className="exampleWrapper"></Container>
					<div className="animationWrapper">
						<Container>
							<Segment stacked>
								{verticalMode ? (
									<>
										{PlaceholderSegment}
										<Divider section />
										{PlaceholderSegment}
									</>
								) : (
									<Grid>
										<Grid.Column width={8}>{PlaceholderSegment}</Grid.Column>
										<Grid.Column width={8}>{PlaceholderSegment}</Grid.Column>
									</Grid>
								)}
							</Segment>
						</Container>
					</div>
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
