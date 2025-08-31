<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title></title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  @vite(['resources/scss/bootstrap.scss', 'resources/scss/common.scss', 'resources/js/ranking.js'])
</head>
<body>
  <h2>Ranking</h2>
  <table id="ranking-table" class="table table-striped">
    <thread>
      <tr>
        <th scope="col">Rank</th>
        <th scope="col">User name</th>
        <th scope="col">High score</th>
      </tr>
    </thread>
    <tbody>
    </tbody>
  </table>

  <div class="card text-center">
    <div class="card-body">
      <h5 class="card-title">Your High Score</h5>
      <div id="high-score" class="fs-4 fw-bold text-primary"></div>
    </div>
  </div>

  <button type="button" class="btn btn-primary" id="top-button">TOP</button>
</body>
</html>