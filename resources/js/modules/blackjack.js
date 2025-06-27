/**
 * Blackjack controller
 */
export class BlackjackController {
    /**
     * Max number of matches
     */
    get #MAX_MATCH_COUNT() { return 3; }

    /**
     * BetView instance
     */
    #betView;
    /**
     * BetLogic instance
     */
    #betLogic;
    /**
     * BlackjackView instance
     */
    #blackjackView;
    /**
     * BlackjackLogic instance
     */
    #blackjackLogic;
    /**
     * Number of matches
     */
    #matchCount;

    /**
     * Constructor
     */
    constructor() {
        this.#matchCount = 0;

        this.#betLogic = new BetLogic();
        this.#betView = new BetView();

        this.#blackjackLogic = new BlackjackLogic();
        this.#blackjackView = new BlackjackView();

        this.#betView.updateChipMessage(this.#betLogic.chip);
    }

    /**
     * Bet.
     */
    bet() {
        if (this.#blackjackLogic.isGame) {
            throw new Error('You can\'t bet while playing.');
        }

        this.#betLogic.bet(this.#betView.getBetChip());

        this.initializeGame();

        this.#betView.hideBet();
        this.#betView.updateChipMessage(this.#betLogic.chip);
    }

    /**
     * Initialize the game.
     */
    initializeGame() {
        this.#matchCount++;

        this.#checkIfMatchCountExceedsMax();

        this.#blackjackLogic.initializeGame()
        this.#blackjackView.initializeHand(this.#blackjackLogic.playerHand, this.#blackjackLogic.dealerHand);

        if (this.#blackjackLogic.isGame) {
            this.#blackjackView.updateHandValueMessage(this.#blackjackLogic.playerHand.calcHand(false), this.#blackjackLogic.dealerHand.calcHand(false));
            return;
        }

        this.#finishGame();
    }

    /**
     * Check if the match count exceed the max.
     */
    #checkIfMatchCountExceedsMax() {
        if (this.#matchCount > this.#MAX_MATCH_COUNT) {
            throw new Error('The match count exceed the max.');
        }
    }

    /**
     * Finish the game.
     */
    #finishGame() {
        this.#blackjackView.finishView(this.#blackjackLogic.getWinOrLose());
        this.#blackjackView.updateHandValueMessage(this.#blackjackLogic.playerHand.calcHand(false), this.#blackjackLogic.dealerHand.calcHand(false));

        this.#betLogic.calcChip(this.#blackjackLogic.getWinOrLose());
        this.#betView.updateChipMessage(this.#betLogic.chip);

        if (this.#betLogic.chip <= 0) {
            // Game over
            this.#matchCount = this.#MAX_MATCH_COUNT;
        }
    }

    /**
     * Hit.
     */
    hit() {
        this.#checkIfMatchCountExceedsMax();

        const card = this.#blackjackLogic.hit();
        this.#blackjackView.addPlayerCard(card);

        if (this.#blackjackLogic.isGame) {
            this.#blackjackView.updateHandValueMessage(this.#blackjackLogic.playerHand.calcHand(false), this.#blackjackLogic.dealerHand.calcHand(false));
            return;
        }

        this.#finishGame();
    }

    /**
     * Stand.
     */
    stand() {
        this.#checkIfMatchCountExceedsMax();

        const cards = this.#blackjackLogic.stand();
        this.#blackjackView.addDealerCards(cards);

        if (this.#blackjackLogic.isGame) {
            this.#blackjackView.updateHandValueMessage(this.#blackjackLogic.playerHand.calcHand(false), this.#blackjackLogic.dealerHand.calcHand(false));
            return;
        }

        this.#finishGame();
    }

    /**
     * Whether the game finish or not.
     * @returns {boolean} Return true if the game finish, otherwise false
     */
    isFinished() {
        return this.#matchCount >= this.#MAX_MATCH_COUNT && !this.#blackjackLogic.isGame;
    }

    /**
     * Proceed to the next step.
     */
    next() {
        if (this.#blackjackLogic.isGame) {
            throw new Error('You can\'t go to the next step while playing.');
        }

        if (this.#matchCount >= this.#MAX_MATCH_COUNT) {
            return;
        }

        this.#blackjackView.cleanView();
        this.#betView.showBet();
    }

    /**
     * Get your chip.
     * @returns {number}
     */
    getChip() {
        return this.#betLogic.chip;
    }
}

