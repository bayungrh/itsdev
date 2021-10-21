/* eslint-disable react/jsx-no-comment-textnodes */
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
        </Head>
        <body className="p-8 max-w-xl m-auto">
          <Main />
          <NextScript />
        </body>
        <script src="https://cdn.statically.io/libs/typed.js/2.0.11/typed.min.js"></script>
      </Html>
    )
  }
}

export default MyDocument;
