const axios = require("axios");
const fs = require("fs");
class Busquedas {


  historial = []


  dbPath = "./db/database.json";

  constructor() {
    this.leerDb();
  }

  async Ciudad(lugar = "") {
    // console.log('Lugar: ', lugar);
    try {
      const limit = 5;
      const language = "es";
      const access_token = process.env.MAPBOX_KEY;
      const resp = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json?limit=${limit}&types=place%2Cpostcode%2Caddress&language=${language}&autocomplete=true&access_token=${access_token}`
      );

      //   console.log(resp.data.features);

      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        name: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));

      // Podemos conectarnos con una api para obtener datos...
      //     const peticion =
      //     'https://api.mapbox.com/geocoding/v5/mapbox.places/bogot.json?access_token=pk.eyJ1IjoiZGNlcmNoaWFybyIsImEiOiJja3lsdjFxem0xeWw1Mm5wOXppdDkwNHBjIn0.GQFtRuSdv099ck4tViN16g'
      //   const resp = await axios.get(peticion);
      //   console.log(resp.data.features);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async climaLugar(lat, lon) {
    const key = process.env.OPENWEATHER_KEY;
    const lang = "es"; //idioma
    const units = "metric"; //temperaturas en celcios
    try {
      const resp = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=${units}&lang=${lang}`
      );
      //   console.log(resp.data);
      const salida = {
        des: resp.data.weather[0].description,
        ...resp.data.main,
      };
      // console.log(salida);
      return salida;
      //   {
      //     des: 'algo de nubes',
      //     temp: 38.6,
      //     feels_like: 41.27,
      //     temp_min: 38.6,
      //     temp_max: 38.73,
      //     pressure: 1009,
      //     humidity: 32
      //   }
    } catch (e) {
      console.log(e);

    }
  }

  agregarHistorial(lugar = "") {
    //  prevenir duplcidad
    if (this.historial.includes(lugar)) return;
    // console.clear();
    // console.log('LA LISTA!!',this.historial);
    this.historial.push(lugar);
    this.guardarDb();
  }

  guardarDb() {
    // const payload = {
    //   historial: this.historial.hist,
    // };
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.historial));
    } catch (e) {
      console.log(e);
    }
  }
  leerDb() {
    try {
      if (!fs.existsSync(this.dbPath)) return;

      const elemento = fs.readFileSync(this.dbPath, { encoding: "utf8" });
      this.historial = JSON.parse(elemento);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Busquedas;