/**
 * BetView
 */
class BetView {
    /**
     * Chip message suffix
     */
    get #CHIP_MESSAGE_SUFFIX() { return '枚'; }

    /**
     * Bet element
     */
    #betElement;
    /**
     * Chip message element
     */
    #chipMessageElement;

    /**
     * Constructor
     */
    constructor() {
        this.#betElement = document.querySelector('#bet');
        this.#chipMessageElement = document.querySelector('#chip-message');
    }

    /**
     * Get bet chip.
     * @returns {string} Number of bet chip
     */
    getBetChip() {
        return this.#betElement.querySelector('#bet-chip-text').value;
    }

    /**
     * Hide bet.
     */
    hideBet() {
        this.#betElement.classList.add('invisible');
    }

    /**
     * Show bet.
     */
    showBet() {
        this.#betElement.classList.remove('invisible');
    }

    /**
     * Update chip message.
     * @param {number} chip
     */
    updateChipMessage(chip) {
        this.#chipMessageElement.innerHTML = chip + this.#CHIP_MESSAGE_SUFFIX;
    }
}

/**
 * BetLogic
 */
class BetLogic {
    /**
     * Initial number of chip
     */
    get #INITIAL_NUMBER_OF_CHIP() { return 100; }

    /**
     * Number of chip
     */
    #chip;
    /**
     * Number of bet chip
     */
    #betChip;

    /**
     * Constructor
     */
    constructor() {
        this.#chip = this.#INITIAL_NUMBER_OF_CHIP;
        this.#betChip = 0;
    }

    /**
     * The getter of the number of chip.
     */
    get chip() {
        return this.#chip;
    }

    /**
     * The getter of the number of bet chip.
     */
    get betChip() {
        return this.#betChip;
    }

    /**
     * Bet.
     */
    bet(betChip) {
        this.#betChip = parseInt(betChip);
        if (isNaN(this.#betChip)) {
            throw new Error('Please enter a number.');
        }

        if (this.#betChip <= 0) {
            throw new Error('Please enter a positive integer.');
        }

        if (this.#betChip > this.#chip) {
            throw new Error('The Number of bet chip exceeds your own chip.');
        }

        this.#chip -= this.#betChip;
    }

    /**
     * Calculate the number of chip.
     * @param {number} winOrLose
     */
    calcChip(winOrLose) {
        if (this.#betChip <= 0) {
            throw new Error('Please bet.');
        }

        switch(winOrLose) {
            case BlackjackLogic.WIN:
                this.#chip += (this.#betChip * 2);
                break;

            case BlackjackLogic.DRAW:
                this.#chip += this.#betChip;
                break;

            case BlackjackLogic.LOSE:
                break;

            default:
                throw new Error('The value of win or lose is invalid.');
        }

        this.#betChip = 0;
    }
}

/**
 * BlackjackView
 */
class BlackjackView {
    /**
     * Prefix of sum of player hand message
     */
    get #PLAYER_HAND_SUM_MESSAGE_PREFIX() { return 'Player: '; }
    /**
     * Prefix of sum of dealer hand message
     */
    get #DEALER_HAND_SUM_MESSAGE_PREFIX() { return 'Dealer: '; }

    /**
     * Index of hidden card
     */
    #hiddenCardIndex;
    /**
     * List of hidden card image sources
     */
    #hiddenCardImageSrcList;

