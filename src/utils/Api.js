class Api {
    constructor(baseUrl) {
        this.headers = {
            authorization: '0ed12c18-e80a-434a-9e00-41eb70564c88',
            'Content-Type': 'application/json'
        };
        this._baseUrl = baseUrl;
        // this._authBaseUrl = 'https://auth.nomoreparties.co'
        // this._authBaseUrl = 'http://127.0.0.1:3000'
        this._authBaseUrl = 'https://api.vasiliymuravev.nomoredomains.sbs'
    }

    getAppInfo() {
        return Promise.all([this.getUserData(), this.getInitialCards()]);
    }

    getInitialCards() {
        this.url = this._baseUrl + 'cards';
        return fetch(this.url, {
            headers: this.headers
        }).then(res => this._getResponseData(res))
    }

    getUserData() {
        this.url = this._baseUrl + 'users/me';
        return fetch(this.url, {
            headers: this.headers
        }).then(res => this._getResponseData(res))
    }

    setUserData(data) {
        this.url = this._baseUrl + 'users/me';
        return fetch(this.url, {
            method: 'PATCH',
            headers: this.headers,
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
        }).then(res => this._getResponseData(res));
    }

    changeLikeCardStatus(cardId, isLiked) {
        this.url = this._baseUrl + 'cards/' + cardId + '/likes';
        return fetch(this.url, {
            method: isLiked ? 'PUT' : 'DELETE',
            headers: this.headers,
        }).then(res => this._getResponseData(res));
    }

    setAvatar(link) {
        this.url = this._baseUrl + 'users/me/avatar';
        return fetch(this.url, {
            method: 'PATCH',
            headers: this.headers,
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

    checkAuthorize(token) {
        this.url = this._authBaseUrl + '/users/me';
        return fetch(this.url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }).then(res => res.json());
    }

    _getResponseData(res) {
        if (!res.ok) {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
        return res.json();
    }
}

export const api = new Api('https://mesto.nomoreparties.co/v1/cohort-42/');
