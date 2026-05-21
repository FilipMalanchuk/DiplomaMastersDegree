import {sendToken, getCookie} from './tokenConfirmation.js'
import {getHashtags} from './getHashtags.js'
import {subscribeOnHashtag} from './subscribeOnHashtag.js'
import {unSubOnHashtag} from './unSubOnHashtag.js'

let pageCounter = 0;
let userSubs = [];
let tokenCookie = getCookie('token');
if (tokenCookie) {
    let answer = await sendToken(tokenCookie);
    console.log(answer)
    if (answer.tokenConfirmed){
         // user is logged in, remove buttons register and log in from the panel
            document.querySelector(".logInBTN").style.display = "none";
            document.querySelector(".registerBTN").style.display = "none";

            let userProfileBlock = document.querySelector(".userProfile")
            userProfileBlock.style.display = "flex";
            if(answer.data.user.role === 'admin' || answer.data.user.role === 'redactor') {
                let newPostBlock = document.querySelector(".newPostBTN")
                newPostBlock.style.display = "flex";
            }
            document.querySelector('.userName').textContent = answer.data.user.name;
            document.querySelector(".userEmail").textContent = answer.data.user.email;
            userSubs = answer.data.user.subscriptions;
    }
}
// dislay all the tags on the page
async function getAndDisplayHashtags(page = 0){
    let answer = await getHashtags(page);
    let main = document.querySelector(".main");
    let hashtagsArr = answer.hashtags;
    hashtagsArr.forEach(obj => {
        let strToInsert = `
                <div class="tag">
                    <div class="tagMenu">
                        <div class="subscribeOnTag" id="${obj.hashtagName}">Subscibe</div>
                        <div class="searchTag">Search</div>
                    </div>
                    <span>${obj.hashtagName}</span>
                </div>`
                main.insertAdjacentHTML("beforeend",strToInsert);
    });
    HideOrAddEventSubscribeButton();
    showAlreadySubscribed(userSubs);
    changeSubIntoUnsub();
}
getAndDisplayHashtags();

function HideOrAddEventSubscribeButton() {
    let allSubscribeButtons = document.querySelectorAll(".subscribeOnTag")
    if (!tokenCookie) {
        allSubscribeButtons.forEach(item => {
            item.style.display = 'none';
        });
        document.querySelectorAll(".tagMenu").forEach(item => {
            item.style.top = "-100%"
        })
    } else {
        allSubscribeButtons.forEach(item => {
            item.addEventListener('click', subscribeClick)
        })
    }
}

async function subscribeClick(e){
    let answer = await subscribeOnHashtag(e.target.id);
    userSubs = answer.subscriptions;
    showAlreadySubscribed(userSubs);
    changeSubIntoUnsub()
    console.log(answer)
}

function showAlreadySubscribed(arr) {
    arr.forEach(item => {
        document.getElementById(item).parentElement.parentElement.classList.add('subscribed')
    })
}
function changeSubIntoUnsub() {
    let subArr = document.querySelectorAll(".subscribed .subscribeOnTag");
    subArr.forEach(elem => {
        elem.removeEventListener('click', subscribeClick);
        elem.classList.remove('subscribeOnTag');
        elem.classList.add('unSubOnTag');
        elem.textContent = 'Unsubscribe';
        elem.addEventListener('click',UnsubscribeClick);
    })
}
function changeUnsubIntoSub(elemToChange) {
    elemToChange.removeEventListener("click",UnsubscribeClick);
    elemToChange.textContent = "Subscibe";
    elemToChange.classList.remove('unSubOnTag');
    elemToChange.classList.add('subscribeOnTag');
    elemToChange.addEventListener('click',subscribeClick);
    elemToChange.parentElement.parentElement.classList.remove("subscribed");
}
async function UnsubscribeClick(e) {
    let answer = await unSubOnHashtag(e.target.id);
    userSubs = answer.subscriptions;
    changeUnsubIntoSub(e.target)
}

