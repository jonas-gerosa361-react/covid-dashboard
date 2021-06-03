export default class Render {
  HomeTotalValues(data) {
    const totalConfirmed = document.querySelector("#confirmed");
    const totalDeath = document.querySelector("#death");
    const totalRecovered = document.querySelector("#recovered");
    const updatedAt = document.querySelector("#date");
    const convertedDate = convertDate(data.Date);

    totalConfirmed.textContent = data.TotalConfirmed.toLocaleString("pt-BR");
    totalDeath.textContent = data.TotalDeaths.toLocaleString("pt-BR");
    totalRecovered.textContent = data.TotalRecovered.toLocaleString("pt-BR");
    updatedAt.textContent += ` ${convertedDate}`;
  }
}

function convertDate(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(date));
}
