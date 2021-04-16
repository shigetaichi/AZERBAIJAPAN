import React from 'react'
import styles from './Footer.module.scss';
import ClassNames from 'classnames';
import { ThemeContext, useThemeContext } from 'context/context';

const Footer = () => {
  const themeNames: ThemeContext = useThemeContext();
  const FooterStyle = ClassNames(styles.footer, {
    [styles.dark]: themeNames.themeName === 'dark'
  })
  return (
    <footer className={FooterStyle}>
      <div className="module-spacer--medium"/>
      <a className={styles.instagram_icon} href="https://www.instagram.com/azerbaijapan/">
        <img src={"/instagram.svg"} alt="instagram icon"/>
      </a>
      <div className="module-spacer--extra-extra-small"/>
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
      >
        © 2020 AZERBAIJAPAN
      </a>
    </footer>
  )
}

export default Footer
