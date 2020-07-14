const createHTML = (obj) => {
  const temp = Math.floor(obj.temperature);
  const feels = Math.floor(obj.feels);
  const desc = obj.description.charAt(0).toUpperCase() + obj.description.slice(1);
  return `
    <div class="location">
            <h1 class="location-name" id="location">${obj.city}</h1>
            <img alt ="${obj.description}" width="80px" height="80px" src="https://openweathermap.org/img/wn/${obj.image}@2x.png">
        </div>
        <div class="temperature" id="temperature">
            <div class="degree-section">
                <h2 class="temperature-degree" id="degree">${temp} &#8451;</h2>
            </div>
            <div class="temperature-description">
            <p>${desc}</p>
            <p>Feels like: ${feels} &#8451;</p>
            <p>Wind: ${obj.wind} meter/sec </p>
            </div>
        </div>`;
};

const div = document.querySelector('#container');

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(async position => {
    const lon = position.coords.longitude;
    const lat = position.coords.latitude;

    const data = { lat, lon };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    const response = await fetch('/nearby', options);
    const json = await response.json();
    const html = createHTML(json);
    div.innerHTML = html;
  });
} else {
  div.innerHTML = '<h1>Geolocation is not supported by this browser</h1>';
  console.log('geolication not available');
}

const callApi = async () => {
  const value = document.querySelector('#search').value;
  try {
    const data = await fetch(`/search/${value}`);
    const parsedData = await data.json();
    const html = createHTML(parsedData);
    div.innerHTML = html;
  } catch (err) {
    div.innerHTML = '<h1> Oops, city not found </h1>';
    console.error('Sorry, wrong city name');
  }
};

window.onload = () => {
  const button = document.querySelector('#submit');
  button.addEventListener('click', (e) => {
    e.preventDefault();
    callApi();
    document.querySelector('#search').value = '';
  });
};
