/**
 * ブラックジャックコントローラークラス
 */
export class BlackjackController {
    /**
     * 最大試合回数
     */
    get #MAX_MATCH_COUNT() { return 3; }

    /**
     * BETビューインスタンス
     */
    #betView;
    /**
     * BETロジックインスタンス
     */
    #betLogic;
    /**
     * ブラックジャックビューインスタンス
     */
    #blackjackView;
    /**
     * ブラックジャックロジックインスタンス
     */
    #blackjackLogic;
    /**
     * 試合回数
     */
    #matchCount;

    /**
     * コンストラクター
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
     * BETする
     */
    bet() {
        if (this.#blackjackLogic.isGame) {
            throw new Error('ゲーム中のためBETできません');
        }

        this.#betLogic.bet(this.#betView.getBetChip());

        this.initializeGame();

        this.#betView.hideBet();
        this.#betView.updateChipMessage(this.#betLogic.chip);
    }

    /**
     * ゲームを初期化する
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
     * 試合回数が最大を超えているかどうかチェックする
     */
    #checkIfMatchCountExceedsMax() {
        if (this.#matchCount > this.#MAX_MATCH_COUNT) {
            throw new Error('試合回数が最大を超えています');
        }
    }

    /**
     * ゲームの終了処理をする
     */
    #finishGame() {
        this.#blackjackView.finishView(this.#blackjackLogic.getWinOrLose());
        this.#blackjackView.updateHandValueMessage(this.#blackjackLogic.playerHand.calcHand(false), this.#blackjackLogic.dealerHand.calcHand(false));

        this.#betLogic.calcChip(this.#blackjackLogic.getWinOrLose());
        this.#betView.updateChipMessage(this.#betLogic.chip);

        if (this.#betLogic.chip <= 0) {
            // ゲームオーバー
            this.#matchCount = this.#MAX_MATCH_COUNT;
        }
    }

    /**
     * HITする
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
     * STANDする
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
     * ゲームが終了しているかどうか
     * @returns {boolean} ゲームが終了していればtrue、そうでなければfalse
     */
    isFinished() {
        return this.#matchCount >= this.#MAX_MATCH_COUNT && !this.#blackjackLogic.isGame;
    }

    /**
     * 次への処理をする
     */
    next() {
        if (this.#blackjackLogic.isGame) {
            throw new Error('ゲーム中のため次にいけません');
        }

        if (this.#matchCount >= this.#MAX_MATCH_COUNT) {
            console.log('ゲーム終了です');
            return;
        }

        this.#blackjackView.cleanView();
        this.#betView.showBet();
    }
}

/**
 * BETビュークラス
 */
class BetView {
    /**
     * チップの枚数のサフィックス
     */
    get #CHIP_MESSAGE_SUFFIX() { return '枚'; }

    /**
     * BETの要素
     */
    #betElement;
    /**
     * チップの枚数のメッセージの要素
     */
    #chipMessageElement;

    /**
     * コンストラクタ―
     */
    constructor() {
        this.#betElement = document.querySelector('#bet');
        this.#chipMessageElement = document.querySelector('#chip-message');
    }

    /**
     * 賭けたチップの枚数を返す
     * @returns {string} 賭けたチップの枚数
     */
    getBetChip() {
        return this.#betElement.querySelector('#bet-chip-text').value;
    }

    /**
     * BETの要素を隠す
     */
    hideBet() {
        this.#betElement.classList.add('invisible');
    }

    /**
     * BETの要素を見せる
     */
    showBet() {
        this.#betElement.classList.remove('invisible');
    }

    /**
     * チップの枚数のメッセージを更新する
     * @param {number} chip チップの枚数
     */
    updateChipMessage(chip) {
        this.#chipMessageElement.innerHTML = chip + this.#CHIP_MESSAGE_SUFFIX;
    }
}

/**
 * BETロジッククラス
 */
class BetLogic {
    /**
     * 初期チップの枚数
     */
    get #INITIAL_NUMBER_OF_CHIP() { return 100; }

