import { Header } from '@/components'
import { CartProvider } from '@/context/CartContext';

import '../assets/fonts/onyx/stylesheet.css';
import './app.scss';

const App = ({ Component, pageProps }: any) => {
  return (
    <CartProvider>
      <Header />
      <div className="wrapper" style={{ paddingTop: '200px', paddingBottom: '100px' }}>
        <Component {...pageProps} />
      </div>
    </CartProvider>
  )
}

export default App
