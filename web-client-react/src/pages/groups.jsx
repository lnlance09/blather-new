import { Divider, Header, Image, Loader, Segment } from "semantic-ui-react"
import { useContext, useEffect, useReducer } from "react"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getConfig } from "options/toast"
import { toast } from "react-toastify"
import axios from "axios"
import DefaultLayout from "layouts/default"
import initialState from "states/groups"
import logger from "use-reducer-logger"
import PlaceholderPic from "images/images/image-square.png"
import PropTypes from "prop-types"
import ReactTooltip from "react-tooltip"
import reducer from "reducers/groups"
import ThemeContext from "themeContext"

const toastConfig = getConfig()
toast.configure(toastConfig)

const Groups = ({ history }) => {
	const { inverted } = useContext(ThemeContext)

	const [internalState, dispatch] = useReducer(
		process.env.NODE_ENV === "development" ? logger(reducer) : reducer,
		initialState
	)
	const { error, groups, loaded } = internalState

	useEffect(() => {
		const getGroups = async () => {
			await axios
				.get(`${process.env.REACT_APP_BASE_URL}groups`)
				.then(async (response) => {
					const groups = response.data.data
					dispatch({
						type: "GET_GROUPS",
						groups
					})
				})
				.catch(() => {
					dispatch({
						type: "SET_GROUPS_ERROR"
					})
					toast.error("There was an error")
				})
		}

		getGroups()
	}, [])

	return (
		<DefaultLayout
			activeItem="groups"
			containerClassName="groupsPage"
			history={history}
			inverted={inverted}
		>
			<DisplayMetaTags page="groups" />

			<Header as="h1" content="Groups" />

			<Divider hidden />

			{loaded && (
				<>
					{!error && (
						<>
							{groups.map((group, i) => (
								<Segment basic>
									<Header content={group.name} />
									<p>{group.description}</p>

									<div className="tiles">
										{group.members.data.map((m, i) => (
											<div className="tile">
												<Image
													data-for={`groupsMember${i}`}
													data-iscapture="true"
													data-tip={m.page.name}
													onClick={() =>
														history.push(
															`/pages/${m.page.network}/${m.page.username}`
														)
													}
													onError={(e) => (e.target.src = PlaceholderPic)}
													rounded
													src={m.page.image}
												/>
												<ReactTooltip
													className="tooltipClass"
													effect="solid"
													id={`groupsMember${i}`}
													multiline={false}
													place="left"
													type="dark"
												/>
											</div>
										))}
									</div>
								</Segment>
							))}
						</>
					)}
				</>
			)}
			{!loaded && (
				<div className="centeredLoader">
					<Loader active inverted={inverted} size="big" />
				</div>
			)}
		</DefaultLayout>
	)
}

Groups.propTypes = {
	history: PropTypes.object
}

export default Groups
