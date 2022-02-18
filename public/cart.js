let cartRequest = new XMLHttpRequest()

cartRequest.open('GET','/cart/products')
cartRequest.responseType = 'json'
cartRequest.onload = () => {
    modalElem.innerHTML = '0'
    cartRequest.response.forEach(cp => {
        modalElem.innerHTML += `
            <p>Product: ${cp.product.name} <a href='/remove-from-cart?id=${cp.id}'>-</a></p>
        `
    });
    modalElem.innerHTML +=`
        <hr><hr>
        <input type="tell" placeholder="Your phone number"></input>
        <input type="text" placeholder="Your Name and Sirname"></input>
        <input type="number" placeholder="NovaPoshta number"></input>
        <button onclick="withdraw()">Buy All</button>
    `
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


function withdraw() {
    let wr = new XMLHttpRequest();
    wr.open('POST','/withdraw');

    wr.onload = () => {
        if(wr.status == 200) {
            alert('Thank you for shopping! Your goods is on the way.');
        }else {
            alert('Your balance is low. Go to profile and top up it!');
        }
    }

    wr.send();
}