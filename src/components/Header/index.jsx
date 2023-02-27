import React from 'react';
import './style.css';

function Header() {
  return (
    <header className='header'>
        <div className='header__wrapper'>
            <a href="#" className='header__logo'>
                Hendreson BI Studio
            </a>
            <nav className='header__nav'>
                <ul className='header__list'>
                    <li className='header__item'>
                        <a href="#" className='header__link'>
                            Audits
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
  );
}

export default Header;
