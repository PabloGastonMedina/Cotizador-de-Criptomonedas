const monedaSelect = document.querySelector("#moneda")
const criptomonedasSelect = document.querySelector("#criptomoneda");

const formulario = document.querySelector("#formulario");

const resultados = document.querySelector(".resultados");
console.log(resultados)

const objBusqueda = {
    moneda: "",
    criptomoneda : ""
}

//Creamos una promesa
const obtenerCriptomonedas = criptomonedas => new Promise(resolve =>{
    resolve(criptomonedas)
   })


document.addEventListener("DOMContentLoaded", () =>{
    consutarCriptomonedas();

    formulario.addEventListener("submit", submitFormulario);
    
    criptomonedasSelect.addEventListener("change", leerValor)
    monedaSelect.addEventListener("change", leerValor)
})


function consutarCriptomonedas(){
    const url  = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

    fetch(url)
       .then( respuesta => respuesta.json())
       .then( resultado => obtenerCriptomonedas(resultado.Data))
       .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach( cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement("option");
        option.value = Name;
        option.textContent = FullName
        criptomonedasSelect.appendChild(option);
    })
   
}

function leerValor (e) {
    objBusqueda[e.target.name] = e.target.value
    console.log(objBusqueda)
}

function submitFormulario (e){
    e.preventDefault();

    //Validamos
    const {moneda, criptomoneda} = objBusqueda;
    if (moneda === "" || criptomoneda === ""){
        mostrarAlerta("Abmos campos son obligatorios");
        return;
    }

    //Consultamos a la API con los resultados
    consultarApi();
}



function mostrarAlerta(mensaje){
    const existeError = document.querySelector(".alerta");

if(!existeError){
    const alerta = document.createElement("p");
    alerta.classList.add("alerta")
    alerta.textContent = mensaje;

    formulario.appendChild(alerta)

    setTimeout (() => {
        alerta.remove();
    }, 3000)
}
    
}

function consultarApi(){
    const { moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    mostrarSpinner();

    fetch(url)
       .then( respuesta => respuesta.json())
       .then( cotizacion => {
        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
       })
}

function mostrarCotizacionHTML(cotizacion){

    limpiarHTML();

    const PRICE = cotizacion.PRICE;
    const precio = document.createElement("p");
    precio.classList.add("precio");
    precio.innerHTML = `El precio es de <span>${PRICE}</span>`

    const ALTO = cotizacion.HIGHDAY;
    const precioAlto = document.createElement("p");
    precioAlto.classList.add("precio");
    precioAlto.innerHTML = `El precio mas alto del dia es de <span>${ALTO}</span>`

    const LOWDAY = cotizacion.LOWDAY;
    const precioMasBajo = document.createElement("p");
    precioMasBajo.classList.add("precio");
    precioMasBajo.innerHTML = `El precio mas bajo del dia es de <span>${LOWDAY}</span>`

    const ULTIMA = cotizacion.CHANGEPCT24HOUR;
    const ultimasHoras = document.createElement("p");
    ultimasHoras.classList.add("precio");
    ultimasHoras.innerHTML = `Variacion ultimas 24 horas <span>${ULTIMA}%</span>`

    const ACTUALIZACION = cotizacion.LASTUPDATE;
    const ultimaActualizacion = document.createElement("p");
    ultimaActualizacion.classList.add("precio");
    ultimaActualizacion.innerHTML = `Ultima actualización <span>${ACTUALIZACION}</span>`
   

    resultados.appendChild(precio)
    resultados.appendChild(precioAlto)
    resultados.appendChild(precioMasBajo)
    resultados.appendChild(ultimasHoras)
    resultados.appendChild(ultimaActualizacion)

}

function limpiarHTML(){
    while(resultados.firstChild) {
        resultados.removeChild(resultados.firstChild)
    }
}


function mostrarSpinner(){
    limpiarHTML();

    const spinner = document.createElement("div");
    spinner.classList.add("spinner")

    spinner.innerHTML = `
    <div class="dot-spinner">
      <div class="dot-spinner__dot"></div>
      <div class="dot-spinner__dot"></div>
      <div class="dot-spinner__dot"></div>
      <div class="dot-spinner__dot"></div>
      <div class="dot-spinner__dot"></div>
      <div class="dot-spinner__dot"></div>
      <div class="dot-spinner__dot"></div>
      <div class="dot-spinner__dot"></div>
    </div>
    `

    resultados.appendChild(spinner);

}