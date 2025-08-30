<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title></title>
  <meta charset="utf-8" />
  @vite(['resources/scss/common.scss', 'resources/js/home.js'])
</head>
<body>
  <div>
    <h2>Blackjack</h2>

    <div id="name" class="invisible">
      Please enter a user name.<br>
      <input type="text" id="name-text"><input type="button" value="OK" id="ok-button">
    </div>

    <div id="game-home">
      Your stamina: <div id="stamina"></div>
      <input type="button" value="START" id="start-button">
      <input type="button" value="RANKING" id="ranking-button">
    </div>
  </div>
</body>
</html>