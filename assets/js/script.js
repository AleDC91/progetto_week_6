const STRIVE_SCHOOL_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc4MTgyZWMwNTgzNTAwMTg1MjJjOTMiLCJpYXQiOjE3MDIzNjkzMjYsImV4cCI6MTcwMzU3ODkyNn0.h0EuMXDaY5yHvs7YbNyffnLg_c2iYKjD2JjjhkYev7E";
const URI = "https://striveschool-api.herokuapp.com/api/product";

class Product {
  constructor(_name, _description, _brand, _imageUrl, _price) {
    this.name = _name;
    this.description = _description;
    this.brand = _brand;
    this.imageUrl = _imageUrl;
    this.price = _price;
  }
  static total = 0;
}

let admin = true;


document.addEventListener("DOMContentLoaded", () => {
  if (admin && location.href.includes("index.html")) {
    let ul = document.querySelector("ul");
    let li = document.createElement("li");
    li.classList.add("nav-item");
    li.innerHTML = `<a class="nav-link bg-primary rounded-2 text-white" href="admin.html">Admin</a>`;
    ul.appendChild(li);
    renderProducts(URI);
    let container = document.querySelector(".products");

    container.addEventListener("click", (e) => {
// delete button
      if(e.target.classList.contains("delete-btn")){
        console.log(e.target.dataset.id)
        deleteProduct(URI, e.target.dataset.id);
      }
// edit button
      else if(e.target.classList.contains("edit-btn")){
        console.log(e.target.dataset.id);
        window.location.href = `edit.html?id=${e.target.dataset.id}`
      }
    })

  }
    else if(!admin && location.href.includes("index.html")){
    renderProducts(URI);
    

  } else if (admin && location.href.includes("admin.html")) {

    let ul = document.querySelector("ul");
    let li = document.createElement("li");
    li.classList.add("nav-item");
    li.innerHTML = `<a class="nav-link bg-success rounded-2" href="index.html">Shop</a>`;
    ul.appendChild(li);

    let createButton = document.querySelector("form button");
    // console.log(createButton);

    createButton.addEventListener("click", (e) => {
      e.preventDefault();
      let productName = document.forms[0][1].value;
      let productDescription = document.forms[0][2].value;
      let brand = document.forms[0][3].value;
      let price = Number(document.forms[0][4].value);
      let imageUrl = document.forms[0][5].value;

      if (
        !isNaN(price) &&
        productName.length > 2 &&
        productDescription.length > 2 &&
        imageUrl.startsWith("http")
      ) {
        let product = new Product(
          productName,
          productDescription,
          brand,
          imageUrl,
          price
        );
        createProduct(URI, product);
        document.forms[0][1].value = "";
        document.forms[0][2].value = "";
        document.forms[0][3].value = "";
        document.forms[0][4].value = "";
        document.forms[0][5].value = "";
      }
    });



  }

  else if(admin && location.href.includes("edit.html")){


    let ul = document.querySelector("ul");
    let li = document.createElement("li");
    li.classList.add("nav-item");
    li.innerHTML = `<a class="nav-link bg-success rounded-2" href="index.html">Shop</a>`;
    ul.appendChild(li);
    
    let createButton = document.querySelector("form button");
    // console.log(createButton);
    createButton.addEventListener("click", (e) => {
      e.preventDefault();
      let productName = document.forms[0][1].value;
      let productDescription = document.forms[0][2].value;
      let brand = document.forms[0][3].value;
      let price = Number(document.forms[0][4].value);
      let imageUrl = document.forms[0][5].value;

      if (
        !isNaN(price) &&
        productName.length > 2 &&
        productDescription.length > 2 &&
        imageUrl.startsWith("http")
      ) {
        let product = new Product(
          productName,
          productDescription,
          brand,
          imageUrl,
          price
        );
        let searchParams = new URLSearchParams(window.location.search);
        let productId = searchParams.get("id");
        editProduct(URI, productId, product);
        document.forms[0][1].value = "";
        document.forms[0][2].value = "";
        document.forms[0][3].value = "";
        document.forms[0][4].value = "";
        document.forms[0][5].value = "";
      }
    });


  } else if(location.href.includes("product.html")){
    let searchParams = new URLSearchParams(window.location.search);
    let productId = searchParams.get("id");
    getProduct(URI, productId);

  }
});













