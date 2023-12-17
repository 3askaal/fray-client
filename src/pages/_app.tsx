import { Header } from '@/components'
import { useRouter } from 'next/router';
import { CartProvider } from '@/context/CartContext';
import classNames from 'classnames';

import '../assets/fonts/onyx/stylesheet.css';
import './app.scss';

const App = ({ Component, pageProps }: any) => {
  const { pathname } = useRouter();

  return (
    <CartProvider>
      <Header />
      <div className={classNames({ wrapper: pathname !== '/', contact: pathname === '/contact' })}>
        <Component {...pageProps} />
      </div>
    </CartProvider>
  )
}

export default App
