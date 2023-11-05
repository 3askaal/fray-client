import style from './Footer.module.scss'

export const Footer = ({ children }: any) => {
  return (
    <div className={style.footer}>
      { children }
    </div>
  )
}
