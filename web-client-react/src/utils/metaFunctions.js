import MetaTags from "react-meta-tags"

export const DisplayMetaTags = ({ page, state }) => {
	const twitterHandle = "blatherio"
	const baseUrl = "https://blather.io"
	const siteName = "Blather"
	const description = `${siteName} is a website and application that lets users assign logical fallacies to tweets. You can make political memes out of tweets and fallacies.`
	const img = ""
	let metaTags = {
		description,
		img,
		title: siteName
	}

	switch (page) {
		case "about":
			metaTags = {
				description,
				img,
				title: `About - ${siteName}`
			}
			break
		case "activity":
			metaTags = {
				description,
				img,
				title: `Activity - ${siteName}`
			}
			break
		case "argument":
			metaTags = {
				description,
				img,
				title: `Arguments - ${siteName}`
			}
			break
		case "arguments":
			metaTags = {
				description,
				img,
				title: `Arguments - ${siteName}`
			}
			break
		case "assign":
			metaTags = {
				description,
				img,
				title: `Assign a Logical Fallacy - ${siteName}`
			}
			break
		case "contact":
			metaTags = {
				description,
				img,
				title: `Contact Us - ${siteName}`
			}
			break
		case "fallacy":
			const { fallacy } = state
			if (state.loaded && !state.error) {
				metaTags = {
					description: fallacy.explanation,
					img: fallacy.user.image,
					title: `${fallacy.reference.name} Fallacy by ${fallacy.page.name}`
				}
			}
			break
		case "forgot":
			metaTags = {
				description: "Reset your password",
				img,
				title: `Reset Your Password - ${siteName}`
			}
			break
		case "grifters":
			metaTags = {
				description: "Grifters",
				img,
				title: `Grifters - ${siteName}`
			}
			break
		case "groups":
			metaTags = {
				description: "Groups",
				img,
				title: `Groups - ${siteName}`
			}
			break
		case "notFound":
			metaTags = {
				description,
				img,
				title: `Not Found - ${siteName}`
			}
			break
		case "page":
			const { page } = state
			if (state.loaded && !state.error) {
				metaTags = {
					description: page.bio,
					img: page.image,
					title: `${page.name} - ${siteName}`
				}
			}
			break
		case "privacy":
			metaTags = {
				description,
				img,
				title: `Privacy - ${siteName}`
			}
			break
		case "reference":
			metaTags = {
				description,
				img,
				title: `Reference - ${siteName}`
			}
			break
		case "rules":
			metaTags = {
				description,
				img,
				title: `Rules - ${siteName}`
			}
			break
		case "savedTweets":
			metaTags = {
				description,
				img,
				title: `Saved Tweets - ${siteName}`
			}
			break
		case "search":
			metaTags = {
				description,
				img,
				title: `Search - ${siteName}`
			}
			break
		case "settings":
			metaTags = {
				description,
				img,
				title: `Settings - ${siteName}`
			}
			break
		case "signin":
			metaTags = {
				description,
				img,
				title: `Sign In - ${siteName}`
			}
			break
		case "tweet":
			const { tweet } = state
			if (state.loaded && !state.error) {
				metaTags = {
					description,
					img: tweet.user.img,
					title: `Tweet by ${tweet.user.name} - ${siteName}`
				}
			}
			break
		case "tweets":
			metaTags = {
				description,
				img,
				title: `Tweets - ${siteName}`
			}
			break
		case "user":
			const { member } = state
			if (state.loaded && !state.error) {
				metaTags = {
					description: member.bio,
					img: member.img,
					title: `${member.name} - ${siteName}`
				}
			}
			break
		case "video":
			const { video } = state
			if (state.loaded && !state.error) {
				metaTags = {
					description: video.description,
					img: video.img,
					title: `${video.title} - ${siteName}`
				}
			}
			break
		default:
			metaTags = {
				description,
				img,
				title: siteName
			}
	}

	return (
		<MetaTags>
			<meta property="og:description" content={metaTags.description} />
			<meta property="og:image" content={metaTags.img} />
			<meta property="og:site_name" content={siteName} />
			<meta property="og:title" content={metaTags.title} />
			<meta property="og:type" content="website" />
			<meta property="og:url" content={window.location.href} />

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:site" content={`@${twitterHandle}`} />
			<meta name="twitter:creator" content={`@${twitterHandle}`} />
			<meta name="twitter:title" content={metaTags.title} />
			<meta name="twitter:description" content={metaTags.description} />
			<meta name="twitter:image" content={metaTags.img} />

			<meta name="description" content={metaTags.description} />
			<meta name="keywords" content="" />
			<meta name="title" content={metaTags.title} />

			{page === "fallacy" && (
				<>
					<meta property="article:publisher" content={siteName} />
					<meta property="article:author" content={state.fallacy.user.name} />
					<meta name="author" content={state.fallacy.user.name} />

					<link rel="publisher" href={baseUrl} />
					<link rel="author" href={`${baseUrl}/${state.fallacy.user.username}`} />
				</>
			)}

			<link rel="canonical" href={window.location.href} />
			<link rel="home" href={baseUrl} />

			<title>{metaTags.title}</title>
		</MetaTags>
	)
}
