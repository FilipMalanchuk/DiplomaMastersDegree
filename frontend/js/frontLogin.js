// check if user is already logged in and reddirect him to index page
if (getCookie('token')) {

    sendToken(getCookie('token'))
}

function sendToken(token) {
    fetch(`${window.location.protocol}//${window.location.host}/api/checkLogged`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    }).then(res => {
        console.log(res)
        return res.json();
    }).then((data)=> {
        newData = JSON.parse(JSON.stringify(data))
        if (newData.code === 200) {
            // user already logged in
            let reddirUrl = `${window.location.protocol}//${window.location.host}${'/'}`;
            window.location.href = reddirUrl;
            
        }
    }).catch(err => console.log(err));
}


function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
// end of check if user already logged in

let submitBtn = document.getElementById('btnLogin')

submitBtn.addEventListener('click', () => {
    let emailVal = document.getElementById('emailForLogin').value
    let passwordVal = document.getElementById('passwordForLogin').value
    // TODO value checks if empty
    sendData(emailVal, passwordVal)
})

function sendData(email, password) {
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'email': email,
            'password': password
        })
    }).then(res => {
        console.log(res)
        return res.json();
    }).then((data)=> {
        newData = JSON.parse(JSON.stringify(data))
        displayError(newData.message)
        if (newData.code === 200) {
            let reddirUrl = `${window.location.protocol}//${window.location.host}${'/'}`;
            window.location.href = reddirUrl;
        }
    }).catch(err => console.log(err));
}

function displayError (text) {
    document.getElementById("errorText").innerText = text
}

