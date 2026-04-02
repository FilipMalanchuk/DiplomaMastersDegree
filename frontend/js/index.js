console.log(1)

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
            // display aditional intormation on the page
            document.getElementById('boxToDisplayIfToken').style.display = 'flex'
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