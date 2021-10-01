import { Button, Dimmer, Header, Icon, Image } from "semantic-ui-react"
import { useState } from "react"
import Dropzone from "react-dropzone"
import ImagePic from "images/images/image-square.png"
import PropTypes from "prop-types"

const ImageUpload = ({ callback, fluid, headerSize, inverted, img, imgSize, msg }) => {
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
						<Header className="imageUploadHeader" inverted size={headerSize}>
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
			<Dimmer.Dimmable
				as={Image}
				circular
				dimmed={active}
				dimmer={{ active, content, inverted: false }}
				fluid={fluid}
				onError={(i) => (i.target.src = ImagePic)}
				onMouseEnter={() => setActive(true)}
				onMouseLeave={() => setActive(false)}
				size={fluid ? null : imgSize}
				src={img}
			/>
		</div>
	)
}

ImageUpload.propTypes = {
	callback: PropTypes.func,
	fluid: PropTypes.bool,
	headerSize: PropTypes.string,
	img: PropTypes.string,
	inverted: PropTypes.bool,
	imgSize: PropTypes.string,
	msg: PropTypes.string
}

ImageUpload.defaultProps = {
	fluid: false,
	headerSize: "medium",
	img: ImagePic,
	imgSize: "small",
	inverted: true,
	msg: "Select a picture"
}

export default ImageUpload
