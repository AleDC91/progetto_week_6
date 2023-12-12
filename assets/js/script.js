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

// let p1 = new Product("rinvio", "rinvio 35 cm", "CT", "https:/vdfvadfv.sdfdfhvsf/dfsdfv", 17.90);
// console.log(p1);

document.addEventListener("DOMContentLoaded", () => {
  // createProduct(URI, p1);
  // getAllProducts(URI);
  // getProduct(URI, "6578306fc058350018522e87");
  // deleteProduct(URI, "6578306fc058350018522e87");
  // getAllProducts(URI);

  if (admin && location.href.includes("index.html")) {

    let ul = document.querySelector("ul");
    let li = document.createElement("li");
    li.classList.add("nav-item");
    li.innerHTML = `<a class="nav-link bg-primary rounded-2" href="admin.html">Admin</a>`;
    ul.appendChild(li);

    renderProducts(URI);

  } else if (admin && location.href.includes("admin.html")) {

    let ul = document.querySelector("ul");
    let li = document.createElement("li");
    li.classList.add("nav-item");
    li.innerHTML = `<a class="nav-link bg-success rounded-2" href="index.html">Shop</a>`;
    ul.appendChild(li);

    let createButton = document.querySelector('form button');
    // console.log(createButton);

    createButton.addEventListener("click", (e) => {
        e.preventDefault();
        let productName = document.forms[0][1].value;
        let productDescription = document.forms[0][2].value;
        let brand = document.forms[0][3].value;
        let price = document.forms[0][4].value;
        let imageUrl = document.forms[0][5].value;

        if ((!isNaN(+price)) && productName.length > 2 && productDescription.length > 2 && imageUrl.startsWith("http")){
          let product = new Product(productName, productDescription, brand, imageUrl, price);
          Product.total++;
          createProduct(URI, product);
                 }
    })

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
  }).then(window.location.href = "index.html")
    .catch((err) => console.log(err));
}

function getProduct(uri, id) {
  fetch(`${uri}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${STRIVE_SCHOOL_API_KEY}`,
    },
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
}

function deleteProduct(uri, id) {
  fetch(`${uri}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${STRIVE_SCHOOL_API_KEY}`,
    },
  }).catch((err) => console.log(err));
}

function renderProducts(uri) {
  let productsContainer = document.querySelector(".products");
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
          "m-2"
        );
        card.innerHTML = `
                <img src=${product.imageUrl} class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <a href="" class="btn btn-primary">Vedi prodotto</a>
                </div>`;
        productsContainer.appendChild(card);
      });
    });
}
