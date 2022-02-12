if(document.cookie.includes('token')){
    let user = localStorage.getItem('user');
    document.getElementById('profile').innerHTML = `
        <a href="/profile"> ${user} </a>
        <a href="/logout">Logout</a>
    `;
}
else {
    if(document.getElementById('shop')) {
        document.getElementById('shop').style.display = 'none';
    }
}