    /**
     * チップの枚数
     */
    #chip;
    /**
     * 賭けたチップの枚数
     */
    #betChip;

    /**
     * コンストラクタ―
     */
    constructor() {
        this.#chip = this.#INITIAL_NUMBER_OF_CHIP;
        this.#betChip = 0;
    }

    /**
     * チップの枚数のゲッター
     */
    get chip() {
        return this.#chip;
    }

    /**
     * 賭けたチップの枚数のゲッター
     */
    get betChip() {
        return this.#betChip;
    }

    /**
     * BETする
     */
    bet(betChip) {
        this.#betChip = parseInt(betChip);
        if (isNaN(this.#betChip)) {
            throw new Error('数値を入力してください');
        }

        if (this.#betChip <= 0) {
            throw new Error('正の整数を入力してください');
        }

        if (this.#betChip > this.#chip) {
            throw new Error('所持チップの枚数を超えています');
        }

        this.#chip -= this.#betChip;
    }

    /**
     * チップの枚数を計算する
     * @param {number} winOrLose 勝敗
     */
    calcChip(winOrLose) {
        if (this.#betChip <= 0) {
            throw new Error('BETしてください');
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
                throw new Error('勝敗が不正な値です');
        }

        this.#betChip = 0;
    }
}

/**
 * ブラックジャックビュークラス
 */
class BlackjackView {
    /**
     * プレイヤーの手札の合計のメッセージのプレフィックス
     */
    get #PLAYER_HAND_SUM_MESSAGE_PREFIX() { return 'プレイヤー: '; }
    /**
     * ディーラーの手札の合計のメッセージのプレフィックス
     */
    get #DEALER_HAND_SUM_MESSAGE_PREFIX() { return 'ディーラー: '; }

    /**
     * 隠されたカードのインデックス
     */
    #hiddenCardIndex;
    /**
     * 隠されたカードの画像のパスリスト
     */
    #hiddenCardImageSrcList;

    /**
     * カードのテンプレートの要素
     */
    #cardTemplateElement;
    /**
     * プレイヤーの手札の要素
     */
    #playerHandElement;
    /**
     * ディーラーの手札の要素
     */
    #dealerHandElement;
    /**
     * プレイヤーの手札の合計のメッセージの要素
     */
    #playerHandSumMessageElement;
    /**
     * ディーラーの手札の合計のメッセージの要素
     */
    #dealerHandSumMessageElement;
    /**
     * 勝敗メッセージの要素
     */
    #winOrLoseMessageElement;
    /**
     * HITボタンの要素
     */
    #hitButtonElement;
    /**
     * STANDボタンの要素
     */
    #standButtonElement;
    /**
     * 次へボタンの要素
     */
    #nextButtonElement;

    /**
     * コンストラクター
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
     * 手札を初期化する
     * @param {Hand} playerHand プレイヤーの手札 
     * @param {Hand} dealerHand ディーラーの手札
     */
    initializeHand(playerHand, dealerHand) {
        this.addPlayerCards(playerHand.cards);
        this.addDealerCards(dealerHand.cards);

        this.#hitButtonElement.classList.remove('invisible');
        this.#standButtonElement.classList.remove('invisible');
    }

    /**
     * プレイヤーの手札にカードリストを追加する
     * @param {Array<Card>} cards カードリスト
     */
    addPlayerCards(cards) {
        for (let i = 0; i< cards.length; i++) {
            this.addPlayerCard(cards[i]);
        }
    }

    /**
     * プレイヤーの手札にカードを追加する
     * @param {Card} card カード
     */
    addPlayerCard(card) {
        this.#addCard(card, this.#playerHandElement);
    }

    /**
     * ディーラーの手札にカードリストを追加する
     * @param {Array<Card>} cards カードリスト
     */
    addDealerCards(cards) {
        for (let i = 0; i< cards.length; i++) {
            this.addDealerCard(cards[i]);
        }
    }

