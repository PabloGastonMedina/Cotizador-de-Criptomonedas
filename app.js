const monedaSelect = document.querySelector("#moneda")
const criptomonedasSelect = document.querySelector("#criptomoneda");

const formulario = document.querySelector("#formulario");

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

    fetch(url)
       .then( respuesta => respuesta.json())
       .then( cotizacion => {
        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
       })
}

function mostrarCotizacionHTML(cotizacion){
    console.log(cotizacion)
}
