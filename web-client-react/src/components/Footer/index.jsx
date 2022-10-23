import "./style.scss"
import { Container, List, Segment } from "semantic-ui-react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"

const Footer = ({ history }) => {
	return (
		<Segment attached="bottom" className="footerSegment" inverted>
			<Container>
				<List className="footerList" horizontal inverted link>
					<List.Item>
						<Link to="/about">About</Link>
					</List.Item>
					<List.Item>
						<Link to="/contact">Contact</Link>
					</List.Item>
					<List.Item>
						<Link to="/privacy">Privacy</Link>
					</List.Item>
					<List.Item>
						<Link to="/rules">Rules</Link>
					</List.Item>
				</List>
				<p>© 2018 - 2023, Blather</p>
			</Container>
		</Segment>
	)
}

Footer.propTypes = {
	history: PropTypes.object,
	inverted: PropTypes.bool
}

export default Footer
