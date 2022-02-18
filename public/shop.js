
let shopGrid = document.getElementById('shop_grid'); 
 
let xhr = new XMLHttpRequest(); 
 
xhr.open('GET','/product'); 
xhr.responseType = 'json'; 
 
xhr.onload = () => {     
    shopGrid.innerHTML = '';
    if(xhr.response.status=='401'){
        shopGrid.innerHTML = "You must login to view shop";
    } 
    xhr.response.forEach((product)=>{ 
        shopGrid.innerHTML += ` 
        <div class="col">
        <div class="card shadow-sm" >
        <div class="card-header">Price: ${product.price}$</div>
          <img src="${product.img}" class="bd-placeholder-img card-img-top"  width="100%" height="350"   aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title></img>
          <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="btn-group">
                <a type="button" href="/cart?id=${product.id}" class="btn btn-primary">Buy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
        ` 
    });  
} 
 
xhr.send();