import { Container, Grid, Segment } from "semantic-ui-react"
import { useContext } from "react"
import PageFooter from "components/Footer"
import PageHeader from "components/Header"
import PropTypes from "prop-types"
import ThemeContext from "themeContext"

const DefaultLayout = ({
	activeItem,
	children,
	containerClassName,
	history,
	showFooter = true,
	simpleHeader,
	useContainer = true,
	useGrid
}) => {
	const { state } = useContext(ThemeContext)
	const { auth, inverted } = state

	const appClass = `appWrapper ${inverted ? "inverted" : ""} ${auth ? "auth" : ""}`

	const mainPage = (
		<>
			<PageHeader
				activeItem={activeItem}
				history={history}
				inverted={inverted}
				simple={simpleHeader}
			/>
			{useGrid ? (
				<Grid className="mainGrid" stackable>
					<Grid.Column className="leftColumn" width={4}></Grid.Column>
					<Grid.Column width={12}>{children}</Grid.Column>
				</Grid>
			) : (
				<div className="mainContent">{children}</div>
			)}
		</>
	)

	return (
		<div className={appClass}>
			<>
				{useContainer ? (
					<Container
						className={`mainContainer ${containerClassName} ${
							inverted ? "inverted" : ""
						}`}
					>
						<Segment className="mainContainerSegment">{mainPage}</Segment>
					</Container>
				) : (
					<Segment
						className={`mainContainer ${containerClassName} ${
							inverted ? "inverted" : ""
						}`}
					>
						{mainPage}
					</Segment>
				)}

				{showFooter && <PageFooter history={history} inverted />}
			</>
		</div>
	)
}

DefaultLayout.propTypes = {
	activeItem: PropTypes.string,
	children: PropTypes.node,
	containerClassName: PropTypes.string,
	history: PropTypes.object,
	inverted: PropTypes.bool,
	showFooter: PropTypes.bool,
	simpleHeader: PropTypes.bool,
	useContainer: PropTypes.bool,
	useGrid: PropTypes.bool
}

export default DefaultLayout
