import * as path from "path"
import fs from "fs"
import Marked from "marked"
import URI from "urijs"

const renderer = new Marked.Renderer()
renderer.paragraph = function (text) {
	if (text.trim().startsWith("<img")) {
		return `${text} \n`
	}
	return `<p>${text}</p>`
}
renderer.image = function (href, title, text) {
	const ext = path.extname(href)
	const uri = URI(href)
	const localPath = this.options.localVideoPath ? this.options.localVideoPath : ""
	let alt = null
	let out = null

	if (uri.hostname() === "www.youtube.com") {
		out = `<iframe width="560" height="315" src="//www.youtube.com/embed/${uri
			.query()
			.substring(2)}" frameborder="0" allowfullscreen></iframe>`
	} else if (uri.hostname() === "vimeo.com") {
		out = `<iframe src="//player.vimeo.com/video/${uri.path().split("/").pop()}
			" width="560" height="315" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`
	} else if (ext !== ".webm" && ext !== ".mp4") {
		out = `<img src="${href}" alt="${text}" class="ui medium bordered rounded image spaced left"`
		if (title) {
			out += ` title="${title}" `
		}
		out += "/>"
	} else {
		out = "<video controls"
		if (title) {
			out += ` poster="${title}"`
		}
		out += ">"
		out += `<source src="${href}" type="video/${ext.replace(".", "")}">`

		if (uri.protocol() === "" && ext === ".webm") {
			alt = `${href.slice(0, -5)}.mp4`

			if (fs.existsSync(localPath + alt)) {
				out += `<source src="${alt}" type="video/mp4">`
			}
		}

		if (text) {
			out += text
		}

		out += "</video>"
	}

	return out
}

export default renderer

export const tweetOptions = {
	assignable: false,
	crossOriginAnonymous: false,
	externalLink: false,
	handleHoverOn: () => null,
	highlight: false,
	highlightedText: "",
	imageSize: "medium",
	onClickCallback: () => null,
	opacity: 1,
	raised: false,
	showCopyUrlOption: false,
	showSaveOption: false,
	showStats: true
}
