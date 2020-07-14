const express = require('express');
const nodefetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

app.enable('etag');
app.use(express.static('public'));
app.use(express.json());

app.post('/nearby', async (req, res) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${req.body.lat}&lon=${req.body.lon}&units=metric&appid=a137bc6b3402e0ee63f21d58465e1ee3`;
  try {
    const data = await nodefetch(url);
    const parsedData = await data.json();
    const obj = {
      city: parsedData.name,
      temperature: parsedData.main.temp,
      description: parsedData.weather[0].description,
      image: parsedData.weather[0].icon,
      wind: parsedData.wind.speed,
      feels: parsedData.main.feels_like
    };
    res.status(200).json(obj);
  } catch (err) {
    res.status(401).send('Sorry, no access to geolocation');
  }
});

app.get('/search/:city', (req, res) => {
  nodefetch(`https://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&units=metric&appid=a137bc6b3402e0ee63f21d58465e1ee3`)
    .then(data => data.json())
    .then(data => {
      const obj = {
        city: data.name,
        temperature: data.main.temp,
        description: data.weather[0].description,
        image: data.weather[0].icon,
        wind: data.wind.speed,
        feels: data.main.feels_like
      };
      res.status(200).json(obj);
    })
    .catch(() => res.status(404).send('Sorry, wrong city name'));
});

app.listen(port, () => console.log('Server listening on port ' + port));
