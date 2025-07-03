import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { type ReactElement } from 'react';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) =>
            function EnhancedApp(props) {
              return <App {...props} />;
            },
        });

      // @ts-ignore - getInitialProps is a static method
      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: [initialProps.styles],
      };
    } catch (error) {
      console.error('Error in _document:', error);
      throw error;
    }
  }

  render() {
    return (
      <Html lang="en" suppressHydrationWarning>
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="description" content="Your app description" />
          
          {/* Preconnect to external domains */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          
          {/* Favicon */}
          <link
            rel="icon"
            href="/favicon.ico"
            sizes="any"
          />
          <link
            rel="icon"
            href="/icon.svg"
            type="image/svg+xml"
          />
          <link
            rel="apple-touch-icon"
            href="/apple-touch-icon.png"
          />
          <link
            rel="manifest"
            href="/site.webmanifest"
            crossOrigin="use-credentials"
          />
        </Head>
        <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
