import {getCookie} from "./cookie";

class Api {
    constructor(baseUrl, token) {
        this.headers = {
            'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
        }
        this._baseUrl = baseUrl;
        this._authBaseUrl = 'https://api.vasiliymuravev.nomoredomains.sbs'
    }

    getAppInfo() {
        return Promise.all([this.getUserData(), this.getInitialCards()]);
    }

    getInitialCards() {
        this.url = this._baseUrl + 'cards';
        return fetch(this.url, {
            headers: this.headers,
            credentials: 'include',
        }).then(res => this._getResponseData(res))
    }

    getUserData() {
        this.url = this._baseUrl + 'users/me';
        return fetch(this.url, {
            headers: this.headers,
            credentials: 'include',
        }).then(res => this._getResponseData(res))
    }

    setUserData(data) {
        this.url = this._baseUrl + 'users/me';
        return fetch(this.url, {
            method: 'PATCH',
            headers: this.headers,
            credentials: 'include',
            body: JSON.stringify({
                name: data.name,
                about: data.about
            })
        }).then(res => this._getResponseData(res));
    }

    addCard(data) {
        this.url = this._baseUrl + 'cards';
        return fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            credentials: 'include',
            body: JSON.stringify({
                name: data.name,
                link: data.link
            })
        }).then(res => this._getResponseData(res));
    }

    deleteCard(cardId) {
        this.url = this._baseUrl + 'cards/' + cardId;
        return fetch(this.url, {
            method: 'DELETE',
            headers: this.headers,
            credentials: 'include',
        }).then(res => this._getResponseData(res));
    }

    changeLikeCardStatus(cardId, isLiked) {
        this.url = this._baseUrl + 'cards/' + cardId + '/likes';
        return fetch(this.url, {
            method: isLiked ? 'PUT' : 'DELETE',
            headers: this.headers,
            credentials: 'include',
        }).then(res => this._getResponseData(res));
    }

    setAvatar(link) {
        this.url = this._baseUrl + 'users/me/avatar';
        return fetch(this.url, {
            method: 'PATCH',
            headers: this.headers,
            credentials: 'include',
            body: JSON.stringify({
                avatar: link,
            })
        }).then(res => this._getResponseData(res));
    }

    register(email, password) {
        this.url = this._authBaseUrl + '/signup';
        return fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({email, password})
        }).then(res => res.json());
    }

    authorize(email, password) {
        this.url = this._authBaseUrl + '/signin';
        return fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            credentials: 'include',
            body: JSON.stringify({email, password})
        }).then(res => res.json());
    }

    checkAuthorize() {
        this.url = this._authBaseUrl + '/users/me';
        return fetch(this.url, {
            method: 'GET',
            credentials: 'include',
            headers: this.headers,
        }).then(res => res.json());
    }

    _getResponseData(res) {
        if (!res.ok) {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
        return res.json();
    }
}

export const api = new Api(
    'https://api.vasiliymuravev.nomoredomains.sbs/',
    getCookie('jwt')
    );
