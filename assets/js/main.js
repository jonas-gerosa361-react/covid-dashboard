import Api from "./libs/Api.mjs";
import Render from "./libs/Render.mjs";

const api = new Api();
const render = new Render();

(function () {
  try {
    api.getSummaryData().then((response) => {
      render.HomeTotalValues(response.data.Global);
      renderHomePieChart(response.data.Global, "#pizza");
      const top10 = getTop10ByDeath(response.data.Countries);
      renderHomeParetoChart(top10, "#barras");
    });
  } catch (error) {
    return Swal.fire({
      icon: "error",
      title: "Erro",
      text: error,
    });
  }
})();

function renderHomePieChart(data, id) {
  const context = document.querySelector(id).getContext("2d");
  new Chart(context, {
    type: "pie",
    data: {
      labels: ["Confirmados", "Recuperados", "Mortos"],
      datasets: [
        {
          label: "# of Votes",
          data: [data.NewConfirmed, data.NewRecovered, data.NewDeaths],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
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

function getTop10ByDeath(data) {
  data = data.sort(compare);
  return formatDataToChart(data.slice(0, 10));
}

function formatDataToChart(data) {
  const response = {
    labels: [
      data[0].Country,
      data[1].Country,
      data[2].Country,
      data[3].Country,
      data[4].Country,
      data[5].Country,
      data[6].Country,
      data[7].Country,
      data[8].Country,
      data[9].Country,
    ],
    datasets: [
      {
        label: "Mortes por País",
        data: [
          data[0].TotalDeaths,
          data[1].TotalDeaths,
          data[2].TotalDeaths,
          data[3].TotalDeaths,
          data[4].TotalDeaths,
          data[5].TotalDeaths,
          data[6].TotalDeaths,
          data[7].TotalDeaths,
          data[8].TotalDeaths,
          data[9].TotalDeaths,
        ],
        backgroundColor: "blue",
      },
    ],
  };
  return response;
}

function compare(a, b) {
  if (a.TotalDeaths < b.TotalDeaths) {
    return 1;
  }
  if (a.TotalDeaths > b.TotalDeaths) {
    return -1;
  }
  return 0;
}

function renderHomeParetoChart(data, id) {
  console.log(data);
  const context = document.querySelector(id).getContext("2d");
  new Chart(context, {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Total de mortes por pais - Top 10",
        },
      },
    },
  });
}
