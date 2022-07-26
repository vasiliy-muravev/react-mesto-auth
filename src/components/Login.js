import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';

const Login = ({onLogin}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const resetForm = () => {
        setEmail('');
        setPassword('');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin({email, password})
            .then(
                () => {
                    history.push('/');
                })
            .then(() => resetForm())
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className="auth">
            <h3 className="auth__title">Вход</h3>
            <form className="auth__form" onSubmit={handleSubmit}>
                <input id="email" required name="email" type="text" value={email} placeholder="Email"
                       className="auth__form-input" onChange={({target}) => setEmail(target.value)}/>
                <input id="password" required name="password" type="password" value={password} placeholder="Пароль"
                       className="auth__form-input" onChange={({target}) => setPassword(target.value)}/>
                <button type="submit" className="auth__form-submit-btn">Войти</button>
            </form>
        </div>
    )
}

export default Login;