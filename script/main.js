const dbproductos = "http://localhost:3000/productos/"
const dbcompra = "http://localhost:3000/compra/"

const containerCards = document.querySelector('.containerCards');
const addItem = document.querySelector('.addItem');
const cantProductCart = document.querySelector('#cantProductCart');
const btnCarrito = document.querySelector('#btnCarrito');
const modal_body = document.querySelector('#modal-body');
const modal_favorito = document.querySelector('.modal-favorito');
const vaciarCarrito = document.querySelector('#vaciarCarrito');
const precioTotal = document.querySelector('#precioTotal');
const btnSearch = document.querySelector('#btnSearch');
const search = document.querySelector('#search');
const btnUser = document.querySelector('#btnUser');




// espera que la DOM este cargado para
document.addEventListener('DOMContentLoaded', () =>{
    carrito = JSON.parse(localStorage.getItem('carrito')) || {}
    console.log("carrito al inicio ",carrito);
    getProductos()
    cantElementoCarrito()
    mostrarCarrito()
    // cantCarrito()
    // mostrarCarrito()
})



const busqueda = async (_valor) => {
    _valor = _valor.toLowerCase()
    try {
        let response = await fetch(dbproductos)
        let data = await response.json();

        containerCards.innerHTML = ""

        data.forEach(element => {
            const {id, nombre, contenido, precio, categoria, image} = element
            if (categoria === _valor) {
                crearTarjeta(id, nombre, contenido, precio, categoria, image);
            } 
        })

    } catch (error) {
        console.log(error);
    }
}

const crearTarjeta = (id, nombre, contenido, precio, categoria, image) => {
    categoria = categoria.toUpperCase()
    containerCards.innerHTML +=`
    <div id="${id}" class="card" style="width: 18rem;" background-color: #F8F8F8; ">

    <img src="${image}" class="card-img-top" alt="...">
    <div class="card-body ">
    <div class="d-flex justify-content-between">
        <p class="card-text text-secondary">${categoria}</p>
        <button id="${id}" style="color: #06A389;  " type="button" class="d-flex justify-content-center btn btn-light  h-25 d-inline-block" data-bs-toggle="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
            </svg>
        </button>
        </div>
    <h5 class="card-title">${nombre}</h5>
    <p class="card-text text-secondary">${contenido}</p>
    
    
    <h5 class="card-title fs-3" style="color: #06A389;">$ ${precio}</h5>

    
    <div class="mx-auto row bg-white w-85 " style="border-radius: 50px;"  >
        <div class=" d-flex justify-content-between p-1 " role="group" aria-label="Basic mixed styles example" >
            <button onclick="eliminarDelCarrito(${id})" id="del${id}" style="color: #06A389;" type="button" class="delItem btn btn-light rounded-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"/>
            </svg>
            </button>
            
            <button style="font-weight: 700; font-size: 18px; color: black;" type="button" class="btn border-0" disabled ></button>
           
            <button onclick='agregarAlCarrito("${id}", "${precio}", "${nombre}" ," ${image}")' id="${id}" style="color: #06A389;" type="button" class="addItem btn btn-light rounded-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" fill="currentColor" class="add  bi bi-plus-lg" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                </svg>
            </button>

        </div>
    </div>
    </div>
</div>
`
}

// array del carrito
// let carrito = []
 
let carrito = {}
let favoritos = {}

const eliminarDelCarrito = (id) => {
	modal_body.innerHTML = ""
	delete carrito[id];
    cantElementoCarrito()
    mostrarCarrito()
    guardarStorage()
}
const vaciarElCarrito = () => {
	modal_body.innerHTML = ""
    for (const key in carrito) {
        delete carrito[key];
    }
    localStorage.removeItem('carrito');
    cantElementoCarrito()
    mostrarCarrito()
    console.log("vaciarElCarrito", carrito);
}

const agregarAlCarrito = (id, precio, nombre, image) => {
    
	if (carrito[id] !== undefined ) {
		carrito[id].cantidad += 1
	} else {
        carrito[id] = { 
            cantidad: 1, 
            precio: precio, 
            nombre: nombre, 
            image: image 
        }
        }
        cantElementoCarrito()
        guardarStorage() 
        console.log("agregarAlCarrito", carrito);

}

const cantElementoCarrito = () =>{
    let contadorCarrito = 0
    for (const key in carrito) {
        contadorCarrito += 1
    }
    cantProductCart.textContent = contadorCarrito
}

const mostrarCarrito = () => {
    modal_body.innerHTML = ""
    let totalCarrito = 0
    console.log("mostrarCarrito", carrito);
    for (const key in carrito) {
        if (carrito.hasOwnProperty(key)) {
            const element = carrito[key];
            const subtotalCarrito = element.cantidad * element.precio
            totalCarrito += subtotalCarrito
            
            modal_body.innerHTML +=`
                <div id="${key}" class="infoCartaCarrito d-flex mx-auto h-25 w-75">
                    <img src="${element.image}" class="imgcartaCarrito card-img-top img-fluid" alt="...">
                    <div class="d-flex flex-wrap ">
                        <p class="card-title fs-8" style="color: #06A389;">${element.nombre}</p>
                        <div class=" d-flex justify-content-around align-items-center ">
                            <p class="card-title fs-9 text-dark" >${element.cantidad} x $${element.precio} = $${subtotalCarrito}</p>
                            <button onclick="eliminarDelCarrito(${key})" id="del${key}" type="button" class="delItem btn btn-light text-danger">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                `
        }
    }
    precioTotal.textContent = "$" + totalCarrito
    
}

