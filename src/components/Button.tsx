import Link from "next/link"
import cl from 'classnames';

export const Button = ({ children, to, block, disabled, size, state,type, onClick }: any) => {
  const className = cl({
    'button': true,
    'button--block': block,
    'button--disabled': disabled,
    [`button--${size}`]: size,
    [`button--${state}`]: state,
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
