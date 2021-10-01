import "./style.scss"
import { Container, Grid, Header, List, Segment } from "semantic-ui-react"
import PropTypes from "prop-types"

const etherAddress = "0xce8247d7e3a194ea46c1c5eac2dc151b6a0b4d9a"

const Footer = ({ history, inverted }) => {
	return (
		<div className="pageFooterComponent">
			<Segment inverted={inverted} vertical>
				<Container>
					<Grid inverted={inverted} stackable>
						<Grid.Row>
							<Grid.Column width={3}>
								<Header as="h4" inverted={inverted}>
									About
								</Header>
								<List inverted={inverted} link relaxed>
									<List.Item as="a" onClick={() => history.push("/about")}>
										About
									</List.Item>
									<List.Item as="a" onClick={() => history.push("/rules")}>
										Rules
									</List.Item>
									<List.Item as="a" onClick={() => history.push("/contact")}>
										Contact
									</List.Item>
								</List>
							</Grid.Column>
							<Grid.Column width={3}>
								<Header as="h4" inverted={inverted}>
									Follow Us
								</Header>
								<List inverted={inverted} link relaxed>
									<List.Item
										as="a"
										onClick={() =>
											window
												.open(`https://twitter.com/preditcapp`, "_blank")
												.focus()
										}
									>
										Twitter
									</List.Item>
								</List>
							</Grid.Column>
							<Grid.Column width={7}>
								<Header as="h4" inverted={inverted}>
									Support Us
								</Header>
								<List inverted={inverted} link relaxed>
									<List.Item>
										<List.Icon color="blue" name="ethereum" />
										<List.Content>
											<a
												className="etherLink"
												href={`https://etherscan.io/address/${etherAddress}`}
												target="_blank"
												rel="noreferrer"
											>
												{etherAddress}
											</a>
										</List.Content>
									</List.Item>
								</List>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Container>
			</Segment>
		</div>
	)
}

Footer.propTypes = {
	history: PropTypes.object,
	inverted: PropTypes.bool
}

export default Footer
