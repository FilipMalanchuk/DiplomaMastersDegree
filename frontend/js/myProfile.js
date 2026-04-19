let pageNumber = 1;
if (getCookie('token')) {

    sendToken(getCookie('token'))
} else {
    let reddirUrl = `${window.location.protocol}//${window.location.host}${'/'}`;
    window.location.href = reddirUrl;
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
            document.querySelector(".profileName span.name").textContent = newData.user.name;
            document.querySelector(".profileEmail span.email").textContent = newData.user.email;
            document.querySelector(".profileRole span.role").textContent = newData.user.role;
            console.log(newData)
            if(newData.user.role === "admin") {
                adminPanelDisplay();
                getAdminData(1);
            }
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

function adminPanelDisplay() {
    document.querySelector('.rolesPanel').style.display = "flex"
}
function getAdminData(page) {
    fetch(`${window.location.protocol}//${window.location.host}/api/adminData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body : JSON.stringify({
            'page' : page
        })
    }).then(res => {
        console.log(res)
        return res.json();
    }).then((data)=> {
        newData = JSON.parse(JSON.stringify(data))
        if (newData.code === 200) {
            // TODO add removeOfAllnewlyadded elements
            console.log(newData)
            let whereToAddElements = document.querySelector('.userTable');
            let counter = 0;
            newData.dataArr.forEach(element => {
                counter++;
                let stringToAdd = `
                    <div class="userTableLine addedData">
                            <div class="promotionPanel_UserName"><span>${element.name}</span></div>
                            <div class="promotionPanel_UserEmail"><span>${element.email}</span></div>
                            <div class="promotionPanel_UserRole"><span>${element.role}</span></div>
                            <div class="promotionPanel_promoList">
                                <div class="radioLine">
                                    <input type="radio" name="assignRole${counter}" value="user" id="radioUser"/>
                                <label for="radioUser">User</label>
                                </div>
                                <div class="radioLine">
                                    <input type="radio" name="assignRole${counter}" value="redactor" id="radioRedactor"/>
                                <label for="radioRedactor">Redactor</label>
                                </div>
                            </div>
                            <div class="bannedStatus"><input type="checkbox"></div>
                            <div class="confirmButton"><span>Confirm</span></div>
                        </div>`
                        if (element.role === 'user') {
                            stringToAdd = stringToAdd.split('id="radioUser"').join(' checked ')
                        } else {
                            stringToAdd = stringToAdd.split('id="radioRedactor"').join(' checked ')
                        }

                        if (element.banned === true) {
                            stringToAdd = stringToAdd.split('type="checkbox"').join(' checked ')
                        }
                
                whereToAddElements.insertAdjacentHTML('beforeend', stringToAdd);
                addListenersToAddedData()
            });
        }
    }).catch(err => console.log(err));
}

function getNewPage(page) {
    removeAddedData();
    getAdminData(page);
}
//remove addedData that was added from DB to webpage
function removeAddedData() {
    document.querySelectorAll(".addedData").forEach(item => {
        item.remove();
    })
}
// pageButtons
document.getElementById('next').addEventListener('click',()=>{
    pageNumber++;
    getNewPage(pageNumber);
});
document.getElementById('previous').addEventListener('click',()=>{
    pageNumber--;
    if(pageNumber <= 0) {pageNumber = 1}
    getNewPage(pageNumber);
});

function addListenersToAddedData(){
    document.querySelectorAll('.addedData .confirmButton span').forEach(item => {
        item.addEventListener('click', changeData);
    })
}
//data change
function changeData() {
    console.log(1);
}