    /**
     * Card template element
     */
    #cardTemplateElement;
    /**
     * Player hand element
     */
    #playerHandElement;
    /**
     * Dealer hand element
     */
    #dealerHandElement;
    /**
     * Sum of player hand message element
     */
    #playerHandSumMessageElement;
    /**
     * Sum of dealer hand message element
     */
    #dealerHandSumMessageElement;
    /**
     * Win or lose message element
     */
    #winOrLoseMessageElement;
    /**
     * Hit Button element
     */
    #hitButtonElement;
    /**
     * Stand Button element
     */
    #standButtonElement;
    /**
     * Next Button element
     */
    #nextButtonElement;

    /**
     * Constructor
     */
    constructor() {
        this.#hiddenCardIndex = 0;
        this.#hiddenCardImageSrcList = new Array();

        this.#cardTemplateElement = document.querySelector('#card-template');
        this.#playerHandElement = document.querySelector('#player-hand');
        this.#dealerHandElement = document.querySelector('#dealer-hand');

        this.#playerHandSumMessageElement = document.querySelector('#player-number-of-cards-message');
        this.#dealerHandSumMessageElement = document.querySelector('#dealer-number-of-cards-message');
        this.#winOrLoseMessageElement = document.querySelector('#win-or-lose-message');

        this.#hitButtonElement = document.querySelector('#hit-button');
        this.#standButtonElement = document.querySelector('#stand-button');
        this.#nextButtonElement = document.querySelector('#next-button');
    }

    /**
     * Initialize hand.
     * @param {Hand} playerHand 
     * @param {Hand} dealerHand
     */
    initializeHand(playerHand, dealerHand) {
        this.addPlayerCards(playerHand.cards);
        this.addDealerCards(dealerHand.cards);

        this.#hitButtonElement.classList.remove('invisible');
        this.#standButtonElement.classList.remove('invisible');
    }

    /**
     * Add cards to player hand.
     * @param {Array<Card>} cards
     */
    addPlayerCards(cards) {
        for (let i = 0; i< cards.length; i++) {
            this.addPlayerCard(cards[i]);
        }
    }

    /**
     * Add a card to player hand.
     * @param {Card} card
     */
    addPlayerCard(card) {
        this.#addCard(card, this.#playerHandElement);
    }

    /**
     * Add cards to dealer hand.
     * @param {Array<Card>} cards
     */
    addDealerCards(cards) {
        for (let i = 0; i< cards.length; i++) {
            this.addDealerCard(cards[i]);
        }
    }

    /**
     * Add a card to dealer hand.
     * @param {Card} card
     */
    addDealerCard(card) {
        this.#addCard(card, this.#dealerHandElement);
    }

    /**
     * Add a card to hand
     * @param {Element} handElement
     * @param {Card} card
     */
    #addCard(card, handElement) {
        // Create a card element copying a card template.
        const cardElement = this.#cardTemplateElement.cloneNode(true);
        cardElement.removeAttribute('id');
        cardElement.classList.remove('invisible');
        cardElement.querySelector('.front img').src = card.imageSrc;

        handElement.appendChild(cardElement);

        if (card.isFront) {
            return;
        }

        // Hide a card if it's face down.
        this.#hideCard(cardElement, card.imageSrc);
    }

    /**
     * Hide a card.
     * @param {Element} cardElement
     * @param {string} cardImageSrc
     */
    #hideCard(cardElement, cardImageSrc) {
        cardElement.dataset.hiddenCardIndex = this.#hiddenCardIndex;

        this.#hiddenCardImageSrcList.push(cardImageSrc);

        // Stop a card rotating and remove its image source.
        const cardFrontElement = cardElement.querySelector('.front');
        cardElement.querySelector('.back').classList.remove('is-rotation');
        cardFrontElement.classList.remove('is-rotation');
        cardFrontElement.querySelector('img').src = '';

