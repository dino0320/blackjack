import { executeApi } from './modules/communication';

const userAgent = window.navigator.userAgent;
const nameElement = document.querySelector('#name');
const startButtonElement = document.querySelector('#start-button');

if (localStorage.getItem('token') === null) {
    nameElement.classList.remove('invisible');
    startButtonElement.classList.add('invisible');
} else {
    executeApi(
        'sign-in',
        null,
        function (response) {
            localStorage.setItem('token', response.token);
        }
    );
}

document.querySelector('#ok-button').addEventListener('click', function () {
    executeApi(
        'sign-up',
        { user_name: nameElement.querySelector('#name-text').value, device_name: userAgent },
        function (response) {
            localStorage.setItem('token', response.token);
            nameElement.classList.add('invisible');
            startButtonElement.classList.remove('invisible');
        }
    );
});

startButtonElement.addEventListener('click', function () {
    location.href = 'http://localhost:8080/game';
});