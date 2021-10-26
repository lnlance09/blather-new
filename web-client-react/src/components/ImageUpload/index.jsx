import "./style.scss"
import { Button, Dimmer, Header, Icon, Image } from "semantic-ui-react"
import { useState } from "react"
import Dropzone from "react-dropzone"
import ImagePic from "images/images/image-square.png"
import PropTypes from "prop-types"

const ImageUpload = ({
	as = "image",
	callback = () => null,
	fluid = false,
	headerSize = "medium",
	img = ImagePic,
	imgSize = "small",
	msg = "Select a picture"
}) => {
	const [active, setActive] = useState(false)

	const onDrop = async (files) => {
		if (files.length > 0) {
			await callback(files[0])
			setActive(false)
		}
	}

	const content = (
		<Dropzone onDrop={onDrop}>
			{({ getRootProps, getInputProps }) => (
				<section>
					<div {...getRootProps()}>
						<input {...getInputProps()} />
						<Header className="imageUploadHeader" size={headerSize}>
							{msg}
						</Header>
						<Button className="changePicBtn" color="blue" icon>
							<Icon name="image" />
						</Button>
					</div>
				</section>
			)}
		</Dropzone>
	)

	return (
		<div className="imageUpload">
			{as === "image" && (
				<Dimmer.Dimmable
					as={Image}
					dimmed={active}
					dimmer={{ active, content, inverted: true }}
					fluid={fluid}
					onError={(i) => (i.target.src = ImagePic)}
					onMouseEnter={() => setActive(true)}
					onMouseLeave={() => setActive(false)}
					rounded
					size={fluid ? null : imgSize}
					src={img}
				/>
			)}

			{as === "segment" && (
				<>
					<Dropzone onDrop={onDrop}>
						{({ getRootProps, getInputProps }) => (
							<section>
								<div {...getRootProps()}>
									<input {...getInputProps()} />
									<Header
										className="imageUploadHeader"
										inverted
										size={headerSize}
									>
										<Button
											circular
											color="green"
											icon="plus"
											onClick={(e) => e.preventDefault()}
											size={headerSize}
										/>
										<Header.Content>{msg}</Header.Content>
									</Header>
								</div>
							</section>
						)}
					</Dropzone>
				</>
			)}
		</div>
	)
}

ImageUpload.propTypes = {
	as: PropTypes.string,
	callback: PropTypes.func,
	fluid: PropTypes.bool,
	headerSize: PropTypes.string,
	img: PropTypes.string,
	imgSize: PropTypes.string,
	msg: PropTypes.string
}

export default ImageUpload
