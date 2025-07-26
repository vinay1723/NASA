const article = document.querySelector("article");
const inputDate = document.querySelector("input");
const form = document.querySelector("form");
let historyList = document.querySelector("ul");

form.addEventListener("submit", handleSubmit);
historyList.addEventListener("click", async (e) => {
  if (e.target.tagName !== "A") return;
  const date = new Date(e.target.textContent).toISOString().split("T")[0];
  const data = await fetchData(date);
  renderArticle(data, `Picture on ${date.toLocaleString()}`);
});

window.onload = () => {
  getCurrentImageOfTheDay();
};

const api_key = "LCc8yC3V8qH2zpKDNlqx2G9jEKIw2kwPOhuNCX2a";

function handleSubmit(e) {
  e.preventDefault();
  const date = new Date(inputDate.value).toISOString().split("T")[0];
  getImageOfTheDay(date);
}

async function getImageOfTheDay(date) {
  const data = await fetchData(date);
  if (!data) return;
  saveSearch(date.toLocaleString());
  renderArticle(data, `Picture on ${date}`);
  addSearchToHistory();
}

async function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split("T")[0];
  const data = await fetchData(currentDate);
  if (!data) return;
  renderArticle(data, "NASA Picture of the Day");
}

async function fetchData(date) {
  try {
    const res = await fetch(
      `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${api_key}`
    );

    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

function saveSearch(date) {
  let dates = JSON.parse(localStorage.getItem("dates") || "[]");
  dates.push({ date: date });
  localStorage.setItem("dates", JSON.stringify(dates));
}

function addSearchToHistory() {
  const historyDates = JSON.parse(localStorage.getItem("dates"));
  console.log(historyDates);
  if (!historyDates) return;

  historyDates.forEach((date) => {
    historyList.innerHTML += `<li><a>${date.date}</a></li>`;
  });
}

function renderArticle(data, title) {
  article.innerHTML = `<h1> ${title}</h1>
  <img
    src=${data.hdurl}
    alt="Nasa picture"
  />
  <h3>${data.title}</h3>
  <p>
    ${data.explanation}
  </p>`;
}
