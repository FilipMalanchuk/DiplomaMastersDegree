// check if user is already logged in and reddirect him to index page
import {sendToken, getCookie} from './tokenConfirmation.js'

let tokenCookie = getCookie('token');
if (tokenCookie) {
    let answer = await sendToken(tokenCookie);
    console.log(answer)
    if (answer.tokenConfirmed){
         // user is already logged in
            let reddirUrl = `${window.location.protocol}//${window.location.host}${'/'}`;
            window.location.href = reddirUrl;
    }
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
        let newData = JSON.parse(JSON.stringify(data))
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

