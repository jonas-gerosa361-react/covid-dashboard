const layout = {
  daily: {
    active: document.querySelector("#dailyActive"),
    confirmed: document.querySelector("#dailyConfirmed"),
    death: document.querySelector("#dailyDeath"),
    recovered: document.querySelector("#dailyRecovered"),
  },
  total: {
    active: document.querySelector("#totalActive"),
    confirmed: document.querySelector("#totalConfirmed"),
    death: document.querySelector("#totalDeath"),
    recovered: document.querySelector("#totalRecovered"),
  },
  config: {
    baseURL: "https://api.covid19api.com",
    countriesSelect: document.querySelector("#combo"),
    todayInput: document.querySelector("#today"),
    actives: document.querySelector("#actives"),
    loadingIcon: document.querySelector("#loadingIcon"),
    upArrow: "&#8593;",
    downArrow: "&#8595;",
  },
};

try {
  init();
  layout.config.countriesSelect.addEventListener("change", () => {
    startSearch();
  });

  layout.config.todayInput.addEventListener("change", () => {
    startSearch();
  });
} catch (error) {
  console.log(error);
}

function init() {
  renderContries();
  renderTodayGlobalSummary();
}

function startSearch() {
  layout.config.loadingIcon.style.display = "flex";
  layout.config.loadingIcon.scrollIntoView;
  renderCustomSummary(
    layout.config.countriesSelect.value,
    layout.config.todayInput.value
  );
}

function renderCustomSummary(country, date) {
  let dateISOString;
  date
    ? (dateISOString = getDayAsISOString(date))
    : (dateISOString = getDayAsISOString(layout.config.todayInput.value));
  //Necessary because API not always send a response with current date
  const TwoDaysBeforeDateAsISOString =
    getTwoDaysBeforeDateAsISOString(dateISOString);

  fetchJson(
    `${layout.config.baseURL}/country/${country}?from=${TwoDaysBeforeDateAsISOString}&to=${date}`
  )
    .then((response) => {
      layout.config.loadingIcon.style.display = "none";
      renderCustomCountryData(response);
      renderCustomSummaryDailyValues(response);
    })
    .catch((error) => {
      layout.config.loadingIcon.style.display = "none";
      console.log(error);
    });
}

function renderCustomCountryData(data) {
  if (
    data.message ===
    "for performance reasons, please specify a province or a date range up to a week"
  ) {
    alert("Seleção Inválida");
  }

  if (data.length > 1) {
    data = data[data.length - 1];
  }

  layout.total.confirmed.textContent = data.Confirmed;
  layout.total.death.textContent = data.Deaths;
  layout.total.recovered.textContent = data.Recovered;
  layout.config.actives.textContent = "Total Ativos";
  layout.total.active.textContent = data.Active;
}

function renderCustomSummaryDailyValues(data) {
  const today = data[data.length - 1];
  const yesterday = data[data.length - 2];
  const dailyConfirmed = yesterday.Confirmed - today.Confirmed;
  const dailyRecovered = yesterday.Recovered - today.Recovered;
  const dailyDeath = yesterday.Deaths - today.Deaths;
  const dailyActive = yesterday.Active - today.Active;
  layout.daily.confirmed.innerHTML =
    dailyConfirmed > 0
      ? `${layout.config.upArrow} ${dailyConfirmed}`
      : `${layout.config.downArrow} ${Math.abs(dailyConfirmed)}`;
  layout.daily.recovered.innerHTML =
    dailyRecovered > 0
      ? `${layout.config.upArrow} ${dailyRecovered}`
      : `${layout.config.downArrow} ${Math.abs(dailyRecovered)}`;
  layout.daily.death.innerHTML =
    dailyDeath > 0
      ? `${layout.config.upArrow} ${dailyDeath}`
      : `${layout.config.downArrow} ${Math.abs(dailyDeath)}`;
  layout.daily.active.innerHTML =
    dailyActive > 0
      ? `${layout.config.upArrow} ${dailyActive}`
      : `${layout.config.upArrow} ${Math.abs(dailyActive)}`;
}

function renderTodayGlobalSummary() {
  fetchJson(`${layout.config.baseURL}/summary`)
    .then((response) => {
      layout.total.confirmed.textContent = response.Global.TotalConfirmed;
      layout.total.death.textContent = response.Global.TotalDeaths;
      layout.total.recovered.textContent = response.Global.TotalRecovered;
      let date = response.Global.Date.substring(0, 10);
      let time = response.Global.Date.substring(12, 16);
      layout.config.todayInput.value = date;
      layout.config.actives.textContent = "Atualização";
      layout.total.active.textContent = `${date} ${time}`;
    })
    .catch((error) => {
      console.log(error);
    });
}

function renderContries() {
  fetchJson(`${layout.config.baseURL}/countries`)
    .then((response) => {
      for (country of response) {
        let countryOption = document.createElement("option");
        countryOption.value = country.Slug;
        countryOption.textContent = country.Country;
        layout.config.countriesSelect.appendChild(countryOption);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function getDayAsISOString(date) {
  return new Date(date).toISOString();
}

function getNextDayAsISOString(date) {
  date = new Date(date);
  const datePlusOneDay = date.setDate(date.getDate() + 1);
  return new Date(datePlusOneDay).toISOString();
}

function getTwoDaysBeforeDateAsISOString(date) {
  date = new Date(date);
  const dateLessOneDay = date.setDate(date.getDate() - 2);
  return new Date(dateLessOneDay).toISOString();
}

async function fetchJson(url, options) {
  return await fetch(url, options).then((response) => response.json());
}
