if (getCookie('token')) {

    sendToken(getCookie('token'))
}


function sendToken(token) {
    fetch(`${window.location.protocol}//${window.location.host}/api/indexFeed`, {
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
            // user is logged in, remove buttons register and log in from the panel
            document.querySelector(".logInBTN").style.display = "none";
            document.querySelector(".registerBTN").style.display = "none";

            let userProfileBlock = document.querySelector(".userProfile")
            userProfileBlock.style.display = "flex";
            document.querySelector('.userName').textContent = newData.user.name;
            document.querySelector(".userEmail").textContent = newData.user.email;

            console.log(newData)
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