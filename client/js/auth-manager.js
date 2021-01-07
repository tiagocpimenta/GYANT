class AuthManager {
    constructor() {
        this.isLoggedIn = false;
        this.listeners = new Set();

        this.formElem = document.getElementById('login');
        this.infoElem = document.getElementById('loginInfo');
        this.logoutElem = document.getElementById('logout');

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.addListener = this.addListener.bind(this);
        this.removeListener = this.removeListener.bind(this);
        this.dispatchEvent = this.dispatchEvent.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.setLoggedStatus = this.setLoggedStatus.bind(this);

        this.formElem.addEventListener('submit', this.handleFormSubmit);
        this.logoutElem.addEventListener('click', this.logout);

        this.addListener(this.handleLoginChange);
        this.setLoggedStatus('login' in localStorage);
    }

    getLogin() {
        return JSON.parse(localStorage.getItem('login'));
    }

    setLoggedStatus(isLoggedIn) {
        this.isLoggedIn = isLoggedIn;
        this.dispatchEvent(this.isLoggedIn);
    }

    login(email, password) {
        axios.post('/users/login', { email, password })
            .then((response) => {
                localStorage.setItem('login', JSON.stringify(response.data));
                this.setLoggedStatus(true);
            })
            .catch((err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Login',
                    text: err.response.data.payload.message,
                });
            });
    }

    logout() {
        localStorage.removeItem('login');
        this.setLoggedStatus(false);
    }

    addListener(listener) {
        this.listeners.add(listener);

        return () => this.removeListener(listener);
    }

    removeListener(listener) {
        return this.listeners.delete(listener);
    }

    dispatchEvent(...args) {
        this.listeners.forEach((listener) => listener(...args));
    }

    handleLoginChange(isLoggedIn) {
        if (isLoggedIn) {
            const user = this.getLogin();

            this.formElem.classList.add('hidden');
            this.infoElem.classList.remove('hidden');
            this.infoElem.innerText = `Logged in as: ${user.name}`;
            this.logoutElem.classList.remove('hidden');
        } else {
            this.formElem.classList.remove('hidden');
            this.infoElem.classList.add('hidden');
            this.logoutElem.classList.add('hidden');
        }
    }

    handleFormSubmit(event) {
        event.preventDefault();

        const email = event.target.children[0].value;
        const password = event.target.children[1].value;

        this.login(email, password);
    }
}
