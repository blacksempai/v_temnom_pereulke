if(document.cookie.includes('token')){
let user = localStorage.getItem('user');
             document.getElementById('profile').innerHTML =` 
                          <a href='/user'>${user}</a>
                          <a href='/logout'>LOgout</a>
             `;
}
else{

             document.getElementById('shop').style.display = 'none';
}