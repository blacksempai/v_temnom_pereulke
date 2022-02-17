
let shopGrid = document.getElementById('shop_grid'); 
 
let xhr = new XMLHttpRequest(); 
 
xhr.open('GET','/product'); 
xhr.responseType = 'json'; 
 
xhr.onload = () => {     
    shopGrid.innerHTML = '';
    if(xhr.response.status=='401'){
        shopGrid.innerHTML = response;
    } 
    xhr.response.forEach((product)=>{ 
        shopGrid.innerHTML += ` 
            <div class="product"> 
                <h2>${product.name}</h2> 
                <img width="200px" src="${product.img}"> 
                <p>Description: ${product.description}</p> 
                <p><b>Price: ${product.price}</b></p> 
                <p><a href="/cart?id=${product.id}">Buy</a></p>
            </div> 
        ` 
    });  
} 
 
xhr.send();