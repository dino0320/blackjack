import { executeApi } from './modules/communication';
import { BlackjackController } from './modules/blackjack';

executeApi('start-blackjack');

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
    if(blackjackController.isFinished()) {
        executeApi(
            'finish-blackjack',
            { score: blackjackController.getChip() },
            function () {
                location.href = 'http://localhost:80/home';
            },
            function () {
                location.href = 'http://localhost:80/home';
            }
        );
        return;
    }

    blackjackController.next();
});