    /**
     * ディーラーの手札にカードを追加する
     * @param {Card} card カード
     */
    addDealerCard(card) {
        this.#addCard(card, this.#dealerHandElement);
    }

    /**
     * 手札にカードを追加する
     * @param {Element} handElement 手札の要素
     * @param {Card} card カード
     */
    #addCard(card, handElement) {
        // カードのテンプレートの要素をコピーしてカードの要素を作成する
        const cardElement = this.#cardTemplateElement.cloneNode(true);
        cardElement.removeAttribute('id');
        cardElement.classList.remove('invisible');
        cardElement.querySelector('.front img').src = card.imageSrc;

        handElement.appendChild(cardElement);

        if (card.isFront) {
            return;
        }

        // 裏面だったらカードを隠す
        this.#hideCard(cardElement, card.imageSrc);
    }

    /**
     * カードを隠す
     * @param {Element} cardElement カードの要素
     * @param {string} cardImageSrc カードの画像のパス
     */
    #hideCard(cardElement, cardImageSrc) {
        cardElement.dataset.hiddenCardIndex = this.#hiddenCardIndex;

        this.#hiddenCardImageSrcList.push(cardImageSrc);

        // 回転しないようにし、カードの画像のパスを削除する
        const cardFrontElement = cardElement.querySelector('.front');
        cardElement.querySelector('.back').classList.remove('is-rotation');
        cardFrontElement.classList.remove('is-rotation');
        cardFrontElement.querySelector('img').src = '';

