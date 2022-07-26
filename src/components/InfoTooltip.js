import React from 'react';
import successImage from '../images/success.png'
import failImage from '../images/fail.png'

const InfoTooltip = ({isOpen, onClose, isSuccess}) => {
    const image = isSuccess ? successImage : failImage;
    const message = isSuccess ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.';

    return (
        <div className={`popup popup__info-tooltip ${isOpen ? 'popup_opened' : ''}`}>
            <div className="popup__info-tooltip-container">
                <button type="button" className="popup__close-button"
                        onClick={onClose}/>
                <div className="popup__info-tooltip-content">
                    <img className="popup__info-tooltip-picture"
                         alt={message}
                         src={image}/>
                    <p className="popup__info-tooltip-title">{message}</p>
                </div>
            </div>
        </div>
    )
}

export default InfoTooltip;