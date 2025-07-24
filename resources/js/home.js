import { executeApi } from './modules/communication';

const userAgent = window.navigator.userAgent;
const nameElement = document.querySelector('#name');
const gameHomeElement = document.querySelector('#game-home');
const staminaElement = document.querySelector('#stamina');
const startButtonElement = document.querySelector('#start-button');
const rankingButtonElement = document.querySelector('#ranking-button');

if (localStorage.getItem('token') === null) {
    nameElement.classList.remove('invisible');
    gameHomeElement.classList.add('invisible');
} else {
    executeApi(
        'sign-in',
        null,
        function (response) {
            localStorage.setItem('token', response.token);
            staminaElement.innerHTML = response.stamina;
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
            executeApi(
                'create-game-data',
                null,
                function (response) {
                    staminaElement.innerHTML = response.stamina;
                    gameHomeElement.classList.remove('invisible');
                }
            );
        }
    );
});

startButtonElement.addEventListener('click', function () {
    location.href = 'http://localhost:80/game';
});

rankingButtonElement.addEventListener('click', function () {
    location.href = 'http://localhost:80/ranking';
});