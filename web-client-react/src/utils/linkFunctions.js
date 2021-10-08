export const onClickRedirect = (e, history, url) => {
	if (e.metaKey) {
		window.open(url, "_blank").focus()
	} else {
		history.push(url)
	}
}
