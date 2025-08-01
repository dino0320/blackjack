import { ServerConst } from './consts/server-const';
import { ErrorCodeConst } from './consts/error-code-const';

/**
 * A callback for handling the response.
 * @callback handleResponseCallback
 * @param {Object | null} response
 */

/**
 * Execute API.
 * @param {string} command Name of API
 * @param {Object | null} requestObject
 * @param {handleResponseCallback | null} func A callback for handling the response
 */
export function executeApi(command, requestObject = null, func = null) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', ServerConst.API_SERVER_URL + command);

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
            // Communication failure
            location.href = ServerConst.WEB_SERVER_URL + 'home';
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
 * Handle error.
 * @param {Object} response 
 */
function handleError(response) {
    switch (response.error_code) {
        case ErrorCodeConst.BAD_REQUEST:
            location.href = ServerConst.WEB_SERVER_URL + 'home';
            break;

        case ErrorCodeConst.UNAUTHORIZED:
            localStorage.removeItem('token');
            location.href = ServerConst.WEB_SERVER_URL + 'home';
            break;
        
        default:
            location.href = ServerConst.WEB_SERVER_URL + 'home';
            break;
    }
}