const agregarAfavoritos = (id, precio, nombre, image) => {
    
	if (favoritos[id] !== undefined ) {
		console.log('Este producto ya fue agregado a favoritos');
	} else {
        favoritos[id] = { 
            precio: precio, 
            nombre: nombre, 
            image: image 
        }
        }
        console.log("agregarAfavoritos", favoritos);
}

const mostrarFavoritos = () => {
    modal_favorito.innerHTML = ""
    console.log("mostrarCarrito", favoritos);
    for (const key in favoritos) {
        if (favoritos.hasOwnProperty(key)) {
            const element = favoritos[key];
            
            modal_favorito.innerHTML +=`
                <div id="${key}" class="infoCartaCarrito d-flex mx-auto h-25 w-75">
                    <img src="${element.image}" class="imgcartaCarrito card-img-top img-fluid" alt="...">
                    <div class="d-flex flex-wrap ">
                        <p class="card-title fs-8" style="color: #06A389;">${element.nombre}</p>
                        <div class=" d-flex justify-content-around align-items-center ">
                            <p class="card-title fs-9 text-dark" >$${element.precio}</p>
                            <button onclick="eliminarDeFavoritos(${key})" id="del${key}" type="button" class="delItem btn btn-light text-danger">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                `
        }
    }
}

const eliminarDeFavoritos = (id) => {
	modal_favorito.innerHTML = ""
	delete favoritos[id];
    mostrarFavoritos()
}

const vaciarFavorito = () => {
	modal_favorito.innerHTML = ""
    for (const key in favoritos) {
        delete favoritos[key];
    }
    localStorage.removeItem('favoritos');
    mostrarFavoritos()
    console.log("vaciarFavorito", favoritos);
}



// muestra todos los productos en la home
const getProductos = async () => {
    const response = await fetch(dbproductos);
    const data = await response.json();
    data.forEach(element => {
        const {id, nombre, contenido, precio, categoria, image} = element
        // console.log(id, nombre, contenido, precio, categoria, image);
        containerCards.innerHTML +=`
            <div id="${id}" class="card" style="width: 18rem;" background-color: #F8F8F8; ">

            <img src="${image}" class="card-img-top" alt="...">
            <div class="card-body ">
            <div class="d-flex justify-content-between">
                <p class="card-text text-secondary">${categoria.toUpperCase()}</p>
                <button onclick='agregarAfavoritos("${id}", "${precio}", "${nombre}" ," ${image}")' id="${id}" id="${id}" value="${id}" style="color: #06A389;  " type="button" class=" btnFavorito d-flex justify-content-center btn btn-light  h-25 d-inline-block" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                    </svg>
                </button>
                </div>
            <h5 class="card-title">${nombre}</h5>
            <p class="card-text text-secondary">${contenido}</p>
            
            
            <h5 class="card-title fs-3" style="color: #06A389;">$ ${precio}</h5>

            
            <div class="mx-auto row bg-white w-85 " style="border-radius: 50px;"  >
                <div class=" d-flex justify-content-between p-1 " role="group" aria-label="Basic mixed styles example" >
                    <button onclick="eliminarDelCarrito(${id})" id="del${id}" style="color: #06A389;" type="button" class="delItem btn btn-light rounded-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"/>
                    </svg>
                    </button>
                    
                    <button style="font-weight: 700; font-size: 18px; color: black;" type="button" class="btn border-0" disabled ></button>
                   
                    <button onclick='agregarAlCarrito("${id}", "${precio}", "${nombre}" ," ${image}")' id="${id}" style="color: #06A389;" type="button" class="addItem btn btn-light rounded-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" fill="currentColor" class="add  bi bi-plus-lg" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                        </svg>
                    </button>

                </div>
            </div>
            </div>
        </div>
        `
    });
} 

search.addEventListener('submit', (e)=>{
    e.preventDefault()
    const searchInput = document.querySelector('.searchInput');
    valor = searchInput.value.toLowerCase();
    busqueda(valor)
})

    //guardar en el local storage
function guardarStorage() {
    console.log("carrito al storage", carrito);
    localStorage.removeItem('carrito');
    localStorage.setItem('carrito', JSON.stringify(carrito))
}




// Peticion metodo POST a compras

const formPago = document.querySelector('#formPago')

formPago.addEventListener('submit', async(e)=>{
    e.preventDefault()
    carritoFinal = "final", carrito
    await fetch(dbcompra, {
        method:'POST',
        body: JSON.stringify(("final", carrito)),
        headers: {
            "content-Type": "application/json; charset=utf-8"
        },
    })
    localStorage.removeItem('carrito');
})

btnUser.addEventListener('click',(e)=>{
    e.preventDefault()
    console.log('holis Admin');
    window.location.href='../admin.html';
})

