import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';

const Register = ({onLogin}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const history = useHistory();

    const resetForm = () => {
        setEmail('');
        setPassword('');
    }

    const handleSubmit = (e) => {
        e.preventDefault();

    }

    return (
        <div className="auth">
            <h3 className="auth__title">Регистрация</h3>
            <form className="auth__form">
                <input id="email" required name="email" type="text" value={email} placeholder="Email"
                       className="auth__form-input" onChange={({target}) => setEmail(target.value)}/>
                <input id="password" required name="password" type="password" value={password} placeholder="Пароль"
                       className="auth__form-input" onChange={({target}) => setPassword(target.value)}/>
                <button type="submit" className="auth__form-submit-btn">Зарегистрироваться</button>
                <Link className="auth__form-link" to="/sign-in">Уже зарегистрированы? Войти</Link>
            </form>
        </div>
    )
}

export default Register;