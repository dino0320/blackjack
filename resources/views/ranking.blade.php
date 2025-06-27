<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title></title>
  <meta charset="utf-8" />
  @vite(['resources/css/common.css', 'resources/js/ranking.js'])
</head>
<body>
  <h2>ランキング</h2>
  <table id="ranking-table">
    <tr>
      <th>順位</th>
      <th>ユーザー名</th>
      <th>ハイスコア</th>
    </tr>
  </table>

  あなたのスコア: <div id="high-score"></div>

  <input type="button" value="TOP" id="top-button">
</body>
</html>