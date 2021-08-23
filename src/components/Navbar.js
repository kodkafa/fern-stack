import {inject, observer} from 'mobx-react'
import React, {useEffect} from 'react'
import {Link, NavLink} from 'react-router-dom'
import {HashLink} from 'react-router-hash-link'
import {SystemMessages} from './SystemMessages'
import logo from '../assets/img/logo.svg'
import {ImageViewer} from './ImageViewer'
import {useTranslation} from 'react-i18next'
import packageJSON from '../../package.json'

// const dropDownToggle = (e) => {
//   const dd = e.currentTarget;
//   dd.classList.toggle('show');
//   dd.querySelector('.dropdown-menu').classList.toggle('show');
// }

const Shrink = (e, shrink) => {
  const navbar = document.getElementById('navbar')
  if (navbar)
    if (shrink || window.pageYOffset > 0) {
      navbar.classList.add('navbar-shrink')
    } else {
      navbar.classList.remove('navbar-shrink')
    }
}

export const Navbar = inject('AuthStore')(
  observer(props => {
    const {i18n, t} = useTranslation()
    const {language} = i18n

    const {authenticated, me = {}} = props.AuthStore

    const isShrink = props.className.indexOf('navbar-shrinked') > -1

    useEffect(() => {
      if (!isShrink) {
        Shrink(null, !!me.uid)
        window.addEventListener('scroll', Shrink)
      }
    }, [me.uid, isShrink])

    const renderLogo = () => {
      return (
        <Link
          to={me.uid ? '/dashboard' : '/'}
          className="navbar-brand"
          key="logo">
          <img id="logo" src={logo} className="img-fluid" alt="logo" />
          <span className="version">v{packageJSON.version}</span>
        </Link>
      )
    }
    const renderLinks = () => {
      if (authenticated) {
        return (
          <React.Fragment>
            {me.isUser && (
              <li className="nav-item">
                <Link className="nav-link" to="/features">
                  {t('Features')}
                </Link>
              </li>
            )}
            {me.isWorker && (
              <li className="nav-item">
                <Link className="nav-link" to="/works">
                  {t('Works')}
                </Link>
              </li>
            )}
            {(me.isManager || me.isAdmin) && (
              <li className="nav-item">
                <Link className="nav-link" to="/users">
                  {t('Users')}
                </Link>
              </li>
            )}
            {me.isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/projects">
                  {t('Projects')}
                </Link>
              </li>
            )}
            {(me.isEditor || me.isManager || me.isAdmin) && (
              <li className="nav-item">
                <Link className="nav-link" to="/posts">
                  {t('Posts')}
                </Link>
              </li>
            )}
          </React.Fragment>
        )
      } else {
        return [
          <li className="nav-item" key="about">
            <HashLink smooth className="nav-link" to="/#about">
              {t('About')}
            </HashLink>
          </li>,
          <li className="nav-item" key="features">
            <Link className="nav-link" to="/features">
              {t('Features')}
            </Link>
          </li>,
        ]
      }
    }

    const renderUserMenu = () => {
      if (authenticated) {
        return [
          <li className="nav-item dropdown" key="userMenu">
            <span
              className="nav-link dropdown-toggle"
              id="userMenu"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false">
              <ImageViewer
                className="navbar-avatar"
                src={me.avatar}
                alt={me.name}
              />
              <i className={me.icon} /> <strong>{me.first}</strong>
            </span>
            <div
              className="dropdown-menu  dropdown-menu-right"
              aria-labelledby="userMenu">
              <Link className="dropdown-item" to="/dashboard">
                {t('Dashboard')}
              </Link>
              <Link className="dropdown-item" to="/profile">
                {t('Profile')}
              </Link>
              <Link className="dropdown-item" to="/settings">
                {t('Settings')}
              </Link>
              <div className="dropdown-divider" />
              <Link className="dropdown-item" to="/signout">
                {t('Log out')}
              </Link>
            </div>
          </li>,
        ]
      } else {
        return [
          <li className="nav-item" key="signin">
            <NavLink className="nav-link" to="/signin">
              {t('Sign In')}
            </NavLink>
          </li>,
          <li className="nav-item" key="signup">
            <NavLink className="nav-link" to="/signup">
              {t('Sign Up')}
            </NavLink>
          </li>,
        ]
      }
    }

    const handleLanguage = lang => {
      i18n.changeLanguage(lang)
    }

    return (
      <nav
        id="navbar"
        className={'navbar navbar-expand-lg fixed-top ' + props.className}
        style={{zIndex: 1046}}>
        <div className="container-fluid">
          {renderLogo()}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMain"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>

          <div
            className="collapse navbar-collapse container-fluid pe-0"
            id="navbarMain">
            <ul className="navbar-nav me-auto">{renderLinks()}</ul>

            <ul className="nav navbar-nav">{renderUserMenu()}</ul>

            <ul className="nav small p-0 translations">
              <li
                className={
                  'nav-item small border-right px-1 ' +
                  (language === 'en-US' && 'text-primary')
                }
                onClick={() => handleLanguage('en-US', 'en-US')}>
                EN-US
              </li>
              <li
                className={
                  'nav-item small px-1 ' +
                  (language === 'tr-TR' && 'text-primary')
                }
                onClick={() => handleLanguage('tr-TR', 'tr')}>
                TR
              </li>
            </ul>
          </div>
        </div>
        <SystemMessages />
      </nav>
    )
  })
)
