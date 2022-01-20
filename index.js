require("dotenv").config();
const {
  leerInput,
  inquirerMenu,
  pausa,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busqueda");
require("colors");

const main = async () => {
  let opt;
  const buquedas = new Busquedas();
  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        // mostrar mensaje
        const termino = await leerInput("Ciudad: ");
        const lugares = await buquedas.Ciudad(termino);
        // console.log(lugares);

        const id = await listarLugares(lugares);
        // console.log(id);
        const lugarSeleccionado = lugares.find((l) => l.id === id);

        if (id != 0) {
          const climas = await buquedas.climaLugar(
            lugarSeleccionado.lat,
            lugarSeleccionado.lng
          );

          console.log("\n--Informacion de la Ciudad\n".green);
          console.log("Ciudad: ", lugarSeleccionado.name);
          console.log("Lat: ", lugarSeleccionado.lng);
          console.log("Log: ", lugarSeleccionado.lat);
          console.log("Temperatura ", climas.temp);
          console.log("Minima: ", climas.temp_min);
          console.log("Maxima:  ", climas.temp_max);
          console.log("Descripcion: ", climas.des);

          buquedas.agregarHistorial(lugarSeleccionado.name);
        }
        break;

      case 2:
        buquedas.historial.map((name, i) => {
          console.log(`${i + 1}. ${name}`);
        });
        break;
    }

    if (opt !== 0) await pausa();
  } while (opt != 0);
};

main();
