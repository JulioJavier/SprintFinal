const dbproductos = "http://localhost:3000/productos/"


// espera que la DOM este cargado para
document.addEventListener('DOMContentLoaded', () =>{
    getProductos()
})

// muestra todos los productos en la home
const getProductos = async () => {
    const response = await fetch(dbproductos);
    const data = await response.json();
    containerCards.innerHTML +=""
    data.forEach(element => {
        const {id, nombre, contenido, precio, categoria, image, stock} = element
        // console.log(id, nombre, contenido, precio, categoria, image);
        containerCards.innerHTML +=`
            <div id="${id}" class="card" style="width: 18rem;" background-color: #F8F8F8; ">

            <img src="${image}" class="card-img-top" alt="...">
            <div class="card-body ">
            <div class="d-flex justify-content-between">
                <p class="card-text text-secondary">${categoria.toUpperCase()}</p>
                
            </div>
                <h5 class="card-title">${nombre}</h5>
            <div class="d-flex justify-content-between">
                <p class="card-text text-secondary">${contenido}</p>
                <p class="card-text text-secondary">Stock: ${stock.toUpperCase()}</p>
                </div>
            
            <h5 class="card-title fs-3" style="color: #06A389;">$ ${precio}</h5>

            
            <div class="mx-auto row bg-white w-85 " style="border-radius: 50px;"  >
                <div class=" d-flex justify-content-between p-1 " role="group" aria-label="Basic mixed styles example" >
                <button onclick="deleteItem(${id})"  id="adminDEL" type="submit" class="btn btn-danger w-100">Eliminar</button>
                </div>
            </div>
            </div>
        </div>
        `

    });
} 




const capturaDatos =() =>{
    const id = document.getElementById('inputID').value
    const nombre = document.getElementById('inputNOMBRE').value
    const contenido = document.getElementById('inputCONTENIDO').value
    const precio = document.getElementById('inputPRECIO').value
    const stock = document.getElementById('inputSTOCK').value
    const categoria = document.getElementById('inputCATEGORIA').value
    const image = document.getElementById('inputIMAGE').value
        const datos = {
            id,
            nombre,
            contenido,
            precio,
            categoria,
            stock,
            image
        }
    return datos
}

// Peticion metodo POST

const formAdmin = document.querySelector('#formAdmin')
const adminADD = document.querySelector('#adminADD')
adminADD.addEventListener('click', async(e)=>{
    e.preventDefault()
    const objeto = capturaDatos()

    await fetch(dbproductos, {
        method:'POST',
        body: JSON.stringify(objeto),
        headers: {
            "content-Type": "application/json; charset=utf-8"
        }
    })
})

const adminEDIT = document.querySelector('#adminEDIT')
adminEDIT.addEventListener('click', async(e)=>{
    e.preventDefault()
    const id = document.getElementById('inputID').value
    const objeto = capturaDatos()

    await fetch(dbproductos + id, {
        method:'PUT',
        body: JSON.stringify(objeto),
        headers: {
            "content-Type": "application/json; charset=utf-8"
        }
    })
})


// Peticion Delete -- Eliminacion de datos

const deleteItem = (id) => {
    fetch(dbproductos + id, {
        method: 'DELETE'
    })
    getProductos()
}