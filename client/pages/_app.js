import '@/styles/globals.css'


function MyApp({ Component, pageProps }) {
  // A simple structure that wraps every page
  return (
    <Component {...pageProps} />
  )
}

export default MyApp;