import "./style.scss"
import { Button, Dimmer, Header, Icon, Image, Placeholder } from "semantic-ui-react"
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
	loading = false,
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
				<>
					{loading ? (
						<Placeholder image style={{ height: "150px", width: "150px" }} />
					) : (
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
				</>
			)}

			{as === "segment" && (
				<>
					<Dropzone onDrop={onDrop}>
						{({ getRootProps, getInputProps }) => (
							<section>
								<div {...getRootProps()}>
									<input {...getInputProps()} />
									<div className="imageUploadHeader">
										<Icon
											circular
											color="blue"
											name="image"
											onClick={(e) => e.preventDefault()}
										/>
										<span>{msg}</span>
									</div>
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
	loading: PropTypes.bool,
	msg: PropTypes.string
}

export default ImageUpload
