import { Header } from '@/components'
import { useRouter } from 'next/router';
import { CartProvider } from '@/context/CartContext';

import '../assets/fonts/onyx/stylesheet.css';
import './app.scss';
import classNames from 'classnames';

const App = ({ Component, pageProps }: any) => {
  const { pathname } = useRouter();

  return (
    <CartProvider>
      <Header />
      <div className={classNames({ wrapper: pathname !== '/'})}>
        <Component {...pageProps} />
      </div>
    </CartProvider>
  )
}

export default App
