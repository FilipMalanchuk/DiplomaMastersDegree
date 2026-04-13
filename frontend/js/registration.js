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

    // sending message to server
    
})