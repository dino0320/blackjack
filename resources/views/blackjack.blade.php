<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title></title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  @vite(['resources/scss/bootstrap.scss', 'resources/scss/common.scss', 'resources/scss/blackjack.scss', 'resources/js/blackjack.js'])
</head>
<body class="text-bg-success">
  <div id="card-template" class="playing-card invisible">
    <!-- Elements on the back side of a card -->
    <div class="back is-rotation">
      <img src="images/card_back.png" alt="" />
    </div>
    <!-- Elements on the front side of a card -->
    <div class="front is-rotation">
      <img src="" alt="" />
    </div>
  </div>

  <div id="win-alert" class="alert alert-success invisible" role="alert">You win.</div>
  <div id="lose-alert" class="alert alert-danger invisible" role="alert">You lose.</div>
  <div id="draw-alert" class="alert alert-secondary invisible" role="alert">Draw.</div>

  <div id="bet">
    <h5>Please bet</h5>
    <div class="input-group">
      <input type="number" id="bet-chip-text" class="form-control" aria-describedby="bet-button" min="1" value="1">
      <button id="bet-button" class="btn btn-primary" type="button">BET</button>
    </div>
  </div>

  <h3><span id="chip-message" class="badge bg-warning chip-message">
  </span></h3>

  <div class="container text-center">
    <div class="row">
      <div class="col">
        <div id="player" class="card text-bg-success invisible">
          <div class="card-body">
            <h5 class="card-title">Player</h5>
            <h3><span id="player-number-of-cards-message" class="badge bg-secondary number-of-cards-message">
            </span></h3>
            <div id="player-hand" class="hand">
            </div>
            <button type="button" id="hit-button" class="btn btn-primary invisible">HIT</button>
            <button type="button" id="stand-button" class="btn btn-primary invisible">STAND</button>
            <button type="button" id="next-button" class="btn btn-primary invisible">NEXT</button>
          </div>
        </div>
      </div>
      <div class="col">
        <div id="dealer" class="card text-bg-success invisible">
          <div class="card-body">
            <h5 class="card-title">Dealer</h5>
            <h3><span id="dealer-number-of-cards-message" class="badge bg-secondary number-of-cards-message">
            </span></h3>
            <div id="dealer-hand" class="hand">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>