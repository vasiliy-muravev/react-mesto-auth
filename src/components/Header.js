import {Link} from 'react-router-dom';
import {useLocation} from "react-router-dom";

function Header() {
    const pathname = useLocation().pathname;
    const link = pathname === '/sign-up' ? '/sign-in' : '/sign-up';
    const title = pathname === '/sign-up' ? 'Войти' : 'Регистрация';

    return (
        <>
            <header className="header">
                <div className="header__logo"></div>
                <Link to={link} className="header__link">{title}</Link>
            </header>
        </>
    )
}

export default Header;