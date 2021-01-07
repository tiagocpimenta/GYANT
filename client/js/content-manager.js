class ContentManager {
    constructor(authManager) {
        this.cases = [];
        this.conditions = [];
        this.fetchingCases = false;
        this.fetchingConditions = false;
        this.authManager = authManager;

        this.caseElem = document.getElementById('case');
        this.contentElem = document.getElementById('content');
        this.conditionsElem = document.getElementById('conditions');
        this.contentInfoElem = document.getElementById('contentInfo');
        this.nextCaseButton = document.getElementById('nextCase');

        this.getConditions = this.getConditions.bind(this);
        this.getUserUreviewedCases = this.getUserUreviewedCases.bind(this);
        this.putReview = this.putReview.bind(this);
        this.render = this.render.bind(this);
        this.showInfo = this.showInfo.bind(this);
        this.hideInfo = this.hideInfo.bind(this);
        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleConditionChange = this.handleConditionChange.bind(this);

        this.nextCaseButton.addEventListener('click', this.handleNext);
        this.conditionsElem.addEventListener('change', this.handleConditionChange);

        this.authManager.addListener(this.handleLoginChange);
        this.handleLoginChange(this.authManager.isLoggedIn);
    }

    getConditions() {
        this.fetchingConditions = true;

        axios.get('/conditions')
            .then(({ data }) => {
                this.conditions = data;

                this.conditionsElem.innerHTML = '';
                this.conditionsElem.insertAdjacentHTML('beforeend', '<option value="" disabled selected>Select Condition</option>');

                this.conditions.forEach((condition) => {
                    const value = condition._id;
                    const text = `${condition.code} ${condition.description}`;

                    this.conditionsElem.insertAdjacentHTML('beforeend', `<option value="${value}">${text}</option>`);
                });
            })
            .finally(() => {
                this.fetchingConditions = false;
                this.render();
            });
    }

    getUserUreviewedCases() {
        const { id } = this.authManager.getLogin();

        this.fetchingCases = true;

        axios.get(`/cases/unreviewed/${id}`)
            .then(({ data }) => {
                this.cases = data;
            })
            .finally(() => {
                this.fetchingCases = false;
                this.render();
            });
    }

    putReview(data) {
        axios.put('/cases/review', data)
            .then(() => {
                this.cases.shift();

                this.conditionsElem.selectedIndex = 0;
                this.handleConditionChange();

                this.render();
            })
            .catch((err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Something went wrong...',
                    text: err.message,
                });
            });
    }

    render() {
        if (!this.authManager.isLoggedIn) {
            this.showInfo('Please Login to review cases.');
        } else if (this.cases.length === 0) {
            this.showInfo('You are done.');
        } else if (this.fetchingCases || this.fetchingConditions) {
            this.showInfo('Fetching data...');
        } else {
            this.hideInfo();

            let text = this.cases[0].description;

            text = text.split('    ').join('\n\n');
            text = text.split('   ').join('\n ');
            text = text.split('  ').join(' ');

            this.caseElem.innerHTML = text;
        }
    }

    showInfo(text) {
        this.contentElem.classList.add('hidden');
        this.contentInfoElem.classList.remove('hidden');
        this.contentInfoElem.innerText = text;
    }

    hideInfo() {
        this.contentElem.classList.remove('hidden');
        this.contentInfoElem.classList.add('hidden');
        this.contentInfoElem.innerText = '';
    }

    handleLoginChange(isLoggedIn) {
        if (isLoggedIn) {
            this.getConditions();
            this.getUserUreviewedCases();
        }

        this.render();
    }

    handleNext() {
        const data = {
            id: this.cases[0].id,
            review: {
                userId: this.authManager.getLogin().id,
                conditionId: this.conditionsElem.value,
            },
        };

        this.putReview(data);
    }

    handleConditionChange() {
        const value = this.conditionsElem.value;

        if (value) {
            this.nextCaseButton.removeAttribute('disabled');
        } else {
            this.nextCaseButton.setAttribute('disabled', 'true');
        }
    }
}
