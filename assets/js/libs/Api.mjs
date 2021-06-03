export default class Api {
  _apiEndpoint = "https://api.covid19api.com";

  getSummaryData() {
    return axios.get(`${this._apiEndpoint}/summary`);
  }

  getDataByCountryAndRange(country, from, to) {
    return axios.get(
      `${this._apiEndpoint}/country/${country}?from=${from}&to=${to}`
    );
  }
}
