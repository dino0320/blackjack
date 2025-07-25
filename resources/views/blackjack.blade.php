<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title></title>
  <meta charset="utf-8" />
  @vite(['resources/css/common.css', 'resources/css/blackjack.css', 'resources/js/blackjack.js'])
</head>
<body>
  <div id="card-template" class="card invisible">
    <!-- Elements on the back side of a card -->
    <div class="back is-rotation">
      <img src="images/card_back.png" alt="" />
    </div>
    <!-- Elements on the front side of a card -->
    <div class="front is-rotation">
      <img src="" alt="" />
    </div>
  </div>

  <div id="bet">
    Please bet.<br>
    <input type="number" min="0" id="bet-chip-text">
    <input type="button" value="OK" id="bet-button">
  </div>

  <div id="win-or-lose-message" class="win-or-lose-message">
  </div>

  <div id="dealer-hand" class="hand">
  </div>
  <div id="dealer-number-of-cards-message" class="number-of-cards-message">
  </div>

  <div id="player-hand" class="hand">
  </div>
  <div id="player-number-of-cards-message" class="number-of-cards-message">
  </div>

  <input type="button" value="HIT" id="hit-button" class="invisible">
  <input type="button" value="STAND" id="stand-button" class="invisible">
  <input type="button" value="NEXT" id="next-button" class="invisible">

  <div id="chip-message" class="chip-message">
  </div>
</body>
</html>