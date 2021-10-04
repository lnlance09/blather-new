import { Container, Grid } from "semantic-ui-react"
import { useState } from "react"
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
	simpleHeader,
	useGrid
}) => {
	const [searchMode, setSearchMode] = useState(false)

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
					<Container
						className={`mainContainer ${containerClassName} ${
							inverted ? "inverted" : ""
						}`}
					>
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
					</Container>

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
	useGrid: PropTypes.bool
}

DefaultLayout.defaultProps = {
	activeItem: null,
	containerClassName: "",
	inverted: false,
	q: "",
	showFooter: true,
	showResults: true,
	simpleHeader: false,
	useGrid: false
}

export default DefaultLayout
