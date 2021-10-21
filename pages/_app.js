import '../styles/globals.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>itsdev.id - A free identity for web developers.</title>
        <meta name="description" content="A free subdomain as an identity for web developers." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mbn12_" />
        <meta name="twitter:title" content="itsdev.id" />
        <meta name="twitter:description" content="A free subdomain as an identity for web developers." />
        <meta property="og:url" content="https://itsdev.id/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="itsdev.id" />
        <meta property="og:description" content="A free subdomain as an identity for web developers." />
        <link rel="icon shortcut" type="image/x-icon" href="/favicon.ico"/>
        <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet"/>
        <link href="https://cdn.jsdelivr.net/npm/@tailwindcss/custom-forms@0.2.1/dist/custom-forms.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp;
