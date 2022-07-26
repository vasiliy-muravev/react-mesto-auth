import {Link} from 'react-router-dom';
import {useLocation} from "react-router-dom";
import React from 'react';

function Header({loggedIn, onSignOut, email}) {
    const pathname = useLocation().pathname;
    let title = pathname === '/sign-up' ? 'Войти' : 'Регистрация';
    const link = pathname === '/sign-up' ? '/sign-in' : '/sign-up';

    if (loggedIn) {
        title = 'Выйти';
    }

    const handleClick = (e) => {
        if (loggedIn) {
            e.preventDefault();
            onSignOut()
        }
    }

    return (
        <>
            <header className="header">
                <div className="header__logo"></div>
                <div className="header__links">
                    <Link to="/" className="header__link">{email}</Link>
                    <Link to={link} onClick={handleClick} className="header__link">{title}</Link>
                </div>
            </header>
        </>
    )
}

export default Header;