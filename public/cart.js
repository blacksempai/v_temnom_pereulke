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
modalElem.style.display = 'none';
function modal() {
    if(modalElem.style.display == 'none') {
        modalElem.style.display = 'block'
    }
    else {
        modalElem.style.display = 'none'
    }
}