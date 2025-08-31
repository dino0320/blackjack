<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title></title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  @vite(['resources/scss/bootstrap.scss', 'resources/scss/common.scss', 'resources/js/home.js'])
</head>
<body>
  <div>
    <h2>Blackjack</h2>

    <div id="name" class="invisible">
      <h5>Please enter a user name</h5>
      <div class="input-group">
        <input type="text" id="name-text" class="form-control" aria-describedby="ok-button">
        <button id="ok-button" class="btn btn-outline-secondary" type="button">OK</button>
      </div>
    </div>

    <div id="game-home">
      <h5>Your stamina</h5>
      <div class="progress mb-3">
        <div id="stamina-progress-bar" class="progress-bar" role="progressbar" style="width: 50%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
      <button type="button" class="btn btn-primary" id="start-button">START</button>
      <button type="button" class="btn btn-primary" id="ranking-button">RANKING</button>
    </div>
  </div>
</body>
</html>