        this.#hiddenCardIndex++;
    }

    /**
     * Update the sum of hand message.
     * @param {number} playerHandSum
     * @param {number} dealerHandSum
     */
    updateHandValueMessage(playerHandSum, dealerHandSum) {
        this.#playerHandSumMessageElement.innerHTML = this.#PLAYER_HAND_SUM_MESSAGE_PREFIX + playerHandSum;
        this.#dealerHandSumMessageElement.innerHTML = this.#DEALER_HAND_SUM_MESSAGE_PREFIX + dealerHandSum;
    }

    /**
     * Finish the view.
     * @param {number} winOrLose
     */
    finishView(winOrLose) {
        this.#showCards();

        this.#hitButtonElement.classList.add('invisible');
        this.#standButtonElement.classList.add('invisible');
        this.#nextButtonElement.classList.remove('invisible');

        switch(winOrLose) {
            case BlackjackLogic.WIN:
                this.#winOrLoseMessageElement.innerHTML = 'You win.';
                break;

            case BlackjackLogic.DRAW:
                this.#winOrLoseMessageElement.innerHTML = 'Draw.';
                break;

            case BlackjackLogic.LOSE:
                this.#winOrLoseMessageElement.innerHTML = 'You lose.';
                break;

            default:
                throw new Error('The value of win or lose is invalid.');
        }
    }

    /**
     * Show hidden cards.
     */
    #showCards() {
        const hiddenCardImageSrcList = this.#hiddenCardImageSrcList
        document.querySelectorAll('.card').forEach(function (cardElement) {
            if ('hiddenCardIndex' in cardElement.dataset) {
                // Make a card rotate and set its image source.
                const cardFrontElement = cardElement.querySelector('.front');
                cardFrontElement.classList.add('is-rotation');
                cardElement.querySelector('.back').classList.add('is-rotation');
                cardFrontElement.querySelector('img').src = hiddenCardImageSrcList[cardElement.dataset.hiddenCardIndex];
            }
        });
    }

    /**
     * Clean the view.
     */
    cleanView() {
        // Empty player hand.
        const playerHandElement = this.#playerHandElement.cloneNode(false);
        this.#playerHandElement.parentNode.replaceChild(playerHandElement, this.#playerHandElement);
        this.#playerHandElement = playerHandElement;
        // Empty dealer hand.
        const dealerHandElement = this.#dealerHandElement.cloneNode(false);
        this.#dealerHandElement.parentNode.replaceChild(dealerHandElement, this.#dealerHandElement);
        this.#dealerHandElement = dealerHandElement;

        this.#playerHandSumMessageElement.innerHTML = '';
        this.#dealerHandSumMessageElement.innerHTML = '';
        this.#winOrLoseMessageElement.innerHTML = '';

        this.#hitButtonElement.classList.add('invisible');
        this.#standButtonElement.classList.add('invisible');
        this.#nextButtonElement.classList.add('invisible');
    }
}

/**
 * BlackjackLogic
 */
class BlackjackLogic {
    /**
     * Blackjack
     */
    static get BLACKJACK() { return 21; }
    /**
     * Win
     */
    static get WIN() { return 1; }
    /**
     * Draw
     */
    static get DRAW() { return 0; }
    /**
     * Lose
     */
    static get LOSE() { return -1; }

    /**
     * Initial number of hand
     */
    get #INITIAL_NUMBER_OF_HAND() { return 2; }

    /**
     * Max number of dealer hand
     */
    get #MAX_NUMBER_OF_DEALER_HAND() { return 17; }

    /**
     * Whether in game or not
     */
    #isGame;
    /**
     * Deck
     */
    #deck;
    /**
     * Player hand
     */
    #playerHand;
    /**
     * Dealer hand
     */
    #dealerHand;

    /**
     * Constructor
     */
    constructor() {
        this.#isGame = false;
        this.#deck = null;
        this.#playerHand = null;
        this.#dealerHand = null;
    }

    /**
     * The getter of whether in game or not.
     */
    get isGame() {
        return this.#isGame;
    }

    /**
     * The getter of player hand.
     */
    get playerHand() {
        return this.#playerHand;
    }

