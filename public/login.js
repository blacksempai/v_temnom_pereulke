let form = document.getElementById('login_form');

form.addEventListener('submit', (event) => {
             event.preventDefault();
             let data = `login=${event.target['login'].value}&password=${event.target['password'].value}`

             let xhr = new XMLHttpRequest();
             xhr.open('POST', '/login');
             xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
             xhr.onload = () => {
                          if (xhr.status == 200) {
                                       document.cookie = `token=${xhr.response}`;
                                       localStorage.setItem('user',event.target['login'].value);
                                       window.location.replace('index.html');s
                          }
                          else if (xhr.status == 401) {
                                       alert(xhr, response);

                          }
                          else if (xhr.status == 500) {
                                       console.log(xhr.response);
                                       alert('Server Error');
                          }
             }
             xhr.send(data);
})