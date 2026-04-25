// check if user is already logged in and reddirect him to index page

import {sendToken, getCookie} from './tokenConfirmation.js'

let tokenCookie = getCookie('token');
if (tokenCookie) {
    let answer = await sendToken(tokenCookie);
    console.log(answer)
    if (answer.tokenConfirmed){
         // user is logged in
            let reddirUrl = `${window.location.protocol}//${window.location.host}${'/'}`;
            window.location.href = reddirUrl;
    }
}
// end of check if user logged in

let registrationBTN = document.querySelector(".registrationBTN")
registrationBTN.addEventListener("click", ()=> {
    //check if any input is empty
    let necessaryArr = document.querySelectorAll(".necessary");
    let flag = false;
    necessaryArr.forEach(item => {
        if (item.value == ""){
            flag = true;
            item.style.borderColor = "red"
        } else {
            item.style.borderColor = "black"
        }
    })
    if (flag) {return}

    //check if passwords input values are equal 
    let pass1 = document.getElementById('password1')
    let pass2 = document.getElementById('password2')

    if (pass1.value !== pass2.value) {
        document.getElementById('error').textContent = "passwords are not matching"
        return
    } else {
        document.getElementById('error').textContent = ""
    }

    if (pass1.value.length < 8) {
        document.getElementById('error').textContent = "Minimal password length is 8 symbols"
        return
    } else {
        document.getElementById('error').textContent = ""
    }
    // sending message to server
    sendData();
    
})

function sendData() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password1').value;
    let telegram = document.getElementById('telegram').value;



    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'name' : name,
            'email': email,
            'password': password,
            'telegram' : telegram
        })
    }).then(res => {
        console.log(res)
        return res.json();
    }).then((data)=> {
        let newData = JSON.parse(JSON.stringify(data))
        // if registration was a success
        if (newData.message === "User created") {
            let reddirUrl = `${window.location.protocol}//${window.location.host}${'/loginPage'}`;
            window.location.href = reddirUrl;
        } else {
            displayError(newData.message);
        }
    }).catch(err => console.log(err));
}

function displayError(message) {
    document.getElementById("error").textContent = message
}