    /**
     * The getter of dealer hand.
     */
    get dealerHand() {
        return this.#dealerHand;
    }

    /**
     * Initialize the game.
     */
    initializeGame() {
        this.#isGame = true;

        this.#deck = new Deck();
        this.#playerHand = new Hand();
        this.#dealerHand = new Hand();

        this.#initializeHand();

        if (this.#isBlackjack()) {
            // Finish the game if the initial hand is blackjack.
            this.#finishGame();
        }
    }

    /**
     * Initialize hand.
     */
    #initializeHand() {
        for (let i = 0; i < this.#INITIAL_NUMBER_OF_HAND; i++) {
            const isFront = ((i % this.#INITIAL_NUMBER_OF_HAND) === 0);
            this.#drawCard(this.#playerHand);
            this.#drawCard(this.#dealerHand, isFront);
        }
    }

    /**
     * Draw a card.
     * @param {Hand} hand
     * @param {boolean} isFront
     * @returns {Card}
     */
    #drawCard(hand, isFront = true) {
        const card = this.#deck.drawCard();
        card.isFront = isFront;
        hand.addCard(card);

        return card
    }

    /**
     * Whether player hand is blackjack.
     * @returns {boolean} Return true if player hand is blackjack, otherwise false
     */
    #isBlackjack() {
        return this.#playerHand.calcHand() === BlackjackLogic.BLACKJACK;
    }

    /**
     * Finish the game.
     */
    #finishGame() {
        this.#isGame = false;

        this.#dealerHand.cards.forEach(function (card) {
            card.isFront = true;
        });
    }

    /**
     * Get player's win or lose.
     * @returns {number} Return 1 if player wins, 0 if it draw, -1 if player loses
     */
    getWinOrLose() {
        if (this.#isGame) {
            throw new Error('Still in game.');
        }

        const playerSum = this.#playerHand.calcHand();
        const dealerSum = this.#dealerHand.calcHand();

        if (playerSum > BlackjackLogic.BLACKJACK) {
            return BlackjackLogic.LOSE;
        }

        if (dealerSum > BlackjackLogic.BLACKJACK) {
            return BlackjackLogic.WIN;
        }

        if (playerSum > dealerSum) {
            return BlackjackLogic.WIN;
        }

        if (playerSum === dealerSum) {
            return BlackjackLogic.DRAW;
        }

        return BlackjackLogic.LOSE;
    }

    /**
     * Hit.
     * @returns {Card} A card player draws
     */
    hit() {
        if (!this.#isGame) {
            throw new Error('The game already finished.');
        }

        const card = this.#drawCard(this.#playerHand);

        if (this.#playerHand.calcHand() > BlackjackLogic.BLACKJACK) {
            // Finish the game if player hand is burst.
            this.#finishGame();
        }

        return card;
    }

    /**
     * Stand.
     * @returns {Array<Card>} List of cards dealer drew
     */
    stand() {
        if (!this.#isGame) {
            throw new Error('The game already finished.');
        }

        // Dealer draws cards until the sum of dealer hand is more than 17.
        const cards = new Array();
        while (this.#dealerHand.calcHand() < this.#MAX_NUMBER_OF_DEALER_HAND) {
            cards.push(this.#drawCard(this.#dealerHand));
        }

        this.#finishGame();

        return cards;
    }
}

/**
 * Hand
 */
class Hand {
    /**
     * Ace figure
     */
    get #ACE_FIGURE() { return 1; }
    /**
     * Ace special figure
     */
    get #ACE_SPECIAL_FIGURE() { return 11; }
    /**
     * List of picture card figures
     */
    get #PICTURE_CARD_FIGURES() { return [11, 12, 13]; }
    /**
     * Picture card special figure
     */
    get #PICTURE_CARD_SPECIAL_FIGURE() { return 10; };

    /**
     * Cards
     */
    #cards;

    /**
     * Constructor
     */
    constructor() {
        this.#cards = new Array();
    }

