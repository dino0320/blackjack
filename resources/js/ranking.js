import { ServerConst } from './modules/consts/server-const';
import { executeApi } from './modules/communication';

const rankingTableElement = document.querySelector('#ranking-table > tbody');
const highScoreElement = document.querySelector('#high-score');
const topButtonElement = document.querySelector('#top-button');

executeApi(
    'get-ranking',
    null,
    function (response) {
        response.users.forEach((user) => {
            const tr = document.createElement("tr");
            const rankTd = document.createElement("td");
            rankTd.innerHTML = user.rank;
            tr.appendChild(rankTd);
            const userNameTd = document.createElement("td");
            userNameTd.innerHTML = user.user_name;
            tr.appendChild(userNameTd);
            const highScoreTd = document.createElement("td");
            highScoreTd.innerHTML = user.high_score;
            tr.appendChild(highScoreTd);
            rankingTableElement.appendChild(tr);
        });

        highScoreElement.innerHTML = response.high_score;
    }
);

topButtonElement.addEventListener('click', function () {
    location.href = ServerConst.WEB_SERVER_URL + 'home';
});