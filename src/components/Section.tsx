import style from './Section.module.scss'

export const Section = ({ children }: any) => {
  return (
    <div className={style.section}>
      { children }
    </div>
  )
}
