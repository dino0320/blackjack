import { BlackjackController } from './modules/blackjack';

const blackjackController = new BlackjackController();

document.querySelector('#bet-button').addEventListener('click', function() {
    blackjackController.bet();
});

document.querySelector('#hit-button').addEventListener('click', function() {
    blackjackController.hit();
});

document.querySelector('#stand-button').addEventListener('click', function() {
    blackjackController.stand();
});

document.querySelector('#next-button').addEventListener('click', function() {
    blackjackController.next();
});