import {sendToken, getCookie} from './tokenConfirmation.js'

let tokenCookie = getCookie('token');
if (tokenCookie) {
    let answer = await sendToken(tokenCookie);
    if (answer.tokenConfirmed){
         // user is logged in
            document.querySelector(".profileName span.name").textContent = answer.data.user.name;
            document.querySelector(".profileEmail span.email").textContent = answer.data.user.email;
            document.querySelector(".profileRole span.role").textContent = answer.data.user.role;
            if(answer.data.user.role === "admin") {
                adminPanelDisplay();
                getAdminData(1);
            }
    }
} else {
    let reddirUrl = `${window.location.protocol}//${window.location.host}${'/'}`;
    window.location.href = reddirUrl;
}



/////////Admin stuff statrs here
let pageNumber = 1;

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
        return res.json();
    }).then((data)=> {
        let newData = JSON.parse(JSON.stringify(data))
        if (newData.code === 200) {
            // TODO add removeOfAllnewlyadded elements
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
                            stringToAdd = stringToAdd.split('type="checkbox"').join(' type="checkbox" checked ')
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
    let obj = getData(this);
    console.log(obj);
    adminChangeUserData(obj);
}

function getData(elem){
    let lineData = elem.parentElement.parentElement
    console.log(lineData);
    let email = lineData.querySelector(".promotionPanel_UserEmail span").innerHTML;
    let role = lineData.querySelector(".promotionPanel_promoList input:checked").value;
    let bannedStatus = lineData.querySelector(".bannedStatus input").checked;
    return {'email' : email, 'role' : role, 'banned' : bannedStatus}
}

function adminChangeUserData(obj) {
    fetch(`${window.location.protocol}//${window.location.host}/api/adminChangeUserData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body : JSON.stringify(obj)
    }).then(res => {
        return res.json();
    }).then((data)=> {
        newData = JSON.parse(JSON.stringify(data))
        if (newData.code === 200) {
            console.log('data changed')
        }
    }).catch(err => console.log(err));
}

/////Admin stuff ends here