    /**
     * The getter of cards.
     */
    get cards() {
        return this.#cards;
    }

    /**
     * Add a card.
     * @param {Card} card
     */
    addCard(card) {
        if (this.calcHand() > BlackjackLogic.BLACKJACK) {
            throw new Error('You can\'t draw any more cards.');
        }

        this.#cards.push(card);
    }

    /**
     * Calculate the sum of hand.
     * @param {boolean} isBackContained Whether to contain back side in calculation
     * @returns {number} Sum of hand
     */
    calcHand(isBackContained = true) {
        let aceCount = 0;
        let sum = 0;
        this.#cards.forEach(card => {
            if (!(isBackContained || card.isFront)) {
                // If it contains the back side in the calculation and it's the back side, finish processing.
                return;
            }

            if (card.figure === this.#ACE_FIGURE) {
                aceCount++;
                return;
            }

            // J, Q and K are worth 10 points.
            let figure = card.figure;
            if (this.#PICTURE_CARD_FIGURES.includes(figure)) {
                figure = this.#PICTURE_CARD_SPECIAL_FIGURE;
            }

            sum += figure;
        });

        return sum + this.#calcAce(aceCount, sum);
    }

    /**
     * Calculate ace in hand.
     * @param {number} aceCount Number of ace
     * @param {number} sum Sum of hand except ace
     * @returns {number}
     */
    #calcAce(aceCount, sum) {
        if (aceCount === 0) {
            return 0;
        }

        let aceSum = 0;
        for (let i = 0; i <= aceCount; i++) {
            aceSum = (aceCount - i) * this.#ACE_SPECIAL_FIGURE + (i * this.#ACE_FIGURE);
            if ((sum + aceSum) <= BlackjackLogic.BLACKJACK) {
                break;
            }
        }

        return aceSum;
    }
}

/**
 * Deck
 */
class Deck {
    /**
     * Number of marks
     */
    get #NUMBER_OF_MARKS() { return 4; }
    /**
     * Number of figures
     */
    get #NUMBER_OF_FIGURES() { return 13; }

    /**
     * Cards
     */
    #cards;

    /**
     * Constructor
     */
    constructor() {
        this.#cards = new Array();
        for (let suit = 0; suit < this.#NUMBER_OF_MARKS; suit++) {
            for (let figure = 1; figure <= this.#NUMBER_OF_FIGURES; figure++) {
                this.#cards.push(new Card(suit, figure, `images/${suit}_${figure}.png`));
            }
        }
    }

    /**
     * Draw a card
     * @returns {Card}
     */
    drawCard() {
        const drawnIndex = Math.floor(Math.random() * this.#cards.length);
        const card = this.#cards.splice(drawnIndex, 1)[0] ?? null;
        if (card === null) {
            throw new Error('You can\'t draw any more cards from the deck.');
        }
        
        return card;
    }
}

/**
 * Card
 */
class Card {
    /**
     * Suit
     */
    #suit;
    /**
     * Figure
     */
    #figure;
    /**
     * Image source
     */
    #imageSrc;
    /**
     * Whether a card is front side
     */
    #isFront;

    /**
     * Constructor
     * @param {number} suit
     * @param {number} figure
     * @param {string} imageSrc
     */
    constructor(suit, figure, imageSrc) {
        this.#suit = suit;
        this.#figure = figure;
        this.#imageSrc = imageSrc;
        this.#isFront = true;
    }

    /**
     * The getter of suit.
     */
    get suit() {
        return this.#suit;
    }

    /**
     * The getter of figure.
     */
    get figure() {
        return this.#figure;
    }

    /**
     * The getter of image source.
     */
    get imageSrc() {
        return this.#imageSrc;
    }

    /**
     * The setter of whether a card is the front side.
     */
    set isFront(isFront) {
        this.#isFront = isFront;
    }

    /**
     * The getter of whether a card is the front side.
     */
    get isFront() {
        return this.#isFront;
    }
}