        this.#hiddenCardIndex++;
    }

    /**
     * 手札の合計のメッセージを更新する
     * @param {number} playerHandSum プレイヤーの手札の値
     * @param {number} dealerHandSum ディーラーの手札の値
     */
    updateHandValueMessage(playerHandSum, dealerHandSum) {
        this.#playerHandSumMessageElement.innerHTML = this.#PLAYER_HAND_SUM_MESSAGE_PREFIX + playerHandSum;
        this.#dealerHandSumMessageElement.innerHTML = this.#DEALER_HAND_SUM_MESSAGE_PREFIX + dealerHandSum;
    }

    /**
     * ビューの終了処理をする
     * @param {number} winOrLose 勝敗
     */
    finishView(winOrLose) {
        this.#showCards();

        this.#hitButtonElement.classList.add('invisible');
        this.#standButtonElement.classList.add('invisible');
        this.#nextButtonElement.classList.remove('invisible');

        switch(winOrLose) {
            case BlackjackLogic.WIN:
                this.#winOrLoseMessageElement.innerHTML = 'あなたの勝ちです';
                break;

            case BlackjackLogic.DRAW:
                this.#winOrLoseMessageElement.innerHTML = '引き分けです';
                break;

            case BlackjackLogic.LOSE:
                this.#winOrLoseMessageElement.innerHTML = 'あなたの負けです';
                break;

            default:
                throw new Error('勝敗が不正な値です');
        }
    }

    /**
     * 隠されたカードを見せる
     */
    #showCards() {
        const hiddenCardImageSrcList = this.#hiddenCardImageSrcList
        document.querySelectorAll('.card').forEach(function (cardElement) {
            if ('hiddenCardIndex' in cardElement.dataset) {
                // 回転するようにし、カードの画像のパスを設定する
                const cardFrontElement = cardElement.querySelector('.front');
                cardFrontElement.classList.add('is-rotation');
                cardElement.querySelector('.back').classList.add('is-rotation');
                cardFrontElement.querySelector('img').src = hiddenCardImageSrcList[cardElement.dataset.hiddenCardIndex];
            }
        });
    }

    /**
     * ビューをきれいにする
     */
    cleanView() {
        // プレイヤーの手札を空にする
        const playerHandElement = this.#playerHandElement.cloneNode(false);
        this.#playerHandElement.parentNode.replaceChild(playerHandElement, this.#playerHandElement);
        this.#playerHandElement = playerHandElement;
        // ディーラーの手札を空にする
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
 * ブラックジャックロジッククラス
 */
class BlackjackLogic {
    /**
     * ブラックジャック
     */
    static get BLACKJACK() { return 21; }
    /**
     * 勝ち
     */
    static get WIN() { return 1; }
    /**
     * 引き分け
     */
    static get DRAW() { return 0; }
    /**
     * 負け
     */
    static get LOSE() { return -1; }

    /**
     * 初期手札の枚数
     */
    get #INITIAL_NUMBER_OF_HAND() { return 2; }

    /**
     * ディーラーの手札の最大枚数
     */
    get #MAX_DEALER_NUMBER_OF_HAND() { return 17; }

    /**
     * ゲーム中かどうか
     */
    #isGame;
    /**
     * デッキ
     */
    #deck;
    /**
     * プレイヤーの手札
     */
    #playerHand;
    /**
     * ディーラーの手札
     */
    #dealerHand;

    /**
     * コンストラクター
     */
    constructor() {
        this.#isGame = false;
        this.#deck = null;
        this.#playerHand = null;
        this.#dealerHand = null;
    }

    /**
     * ゲーム中かどうかのゲッター
     */
    get isGame() {
        return this.#isGame;
    }

    /**
     * プレイヤーの手札のゲッター
     */
    get playerHand() {
        return this.#playerHand;
    }

    /**
     * ディーラーの手札のゲッター
     */
    get dealerHand() {
        return this.#dealerHand;
    }

    /**
     * ゲームを初期化する
     */
    initializeGame() {
        this.#isGame = true;

        this.#deck = new Deck();
        this.#playerHand = new Hand();
        this.#dealerHand = new Hand();

        this.#initializeHand();

        if (this.#isBlackjack()) {
            // 初期手札がブラックジャックなら終了
            this.#finishGame();
        }
    }

    /**
     * 手札を初期化する
     */
    #initializeHand() {
        for (let i = 0; i < this.#INITIAL_NUMBER_OF_HAND; i++) {
            const isFront = ((i % this.#INITIAL_NUMBER_OF_HAND) === 0);
            this.#drawCard(this.#playerHand);
            this.#drawCard(this.#dealerHand, isFront);
        }
    }

    /**
     * カードを引く
     * @param {Hand} hand 手札
     * @param {boolean} isFront 表面かどうか
     * @returns {Card} カード
     */
    #drawCard(hand, isFront = true) {
        const card = this.#deck.drawCard();
        card.isFront = isFront;
        hand.addCard(card);

        return card
    }

    /**
     * ブラックジャックかどうか
     * @returns {boolean} ブラックジャックならtrue、そうでなければfalse
     */
    #isBlackjack() {
        return this.#playerHand.calcHand() === BlackjackLogic.BLACKJACK;
    }

    /**
     * ゲームの終了処理を行う
     */
    #finishGame() {
        this.#isGame = false;

        this.#dealerHand.cards.forEach(function (card) {
            card.isFront = true;
        });
    }

    /**
     * プレイヤーの勝敗を取得する
     * @returns {number} プレイヤーの勝ちなら1、引き分けなら0、負けなら-1
     */
    getWinOrLose() {
        if (this.#isGame) {
            throw new Error('ゲーム中のため勝敗を取得できません');
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
     * HITする
     * @returns {Card} プレイヤーが引いたカード
     */
    hit() {
        if (!this.#isGame) {
            throw new Error('ゲームは終了しているためHITできません');
        }

        const card = this.#drawCard(this.#playerHand);

        if (this.#playerHand.calcHand() > BlackjackLogic.BLACKJACK) {
            // バーストしてたら終了
            this.#finishGame();
        }

        return card;
    }

    /**
     * STANDする
     * @returns {Array<Card>} ディーラーが引いたカードリスト
     */
    stand() {
        if (!this.#isGame) {
            throw new Error('ゲームは終了しているためSTANDできません');
        }

        // ディーラーは手札の合計が17以上になるまでカードを引く
        const cards = new Array();
        while (this.#dealerHand.calcHand() < this.#MAX_DEALER_NUMBER_OF_HAND) {
            cards.push(this.#drawCard(this.#dealerHand));
        }

        this.#finishGame();

        return cards;
    }
}

/**
 * 手札クラス
 */
class Hand {
    /**
     * Aの数字
     */
    get #ACE_FIGURE() { return 1; }
    /**
     * 特別なAの数字
     */
    get #ACE_SPECIAL_FIGURE() { return 11; }
    /**
     * 絵札の数字リスト
     */
    get #PICTURE_CARD_FIGURES() { return [11, 12, 13]; }
    /**
     * 特別な絵札の数字
     */
    get #PICTURE_CARD_SPECIAL_FIGURE() { return 10; };

    /**
     * カードリスト
     */
    #cards;

    /**
     * コンストラクタ―
     */
    constructor() {
        this.#cards = new Array();
    }

    /**
     * カードリストを返す
     */
    get cards() {
        return this.#cards;
    }

    /**
     * カードを追加する
     * @param {Card} card カード
     */
    addCard(card) {
        if (this.calcHand() > BlackjackLogic.BLACKJACK) {
            throw new Error('これ以上カードを引くことはできません');
        }

        this.#cards.push(card);
    }

    /**
     * 手札の合計を計算する
     * @param {boolean} isBackContained 裏面も含めて計算するかどうか
     * @returns {number} 手札の合計
     */
    calcHand(isBackContained = true) {
        let aceCount = 0;
        let sum = 0;
        this.#cards.forEach(card => {
            if (!(isBackContained || card.isFront)) {
                // 裏面も含めて計算しない場合で、裏面のカードだったら終了する
                return;
            }

            if (card.figure === this.#ACE_FIGURE) {
                aceCount++;
                return;
            }

            // J、Q、Kは10点になる
            let figure = card.figure;
            if (this.#PICTURE_CARD_FIGURES.includes(figure)) {
                figure = this.#PICTURE_CARD_SPECIAL_FIGURE;
            }

            sum += figure;
        });

        return sum + this.#calcAce(aceCount, sum);
    }

    /**
     * 手札のAを計算する
     * @param {number} aceCount 手札のAの数
     * @param {number} sum A以外の手札の合計
     * @returns {number} 手札のAの合計
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
 * デッキクラス
 */
class Deck {
    /**
     * マークの数
     */
    get #NUMBER_OF_MARKS() { return 4; }
    /**
     * 数字の数
     */
    get #NUMBER_OF_FIGURES() { return 13; }

    /**
     * カードリスト
     */
    #cards;

    /**
     * コンストラクタ―
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
     * カードを引く
     * @returns {Card} カード
     */
    drawCard() {
        const drawnIndex = Math.floor(Math.random() * this.#cards.length);
        const card = this.#cards.splice(drawnIndex, 1)[0] ?? null;
        if (card === null) {
            throw new Error('これ以上デッキからカードを引くことができません');
        }
        
        return card;
    }
}

/**
 * カードクラス
 */
class Card {
    /**
     * マーク
     */
    #suit;
    /**
     * 数字
     */
    #figure;
    /**
     * 画像のパス
     */
    #imageSrc;
    /**
     * 表面かどうか
     */
    #isFront;

    /**
     * コンストラクタ―
     * @param {number} suit マーク
     * @param {number} figure 数字
     * @param {string} imageSrc 画像のパス
     */
    constructor(suit, figure, imageSrc) {
        this.#suit = suit;
        this.#figure = figure;
        this.#imageSrc = imageSrc;
        this.#isFront = true;
    }

    /**
     * マークのゲッター
     */
    get suit() {
        return this.#suit;
    }

    /**
     * 数字のゲッター
     */
    get figure() {
        return this.#figure;
    }

    /**
     * 画像のパスのゲッター
     */
    get imageSrc() {
        return this.#imageSrc;
    }

    /**
     * 表面かどうかのセッター
     */
    set isFront(isFront) {
        this.#isFront = isFront;
    }

    /**
     * 表面かどうかのゲッター
     */
    get isFront() {
        return this.#isFront;
    }
}