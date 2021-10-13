import { useState } from "react"
import { Container, Grid } from "semantic-ui-react"
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
	showFooter,
	showResults,
	useContainer = true,
	simpleHeader,
	useGrid
}) => {
	const [searchMode, setSearchMode] = useState(false)

	const mainPage = (
		<>
			<PageHeader
				activeItem={activeItem}
				history={history}
				inverted={inverted}
				q={q}
				showResults={showResults}
				simple={simpleHeader}
				toggleSearchMode={() => setSearchMode(true)}
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
			{searchMode ? (
				<Container className="searchModeContainer">
					<Grid>
						<Grid.Row>
							<Grid.Column width={13}></Grid.Column>
							<Grid.Column width={3}>
								<span
									className="closeSearchMode"
									onClick={() => setSearchMode(false)}
								>
									Cancel
								</span>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Container>
			) : (
				<>
					{useContainer ? (
						<Container
							className={`mainContainer ${containerClassName} ${
								inverted ? "inverted" : ""
							}`}
						>
							{mainPage}
						</Container>
					) : (
						<div
							className={`mainContainer ${containerClassName} ${
								inverted ? "inverted" : ""
							}`}
						>
							{mainPage}
						</div>
					)}

					{showFooter && <PageFooter history={history} inverted />}
				</>
			)}
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