function getAllProducts(uri) {
  fetch(uri, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${STRIVE_SCHOOL_API_KEY}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

function createProduct(uri, data) {
  fetch(uri, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${STRIVE_SCHOOL_API_KEY}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        msg("success", "Prodotto aggiunto con successo!");
      } else {
        msg("error", "Errore! Prodotto non aggiunto" + response.status);
      }
    })
    .catch((err) => msg("error", err));
}

function getProduct(uri, id) {
  fetch(`${uri}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${STRIVE_SCHOOL_API_KEY}`,
    },
  })
    .then((response) => response.json())
    .then((data) => showProduct(data));
}

function deleteProduct(uri, id) {
  fetch(`${uri}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${STRIVE_SCHOOL_API_KEY}`,
    },
  }).then((response) => {
    if (response.ok) {
      msg("success", "Prodotto eliminato con successo!");
      renderProducts(uri);
    } else {
      msg("error", "Errore! Prodotto non cancellato" + response.status);
    }
  })
  .catch((err) => msg("error", err));
}

function renderProducts(uri) {
  let productsContainer = document.querySelector(".products");
  productsContainer.innerHTML = "";
  fetch(uri, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${STRIVE_SCHOOL_API_KEY}`,
    },
  })
    .then((response) => response.json())
    .then((products) => {
      console.log(products);
      products.forEach((product) => {
        let card = document.createElement("div");
        card.classList.add(
          "card",
          "col-12",
          "col-md-4",
          "col-lg-3",
          "col-xxl-2",
          "border-0",
          "p-0",
          "m-2",
          "shadow"
        );
        card.innerHTML = `
                <img src=${product.imageUrl} class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <h5>${product.price.toFixed(2)}€</h5>
                    <a href="product.html?id=${product._id}" class="btn btn-primary w-100 mb-2" data-id=${product._id}">Vedi prodotto</a>
                    <div class="admin-buttons d-flex justify-content-between" data-id=${product._id}>
                    <button class="btn btn-danger delete-btn" data-id=${product._id}>elimina</button>
                    <button class="btn btn-warning edit-btn" data-id=${product._id}>modifica</button>
                    </div>
                </div>`;
        productsContainer.appendChild(card);
      });
      hideButtons();
    });
}

function msg(type, message) {
  let msg = document.querySelector(".msg");
  msg.style.position = "fixed";
  msg.style.zIndex = 10;
  msg.style.width = "100%";
  msg.style.margin = "0 auto"
  msg.style.top = "50px"
  if (type === "error") {
    msg.innerHTML = `<div class="alert alert-danger w-75 text-center mx-auto mt-2" role="alert">
                          Errore! ${message}
                    </div>`;

    setTimeout(() => {
      msg.innerHTML = "";
    }, 3000);

  } else if (type === "success") {

    msg.innerHTML = `<div class="alert alert-success w-75 text-center mx-auto mt-2" role="alert">
                          ${message}
                    </div>`;
    setTimeout(() => {
      msg.innerHTML = "";
    }, 3000);
  }
}
function hideButtons(){
  let cards = document.querySelectorAll(".card");
  console.log(cards)

  if(!admin){
    cards.forEach(card => {
      let buttonsToHide = card.querySelector(".admin-buttons");
      // console.log(cards)
      buttonsToHide.innerHTML = "";
    })
  }
}

function editProduct(uri, id, data){
  fetch(`${uri}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${STRIVE_SCHOOL_API_KEY}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        msg("success", "Prodotto modificato con successo!");
      } else {
        msg("error", "Errore! Prodotto non modificato" + response.status);
      }
    })
    .catch((err) => msg("error", err));
}


function showProduct(product){
  let productContainer = document.querySelector(".product");
  let card = document.createElement("div");
  card.classList.add(
    "card",
    "col-12",
    "col-md-4",
    "col-lg-3",
    "col-xxl-2",
    "m-2"
  );
  card.innerHTML = `
          <img src=${product.imageUrl} class="card-img-top" alt="${product.name}">
          <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.description}</p>
              <h5>${product.price}€</h5>
              </div>
          </div>`;
  productContainer.appendChild(card);
}