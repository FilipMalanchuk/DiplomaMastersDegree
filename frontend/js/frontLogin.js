let submitBtn = document.getElementById('btnLogin')

submitBtn.addEventListener('click', () => {
    let emailVal = document.getElementById('emailForLogin').value
    let passwordVal = document.getElementById('passwordForLogin').value
    sendData(emailVal, passwordVal)
})

function sendData(email, password) {
    fetch('http://localhost:3000/api/login', {
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
    }).catch(err => console.log(err));
}

function displayError (text) {
    document.getElementById("errorText").innerText = text
}