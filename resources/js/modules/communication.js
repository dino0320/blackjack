import { ErrorCodeConst } from './consts/error-code-const';

/**
 * レスポンスを処理するのためのコールバック
 * @callback handleResponseCallback
 * @param {Object | null} response レスポンスオブジェクト
 */

/**
 * APIを実行する
 * @param {string} command API名
 * @param {Object | null} requestObject リクエストオブジェクト
 * @param {handleResponseCallback | null} func レスポンスを処理するのためのコールバック
 */
export function executeApi(command, requestObject = null, func = null) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `http://localhost:8080/api/${command}`);

    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.setRequestHeader('Accept', 'application/json');
    const token = localStorage.getItem('token');
    if (token !== null) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    xhr.responseType = 'json';

    xhr.send(JSON.stringify(requestObject));

    xhr.onreadystatechange = function() {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }

        if (xhr.status !== 200) {
            // 通信失敗
            location.href = 'http://localhost:8080/home';
            return;
        }

        if (xhr.response !== null && 'error_code' in xhr.response) {
            handleError(this.response);
            return;
        }

        if (func === null) {
            return;
        }

        func(xhr.response);
    }
}

/**
 * エラーを処理する
 * @param {Object} response 
 */
function handleError(response) {
    switch (response.error_code) {
        case ErrorCodeConst.BAD_REQUEST:
            location.href = 'http://localhost:8080/home';
            break;

        case ErrorCodeConst.UNAUTHORIZED:
            localStorage.removeItem('token');
            location.href = 'http://localhost:8080/home';
            break;
        
        default:
            location.href = 'http://localhost:8080/home';
            break;
    }
}