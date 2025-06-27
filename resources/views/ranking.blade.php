<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title></title>
  <meta charset="utf-8" />
  @vite(['resources/css/common.css', 'resources/js/ranking.js'])
</head>
<body>
  <h2>Ranking</h2>
  <table id="ranking-table">
    <tr>
      <th>Rank</th>
      <th>User name</th>
      <th>High score</th>
    </tr>
  </table>

  Your high score: <div id="high-score"></div>

  <input type="button" value="TOP" id="top-button">
</body>
</html>