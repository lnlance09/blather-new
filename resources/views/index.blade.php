<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf8mb4">
        <meta name="viewport" content="width=device-width, user-scalable=0">
        <meta name="theme-color" content="#050505">

        <meta property="og:description" content="{{ $description }}">
        <meta property="og:image" content="{{ $img['src'] }}">
        <meta property="og:image:height" content="{{ $img['height'] }}">
        <meta property="og:image:width" content="{{ $img['width'] }}">
        <meta property="og:site_name" content={{ $siteName }} />
        <meta property="og:title" content="{{ $title }}">
        <meta property="og:type" content="website" />
        <meta property="og:url" content="{{ $url }}">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="{{ $twitterHandle }}">
        <meta name="twitter:creator" content="{{ $twitterHandle }}">
        <meta name="twitter:title" content="{{ $title }}">
        <meta name="twitter:description" content="{{ $description }}">
        <meta name="twitter:image" content="{{ $img['src'] }}">

        <meta name="description" content="{{ $description }}">
        <meta name="keywords" content="{{ $keywords }}">
        <meta name="title" content="{{ $title }}">

        <link rel="canonical" href="{{ $url }}" />
        <link rel="home" href="{{ $baseUrl }}" />

        @if ($author)
            <meta property="article:publisher" content="{{ $siteName }}">
            <meta property="article:author" content="{{ $author }}">
            <meta name="author" content="{{ $author }}">

            <link rel="publisher" href="{{ $baseUrl }}">
            <link rel="author" href="{{ $authorUrl }}">
        @endif

        <link rel="manifest" href="/manifest.json">
        <link rel="shortcut icon" href="/favicon.ico?v=3">
        <link rel="apple-touch-icon" sizes="128x128" href="/favicon.ico?v=3">

        @if ($schema)
            <script type="application/ld+json">
                <?php echo json_encode($schema); ?>
            </script>
        @endif

        <!-- React build CSS -->
        <link rel="stylesheet" type="text/css" href="/static/css/2.4a753237.chunk.css">
        <link rel="stylesheet" type="text/css" href="/static/css/main.af8072d4.chunk.css">

        <title>{{ $title }}</title>
    </head>

    <body>
        <noscript>
            You need to enable JavaScript to run this app.
        </noscript>
        <div id="root"></div>
    </body>

    <script>
        var sc_project=11316702;
        var sc_invisible=1;
        var sc_security="b7d7f089";
    </script>
    <script src="https://www.statcounter.com/counter/counter.js" async></script>

    <!-- Start Alexa Certify Javascript -->
    <script>
        _atrk_opts = { atrk_acct:"r9gPs1KAfD20Cs", domain:"blather.io",dynamic: true};
        (function() { var as = document.createElement('script'); as.type = 'text/javascript'; as.async = true; as.src = "https://certify-js.alexametrics.com/atrk.js"; var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(as, s); })();
    </script>
    <noscript>
        <img src="https://certify.alexametrics.com/atrk.gif?account=r9gPs1KAfD20Cs" style="display:none" height="1" width="1" alt="" />
    </noscript>

    <!-- React build JS -->
    <script src="/static/js/2.27f70a28.chunk.js"></script>
    <script src="/static/js/main.2ae43eab.chunk.js"></script>
    <script src="/static/js/runtime-main.4849eda3.js"></script>
</html>
