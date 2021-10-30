import { Container, Grid, Segment } from "semantic-ui-react"
import PageFooter from "components/Footer"
import PageHeader from "components/Header"
import PropTypes from "prop-types"

const DefaultLayout = ({
	activeItem,
	children,
	containerClassName,
	history,
	inverted,
	q,
	showFooter = true,
	showResults,
	useContainer = true,
	simpleHeader,
	useGrid
}) => {
	const mainPage = (
		<>
			<PageHeader
				activeItem={activeItem}
				history={history}
				inverted={inverted}
				q={q}
				showResults={showResults}
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
		<div className={`appWrapper ${inverted ? "inverted" : ""}`}>
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
	q: PropTypes.string,
	showFooter: PropTypes.bool,
	showResults: PropTypes.bool,
	simpleHeader: PropTypes.bool,
	useContainer: PropTypes.bool,
	useGrid: PropTypes.bool
}

export default DefaultLayout
