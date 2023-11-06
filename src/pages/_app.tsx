import { Header } from '@/components'

import '../assets/fonts/onyx/stylesheet.css';
import './app.scss';

const App = ({ Component, pageProps }: any) => {
  return (
    <>
      <Header />
      <div style={{ paddingTop: '200px', paddingBottom: '100px' }}>
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default App
