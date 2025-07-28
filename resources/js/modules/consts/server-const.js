export class ServerConst {
    /**
     * Web server URL
     */
    static get WEB_SERVER_URL() { return 'http://' + location.hostname + '/'; }
    
    /**
     * API server URL
     */
    static get API_SERVER_URL() { return 'http://' + location.hostname + '/api/'; }
}