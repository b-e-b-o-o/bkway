export class ApiService {
    static baseUrl = 'http://localhost:3333';

    static getStoptimes(stopId: string, from: string, to: string) {
        return fetch(`${ApiService.baseUrl}/stoptimes?stop=${stopId}&from=${from}&to=${to}`)
            .then(response => response.json());
    }
}