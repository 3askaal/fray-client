import { Header } from '@/components'
import './app.scss'

export default function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  )
}
