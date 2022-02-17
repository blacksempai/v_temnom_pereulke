<<<<<<< HEAD
let cartRequest = new XMLHttpRequest();

cartRequest.open('GET', '/cart/product');
cartRequest.responseType = 'json'
cartRequest.onload = () =>{
  cartRequest.response.forEach(cp => {
      modalElem.innerHTML += `
      <p>Product name: ${cp.product.name}</p>
      `
  });
}

cartRequest.send();


let modal = document.getElementById('modal');
=======
let cartRequest = new XMLHttpRequest()

cartRequest.open('GET','/cart/products')
cartRequest.responseType = 'json'
cartRequest.onload = () => {
    console.log(cartRequest.response);
    cartRequest.response.forEach(cp => {
        modalElem.innerHTML += `
            <p>Product name: ${cp.product.name}</p>
        `
    });
}

cartRequest.send()


let modalElem = document.getElementById('modal');
>>>>>>> aafa86d7b809786dc30c63a8048a7c2f8fc288d3
modalElem.style.display = 'none';
function modal() {
    if(modalElem.style.display == 'none') {
        modalElem.style.display = 'block'
    }
    else {
        modalElem.style.display = 'none'
    }
<<<<<<< HEAD
  
=======
>>>>>>> aafa86d7b809786dc30c63a8048a7c2f8fc288d3
}