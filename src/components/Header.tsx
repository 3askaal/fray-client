import { useContext } from "react";
import Link from "next/link"
import { Cart } from 'react-bootstrap-icons';

export const Header = () => {
  const { products }: any = useContext(CartContext);

  return (
    <div className="header">
      <Link href="/" className="header__logo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 841.9 595.3"
          style="enable-background:new 0 0 841.9 595.3"
          xml:space="preserve"
        >
          <path d="M357 469.3h18.7v4.7h-77.6c-.1-1.4-.1-2.7-.2-4.5h19.9v-16.6c0-24.4.4-48.9-.1-73.3-.5-22.1-6.1-42.7-22.1-59.2-7.9-8.1-17.5-12.4-29.1-12-5.4.2-10.9 0-16.6 0v160.8h18.8v4.8c-1.1.1-2 .3-3 .3h-70.4c-3.1 0-5.5-.2-4-4.9h19.1V136.8c-4.9 0-10 .2-15.1-.1-1.3-.1-2.6-1.6-3.8-2.4 1.2-.8 2.3-2.3 3.5-2.3 29 0 58-.7 86.8.6 35.5 1.7 65.5 25.7 73.4 58.2 4.8 19.7 5.1 40.1-.6 59.7-7.9 27.5-27.5 44.3-54.2 53.3-1.4.5-2.9.9-4.3 1.3-.2 0-.3.2-1.3.8 2.3.8 4.1 1.3 5.8 1.9 30.6 10.6 50.4 30.7 55.8 63.4.6 3.4.7 6.9.7 10.4 0 28.1-.2 56.2-.2 84.3-.2 1-.1 2 .1 3.4zM249.9 137.6v165.5c4.8 0 9.4-.3 14 .1 16.7 1.3 28.9-6.6 37.9-19.6 4.5-6.5 8-13.8 10.8-21.1 7-18.3 5.8-37.5 5.3-56.6-.5-16.6-4.3-32.4-13.5-46.3-15.4-23.6-29.7-24.3-54.5-22zM83.6 301c9.9 0 19.4.2 28.9-.1 6.2-.2 9.7-4.6 12.6-9.4 5.1-8.9 6.5-18.7 7.1-29.1 1.4-.1 2.8-.3 4.6-.5v82.8c-1.2.1-2.6.3-4.2.4-.2-1-.5-1.8-.5-2.6-.5-9.2-2.1-18.1-6.5-26.4-3.7-6.8-8.8-10.8-17.2-10.3-8.1.5-16.2.1-24.6.1v163.4c5.3 0 10.4.2 15.5-.1 3.5-.2 4.5 1.2 3.5 4.8H24.9c-.1-1.3-.1-2.7-.3-4.7h19.3V137.6h-19v-5H166v67.8c-3.2 1.4-4.6.5-4.7-3.3-.3-13.4-2.4-26.5-8.2-38.7-2.4-5-5.8-9.7-9.3-14-4.1-5-9.8-7.1-16.4-7-12.8.1-25.6 0-38.5.1-1.6 0-3.2.1-5.2.2-.1 54.5-.1 108.6-.1 163.3zM736.6 312c17.3-57.6 34.6-115.2 52-173.5h-18.5v-4.9h47.2c.1 1.5.1 2.8.2 4.3-3.1.5-6.1.8-8.9 1.4-10.4 2.3-17.5 8-20.6 18.6-16.1 53.9-32.3 107.7-48.5 161.6-.6 2-1 4.2-1 6.3-.1 46.9 0 93.7 0 140.6 0 1.1.1 2.3.2 3.9H758c.1 1.8.2 3.2.2 4.9h-78.3v-4.7h19.2c.1-1.9.2-3.3.2-4.8V326.1c0-2.1-.2-4.3-.8-6.4-16.8-59.4-33.7-118.7-50.6-178.1-.3-1-.6-1.9-1-3.2h-19.1c-.1-1.8-.2-3.1-.3-4.8h77.9c.1 1.4.2 2.7.4 4.5h-19.5c16.5 58.3 32.9 115.9 49.2 173.6.4.2.7.2 1.1.3zM595.1 382.3c.4-3.5 1.4-7.1 1.1-10.6-1.5-15.4-3.4-30.7-5.2-46-.4-3.6-.8-7.3-1.6-10.8-1.2-4.9-2-10.2-4.4-14.6-6.6-12.2-13.6-24.3-21.1-36-3-4.6-7.7-8-11.8-11.8-1.8-1.6-5.6-1.8-4.1-5.6 1.4-3.5 4.4-5.5 7.9-4.4 4.7 1.4 9.2 3.6 13.7 5.7 1.9.9 3.6 2.2 6.2 3.8.3-2.1.5-3.3.5-4.5.4-13.9.7-27.9 1.2-41.8.1-3-.1-6.3 4.1-7.5 1-.3 1.7-2.6 2.2-4.1 1.8-5.6 5.2-6.7 10.1-3.4 1.5 1 3.4 1.5 5.2 1.9 4.1.8 5.8 3.5 6.6 7.2 1.1 4.6 2 9 8.1 9.8 1.6.2 3.3 2.7 4.1 4.6 10.8 24.3 17.7 49.4 15.4 76.3-.3 3.6-.4 7.4-1.6 10.8-5 13.9-3.4 28.1-2.8 42.4 1.7 36 3.3 72 4.8 108 .2 4.6-.2 9.3-.6 13.9-.6 6.4-4.8 10.4-11.1 10.6-10 .2-20 .1-30 0h-3.3v-.8l-.2-4c-5.2 0-18.2.2-18.2.2-13.3-68.8-28.3-144.2-41.8-213-7.1-36.3-14.2-72.7-21.4-108.9-.8-4 .2-5.8 4.1-5.8 4.3 0 8.6 0 12.9.3 3.7.3 5 2.5 4.7 6.2-.6 6.2.4 7.5 6.6 8.8 3.9.8 6.6 2.6 7.6 6.8.4 1.6 2.6 2.6 3.7 4.1 1.7 2.2 3.3 4.5 4.8 6.8 1.3 1.9 1.8 4.6 3.6 5.9 8.8 6.3 9.2 14.1.7 20.5-22.4 16.8-28.9 50.3-11.9 73 19.6 26.3 31.1 56.2 42.5 86.3 2.5 6.6 4.6 13.4 6.9 20.1.7-.4 1.2-.4 1.8-.4zM436.9 427c.7-19.3.7-38.7 2.3-58 2.5-28.9 9.3-56.9 20.6-83.8 4.5-10.7-1.8-19.6-13.2-19.7-41.4-.2-62.8-29-66.4-62.7-.7-6.5.9-13.7 3.1-20 5.8-16.5 12.5-32.8 20-49 .8 4.4 1.6 8.7 2.6 14.1 4.6-8.3 8.7-15.8 13.4-24.2.7 4.1 1.2 7.1 1.8 10.1.4.4.9.7 1.3 1.1 4.5-5.5 8.9-10.9 13.4-16.4.6.4 1.2.9 1.8 1.3.2 2.4.4 4.7.6 7.7 6.4-2.7 12.6-5.4 20.3-8.6-2.7 3.8-4.5 6.5-6.6 9.4 5.1.4 9.8.4 14.5 1.1 9 1.2 16.8 5.3 23.6 11.1 1.4 1.2 2.3 4 1.9 5.8-17.3 92.5-34.8 184.9-52.3 277.4-.2 1.2-.7 2.4-1.1 3.6-.5-.2-1.1-.3-1.6-.3zM452.9 374.8c20.5 0 40.4 0 60.4.1 1.1 0 3 1.5 3.2 2.5 6.1 30.9 12 61.8 18.1 93.4h-17.3c-.4 1.9-.6 3.7-.9 5-.8.1-1.2 0-1.6.1-20.6 0-41.2.1-61.8 0-6.1 0-9.1-2.7-10.3-8.6-2.5-12.1-3.2-24-.4-36.4 4.1-18.4 7-37.1 10.6-56.1zM515.1 369.7h-61.3c9.9-51.6 19.7-103 29.5-154.3.4 0 .7 0 1.1.1 10.2 51.2 20.4 102.5 30.7 154.2z"/>
        </svg>
      </Link>
      <div className="header__nav">
        <Link href="/shop" className="header__nav__item">Shop</Link>
        <Link href="/contact" className="header__nav__item">Contact</Link>
        <Link href="/cart" className={`header__nav__item ${ products.length ? 'header__nav__item--active' : ''}`}>
          <Cart />
          { !!products.length && (
            <span className="header__nav__item__indicator">
            { products.length }
            </span>
          ) }
        </Link>
      </div>
    </div>
  )
}
