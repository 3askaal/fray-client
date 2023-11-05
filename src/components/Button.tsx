import Link from "next/link"
import cl from 'classnames';
import style from './Button.module.scss'

export const Button = ({ children, to, block, disabled, size, state,type, onClick }: any) => {
  const className = cl({
    [style['button']]: true,
    [style['button--block']]: block,
    [style['button--disabled']]: disabled,
    [style[`button--${size}`]]: size,
    [style[`button--${state}`]]: state,
  });

  return to ? (
    <Link href={to} className={className}>
      { children }
    </Link>
  ) : (
    <Button type={type} className={className} onClick={onClick}>
      { children }
    </Button>
  )
}
