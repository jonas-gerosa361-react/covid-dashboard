import Api from "./libs/Api.mjs";
import DateUtils from "./libs/Date.mjs";
import Kpi from "./libs/Kpi.mjs";

const api = new Api();
const date = new DateUtils();
const kpi = new Kpi();
const filtro = document.querySelector("#filtro");
let chart;

(function () {
  try {
    init();
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      text: error,
    });
  }
})();

function init() {
  renderCountryCombo().then(() => {
    firstRender();
  });

  filtro.addEventListener("click", (event) => {
    event.preventDefault();
    const form = document.querySelector("form");
    const formData = new FormData(form);
    customRender(formData);
  });
}

function firstRender() {
  const setup = {
    from: date.getOneWeekFromDate(new Date()),
    to: date.getOneDayFromDate(new Date()),
    country: "brazil",
  };
  const countryDataRequest = api.getDataByCountryAndRange(
    "brazil",
    setup.from,
    setup.to
  );

  countryDataRequest.then((response) => {
    setup.data = response.data;
    const kpiData = {
      confirmed: kpi.getConfirmedCases(response.data),
      death: kpi.getDeathCases(response.data),
      recovered: kpi.getRecoveredCases(response.data),
    };
    renderFilterData(setup);
    renderKpiData(kpiData);
    renderLineChart(response.data);
  });
}

function customRender(data) {
  const setup = {
    from: new Date(data.get("date_start")).toISOString(),
    to: date.getOneDayFromDate(new Date(data.get("date_end"))),
    country: data.get("country"),
  };

  const countryDataRequest = api.getDataByCountryAndRange(
    setup.country,
    setup.from,
    setup.to
  );

  countryDataRequest.then((response) => {
    const kpiData = {
      confirmed: kpi.getConfirmedCases(response.data),
      death: kpi.getDeathCases(response.data),
      recovered: kpi.getRecoveredCases(response.data),
    };
    const chartData = {
      data: response.data,
      action: data.get("filterBy"),
    };
    renderKpiData(kpiData);
    renderCustomLineChart(chartData);
  });
}

function renderFilterData(data) {
  document.querySelector("#date_start").value = data.from.substr(0, 10);
  document.querySelector("#date_end").value = data.to.substr(0, 10);
  document.querySelector(
    '#cmbCountry [value="' + data.country + '"]'
  ).selected = true;
}

function renderCountryCombo() {
  return new Promise((resolve, reject) => {
    const data = api.getSummaryData();
    data.then((response) => {
      for (const country of response.data.Countries) {
        let countryOption = document.createElement("option");
        countryOption.value = country.Slug;
        countryOption.textContent = country.Country;
        document.querySelector("#cmbCountry").appendChild(countryOption);
        resolve("finished");
      }
    });

    data.catch((error) => {
      Swal.fire({
        icon: "error",
        text: error,
      });
    });
  });
}

function renderKpiData(data) {
  document.querySelector("#kpiconfirmed").textContent = data.confirmed;
  document.querySelector("#kpideaths").textContent = data.death;
  document.querySelector("#kpirecovered").textContent = data.recovered;
}

function renderLineChart(apiData) {
  const context = document.querySelector("#linhas").getContext("2d");
  const labels = extractDateField(apiData);
  const dailyDeaths = extractDailyDeaths(apiData);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Número de mortes",
        data: dailyDeaths,
        fill: false,
        borderColor: "blue",
        tension: 0.1,
      },
      {
        label: "Média de mortes",
        data: extractAverage(dailyDeaths),
        fill: false,
        borderColor: "orange",
        tension: 0.1,
      },
    ],
  };
  chart = new Chart(context, {
    type: "line",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Distribuição de novos casos",
        },
      },
    },
  });
}

function renderCustomLineChart(apiData) {
  const context = document.querySelector("#linhas").getContext("2d");
  const labels = extractDateField(apiData.data);
  let cases;
  let dailyValues;
  switch (apiData.action) {
    case "Deaths":
      cases = "mortos";
      dailyValues = extractDailyDeaths(apiData.data);
      break;
    case "Confirmed":
      cases = "casos confirmados";
      dailyValues = extractDailyConfirmed(apiData.data);
      break;
    case "Recovered":
      cases = "recuperados";
      dailyValues = extractDailyRecovered(apiData.data);
      break;
  }

  const data = {
    labels: labels,
    datasets: [
      {
        label: `Número de ${cases}`,
        data: dailyValues,
        fill: false,
        borderColor: "blue",
        tension: 0.1,
      },
      {
        label: `Média de ${cases}`,
        data: extractAverage(dailyValues),
        fill: false,
        borderColor: "orange",
        tension: 0.1,
      },
    ],
  };
  chart.destroy();
  chart = new Chart(context, {
    type: "line",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Distribuição de novos casos",
        },
      },
    },
  });
}

function extractDateField(data) {
  return data.map(function (value) {
    return value.Date.substr(0, 10);
  });
}

function extractAverage(data) {
  data.pop();
  const average = _.meanBy(data);
  return data.map(() => {
    return average;
  });
}

function extractDailyDeaths(data) {
  return data.map(function (value, index, elements) {
    if (elements[index + 1]) {
      return elements[index + 1].Deaths - value.Deaths;
    }
  });
}

function extractDailyConfirmed(data) {
  return data.map(function (value, index, elements) {
    if (elements[index + 1]) {
      return elements[index + 1].Confirmed - value.Confirmed;
    }
  });
}

function extractDailyRecovered(data) {
  return data.map(function (value, index, elements) {
    if (elements[index + 1]) {
      return elements[index + 1].Recovered - value.Recovered;
    }
  });
}
