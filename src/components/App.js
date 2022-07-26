import '../index.css';
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import ImagePopup from "./ImagePopup.js";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import React, {useState} from "react";
import {api} from "../utils/Api";
import {CurrentUserContext} from '../contexts/CurrentUserContext.js';
import AddPlacePopup from "./AddPlacePopup";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";

function App() {
    /* Начальное состояние попапов - закрыты */
    const [isEditProfilePopupOpen, setEditProfilePopupState] = useState(false);
    const [isAddPlacePopupOpen, setAddPlacePopupState] = useState(false);
    const [isEditAvatarPopupOpen, setEditAvatarPopupState] = useState(false);
    const [isImagePopupOpen, setImagePopupState] = useState(false);
    const [selectedCard, setSelectedCardState] = useState({});
    const [isPlaceDeletePopupOpen, setPlaceDeletePopupOpen] = useState(false);
    const [cards, setCardState] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpenState] = useState(false);

    /* Контекст текущего пользователя */
    const [currentUser, setCurrentUser] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState('');
    const [isInfoTooltipSuccess, setInfoTooltipSuccessState] = useState(false);
    const history = useHistory();

    /* Проверяем авторизацию */
    React.useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            api.checkAuthorize(jwt).then((res) => {
                if (res) {
                    setEmail(res.data.email);
                    setLoggedIn(true);
                }
            });
        }
    }, []);
    React.useEffect(() => {
        if (loggedIn) {
            history.push('/');
        }
    }, [loggedIn, setEmail])

    /* Эффект получения данных о пользователе при монтировании */
    React.useEffect(() => {
        api.getUserData().then((userData) => {
            setCurrentUser(userData);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    /* Обработчики открытия попапов */
    const handleEditProfileClick = () => setEditProfilePopupState(true);
    const handleAddPlaceClick = () => setAddPlacePopupState(true);
    const handleEditAvatarClick = () => setEditAvatarPopupState(true);

    /* Обработчик закрытия попапов */
    const closeAllPopups = () => {
        setEditProfilePopupState(false);
        setAddPlacePopupState(false);
        setEditAvatarPopupState(false);
        setImagePopupState(false);
        setInfoTooltipPopupOpenState(false);
        setSelectedCardState({});
        setPlaceDeletePopupOpen(false);
    };

    /* Обработчик открытия картинки при клике на карточку */
    const handleCardClick = (card) => {
        setSelectedCardState(card);
        setImagePopupState(true);
    };

    /* Обработчик передачи карточки в попап удаления */
    const handlePlaceDeleteClick = (card) => {
        setSelectedCardState(card);
        setPlaceDeletePopupOpen(true);
    };

    /* Изменение данных пользователя */
    const handleUpdateUser = (formData) => {
        setIsLoading(true);
        api.setUserData(formData).then((userData) => {
            setCurrentUser(userData);
            closeAllPopups();
        }).finally(() => {
            setIsLoading(false);
        });
    };

    /* Изменение аватара */
    const handleUpdateAvatar = (avatar) => {
        setIsLoading(true);
        api.setAvatar(avatar)
            .then((userData) => {
                setCurrentUser(userData);
                closeAllPopups();
            }).finally(() => {
            setIsLoading(false);
        });
    };

    /* Передаем массив с карточками в card */
    React.useEffect(() => {
        api.getInitialCards().then((cardsData) => {
            setCardState(cardsData);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    /* Обработчик проставления и снятия лайков */
    function handleCardLike(card) {
        /* Снова проверяем, есть ли уже лайк на этой карточке */
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        /* Отправляем запрос в API и получаем обновлённые данные карточки */
        api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
            setCardState((state) => state.map((c) => c._id === card._id ? newCard : c));
        });
    }

    /* Обработчик подтверждения удаления карточки */
    const handlePlaceDeleteSubmit = (card) => {
        setIsLoading(true);
        api.deleteCard(card._id).then(() => {
            setCardState(currentCards => currentCards.filter((c) => c._id !== card._id));
            closeAllPopups();
        }).finally(() => {
            setIsLoading(false);
        });
    };

    /* Обработчик добавления карточки */
    const handleAddPlaceSubmit = (formData) => {
        setIsLoading(true);
        api.addCard(formData).then((newCard) => {
            setCardState([newCard, ...cards]);
            closeAllPopups();
        }).finally(() => {
            setIsLoading(false);
        });
    }

    /* Обработчик регистрации */
    const onRegister = ({email, password}) => {
        return api.register(email, password)
            .then((res) => {
                setInfoTooltipSuccessState(false);
                setInfoTooltipPopupOpenState(true);
                if (typeof res.data._id !== undefined) {
                    setInfoTooltipSuccessState(true);
                    setInfoTooltipPopupOpenState(true);
                }
            });
    }

    /* Обработчик авторизации */
    const onLogin = ({email, password}) => {
        return api.authorize(email, password)
            .then((res) => {
                if (res.token) {
                    localStorage.setItem('jwt', res.token);
                    setEmail(email);
                    setLoggedIn(true);
                }
            });
    }

    /* Обработчик удаления авторизации */
    const onSignOut = () => {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            localStorage.removeItem('jwt');
            setLoggedIn(false);
            setEmail('');
        }
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page">
                <Header loggedIn={loggedIn}
                        onSignOut={onSignOut}
                        email={email}/>
                <Switch>
                    <ProtectedRoute
                        exact path="/"
                        loggedIn={loggedIn}
                        component={Main}
                        onEditProfile={handleEditProfileClick}
                        onAddPlace={handleAddPlaceClick}
                        onEditAvatar={handleEditAvatarClick}
                        onCardClick={handleCardClick}
                        onDeleteClick={handlePlaceDeleteClick}
                        onClose={closeAllPopups}
                        card={selectedCard}
                        isOpen={isPlaceDeletePopupOpen}
                        cards={cards}
                        onCardLike={handleCardLike}
                        onCardDeleteSubmit={handlePlaceDeleteSubmit}
                        isLoading={isLoading}/>
                    <Route path="/sign-in">
                        <Login onLogin={onLogin}/>
                    </Route>
                    <Route path="/sign-up">
                        <Register onRegister={onRegister}/>
                    </Route>
                    <Route path="/*">
                        <Redirect to="/sign-in"/>
                    </Route>
                </Switch>
                <EditProfilePopup isOpen={isEditProfilePopupOpen}
                                  onClose={closeAllPopups}
                                  onUpdateUser={handleUpdateUser}
                                  isLoading={isLoading}/>
                <AddPlacePopup isOpen={isAddPlacePopupOpen}
                               onClose={closeAllPopups}
                               onAddPlace={handleAddPlaceSubmit}
                               isLoading={isLoading}/>
                <EditAvatarPopup isOpen={isEditAvatarPopupOpen}
                                 onClose={closeAllPopups}
                                 onUpdateAvatar={handleUpdateAvatar}
                                 isLoading={isLoading}/>
                <ImagePopup isOpen={isImagePopupOpen}
                            onClose={closeAllPopups}
                            card={selectedCard}/>
                <InfoTooltip isOpen={isInfoTooltipPopupOpen}
                             onClose={closeAllPopups}
                             isSuccess={isInfoTooltipSuccess}/>
                <Footer/>
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;