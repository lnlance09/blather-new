import "./style.scss"
import { Divider, Placeholder, Segment } from "semantic-ui-react"
import PlaceholderPic from "images/images/image.png"
import PropTypes from "prop-types"

const PageList = ({
	defaultUserImg,
	history,
	inverted,
	loading,
	loadingMore,
	onClickPage,
	pages
}) => {
	const PlaceholderSegment = (
		<Placeholder inverted={inverted} fluid>
			<Placeholder.Paragraph>
				<Placeholder.Line />
				<Placeholder.Line />
				<Placeholder.Line />
			</Placeholder.Paragraph>
		</Placeholder>
	)

	return (
		<div className="tweetList">
			{pages.map((page, i) => {
				const { id } = page
				return (
					<div
						className={loading ? "loading" : null}
						key={`page${i}`}
						onClick={(e) => onClickPage(e, id)}
					>
						{loading && <Segment fluid>{PlaceholderSegment}</Segment>}
						{!loading && <></>}
						<Divider hidden />
					</div>
				)
			})}
			{loadingMore && (
				<div className="loading" key="loadingMore">
					<Segment fluid>{PlaceholderSegment}</Segment>
				</div>
			)}
		</div>
	)
}

PageList.propTypes = {
	defaultUserImg: PropTypes.string,
	inverted: PropTypes.bool,
	loading: PropTypes.bool,
	loadingMore: PropTypes.bool,
	onClickPage: PropTypes.func,
	pages: PropTypes.arrayOf(PropTypes.shape({}))
}

export default PageList
