import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import { Dropdown, Space } from 'antd';

const items = [
    {
        key: '1',
        label: (
            <Link to='refAc' className='header__link'>
                RefAc
            </Link>
        ),
    },
    {
        key: '2',
        label: (
            <Link to='refVat' className='header__link'>
                RefVat
            </Link>
        ),
    },
    {
        key: '3',
        label: (
            <Link to='refVatArm' className='header__link'>
                RefVatArm
            </Link>
        ),
    }
];

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
                            <Link to="/" className='header__link'>
                                Audits
                            </Link>
                        </li>
                        <li className='header__item'>
                            <Dropdown
                                menu={{
                                    items,
                                }}
                            >
                                <a className='header__link' onClick={(e) => e.preventDefault()}>
                                    <Space style={{fontSize: 18, cursor: 'pointer'}}>
                                        References
                                    </Space>
                                </a>
                            </Dropdown>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
