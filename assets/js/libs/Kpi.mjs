export default class Kpi {
  getConfirmedCases(data) {
    let response = 0;
    for (const element of data) {
      response += element.Confirmed;
    }
    return response.toLocaleString("pt-BR");
  }

  getDeathCases(data) {
    let response = 0;
    for (const element of data) {
      response += element.Deaths;
    }
    return response.toLocaleString("pt-BR");
  }

  getRecoveredCases(data) {
    let response = 0;
    for (const element of data) {
      response += element.Recovered;
    }
    return response.toLocaleString("pt-BR");
  }
}
