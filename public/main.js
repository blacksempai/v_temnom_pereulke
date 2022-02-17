if (document.cookie.includes("token")) {
  let user = localStorage.getItem("user");
  document.getElementById("profile").innerHTML = ` 
                          <a href='/user'>${user}</a>
                          <a href='/logout'>LOgout</a>
             `;
  for (let a of document.getElementsByClassName("auth")) {
      a.style.display = "none";
  }
} else {
  document.getElementById("shop").style.display = "none";
}
