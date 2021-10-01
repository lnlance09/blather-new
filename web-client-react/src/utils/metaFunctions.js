import MetaTags from "react-meta-tags"
import moment from "moment"

export const DisplayMetaTags = ({ page, state }) => {
	const twitterHandle = "preditc"
	const baseUrl = "https://preditc.com"
	const siteName = "Preditc"
	const description = `${siteName} is a social network that is used to share ideas and opinions about cryptocurrencies and their future performances`
	const img = ""
	let metaTags = {}

	switch (page) {
		case "about":
			metaTags = {
				description,
				img,
				title: `About - ${siteName}`
			}
			break
		case "applications":
			metaTags = {
				description,
				img,
				title: `My Applications - ${siteName}`
			}
			break
		case "coin":
			metaTags = {
				description: state.loaded ? state.coin.description : description,
				img: state.loaded ? state.coin.logo : img,
				title: state.loaded ? `${state.coin.name} - ${siteName}` : siteName
			}
			break
		case "coins":
			metaTags = {
				description: "Browse cryptocurrencies, tokens and coins on preditc.com",
				img,
				title: `Coins - ${siteName}`
			}
			break
		case "contact":
			metaTags = {
				description,
				img,
				title: `Contact Us - ${siteName}`
			}
			break
		case "createWallet":
			metaTags = {
				description: `Generate an ${state.coin.name} wallet online that includes address, public key and private key. Fast. Free. Secure.`,
				img,
				title: `Generate ${state.coin.name} Address Online - ${siteName}`
			}
			break
		case "forgot":
			metaTags = {
				description: "Reset your password",
				img,
				title: `Reset Your Password - ${siteName}`
			}
			break
		case "prediction":
			const { prediction } = state
			const pCoin = prediction.coin
			const pUser = prediction.user
			const pDate = moment(prediction.targetDate).format("MMM D, YYYY")
			const pPrice = prediction.predictionPrice
			const price = state.loaded ? (pPrice > 1 ? pPrice.toFixed(2) : pPrice.toFixed(6)) : null
			const pTitle = state.loaded
				? `${pCoin.name} to $${price} on ${pDate} - ${pUser.name} - ${siteName}`
				: null
			metaTags = {
				description: prediction.explanation,
				img: pUser.img,
				title: state.loaded ? pTitle : siteName
			}
			break
		case "predictions":
			metaTags = {
				description: "Browse cryptocurrency predictions on preditc.com",
				img,
				title: `Predictions - ${siteName}`
			}
			break
		case "privacy":
			metaTags = {
				description,
				img,
				title: `Privacy - ${siteName}`
			}
			break
		case "rules":
			metaTags = {
				description,
				img,
				title: `Rules - ${siteName}`
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
		case "trader":
			metaTags = {
				description: state.loaded ? state.trader.bio : description,
				img: state.loaded ? state.trader.img : img,
				title: state.loaded ? `${state.trader.name} - ${siteName}` : siteName
			}
			break
		case "traders":
			metaTags = {
				description: "Browse some of the best cryptocurrency traders on preditc.com",
				img,
				title: `Traders - ${siteName}`
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
			<meta
				name="keywords"
				content="cryptocurrency,coins,tokens,predictions,bitcoin,ethereum,influencers,technical analysis,wall street"
			/>
			<meta name="title" content={metaTags.title} />

			{page === "prediction" && (
				<>
					<meta property="article:publisher" content={siteName} />
					<meta property="article:author" content={state.prediction.user.name} />
					<meta name="author" content={state.prediction.user.name} />

					<link rel="publisher" href={baseUrl} />
					<link rel="author" href={`${baseUrl}/${state.prediction.user.username}`} />
				</>
			)}

			<link rel="canonical" href={window.location.href} />
			<link rel="home" href={baseUrl} />

			<title>{metaTags.title}</title>
		</MetaTags>
	)
}
