let cartRequest = new XMLHttpRequest()

cartRequest.open('GET','/cart/products')
cartRequest.responseType = 'json'
cartRequest.onload = () => {
    modalElem.innerHTML = ''
    let sum = 0;
    cartRequest.response.forEach(cp => {
        sum += cp.product.price;
        modalElem.innerHTML += `
            <p>Product: ${cp.product.name} <span> price: ${cp.product.price}$</span> <a href='/remove-from-cart?id=${cp.id}' style="font-size: 2rem; text-decoration: none;">-</a></p>
        `
    });
    modalElem.innerHTML +=`
        <hr><hr>
        <input type="tell" placeholder="Your phone number"></input>
        <input type="text" placeholder="Your Name and Sirname"></input>
        <input type="number" placeholder="NovaPoshta number"></input>
        <p>Total price: ${sum}</p>
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
            modalElem.innerHTML = '';
            alert('Thank you for shopping! Your goods is on the way.');
        }else {
            alert('Your balance is low. Go to profile and top up it!');
        }
    }

    wr.send();
}