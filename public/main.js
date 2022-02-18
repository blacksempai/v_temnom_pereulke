if (document.cookie.includes("token")) {
  let user = localStorage.getItem("user");
  document.getElementById("profile").innerHTML = ` 
                          <a href='/user'>${user}</a>
                          <a href='/logout'>LOgout</a>
             `;
             console.log(document.getElementsByClassName("auth"));
  for (let a of document.getElementsByClassName("auth")) {
      a.style.display = "none";
  }
} else {
  document.getElementById("shop").style.display = "none";
}

function modal() {
    let mo = document.getElementById('modal');
    if(mo.style.display == 'none') {
        mo.style.display = 'block'
    }
    else {
        mo.style.display = 'none'
    }
}