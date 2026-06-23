import { sendToken, getCookie } from './tokenConfirmation.js'

let pageCounter = 0;
let tokenCookie = getCookie('token');
if (tokenCookie) {
    let answer = await sendToken(tokenCookie);
    console.log(answer)
    if (answer.tokenConfirmed) {
        // user is logged in, remove buttons register and log in from the panel
        document.querySelector(".logInBTN").style.display = "none";
        document.querySelector(".registerBTN").style.display = "none";

        let userProfileBlock = document.querySelector(".userProfile")
        userProfileBlock.style.display = "flex";
        if (answer.data.user.role === 'admin' || answer.data.user.role === 'redactor') {
            let newPostBlock = document.querySelector(".newPostBTN")
            newPostBlock.style.display = "flex";
        }
        document.querySelector('.userName').textContent = answer.data.user.name;
        document.querySelector(".userEmail").textContent = answer.data.user.email;
    }
}

let searchBTN = document.getElementById("searchBTN");
searchBTN.addEventListener("click", searchNews)

function searchNews() {
    let textInputVal = document.getElementById("searchInput").value
    let inputedTags = document.getElementById("inputedTags").querySelectorAll(".inputedTag .tagName");
    let tagNames = []
    inputedTags.forEach(item => {
        tagNames.push(item.innerHTML)
    })
    console.log(textInputVal);
    console.log(tagNames);
    tagNames = tagNames.join("%20")
    textInputVal = textInputVal.split(" ").join("%20")
    let fetchStrToAdd = `?tags=${tagNames}&searchText=${textInputVal}`
    console.log(fetchStrToAdd);
    window.location.href = `${window.location.protocol}//${window.location.host}/search${fetchStrToAdd}`
}


let addTagBTN = document.getElementById("addTagBTN");
addTagBTN.addEventListener("click", addTag);

function addTag() {
    let inputedData = document.getElementById("tagInput").value;
    let inputedTags = document.getElementById("inputedTags");

    inputedTags.insertAdjacentHTML("beforeend", `<div class="inputedTag">
                            <div class="tagName">${inputedData}</div>
                            <div class="removeTagBTN"></div>
                        </div>`);
    reAddEventListenersTagRemove();
}
function reAddEventListenersTagRemove() {
    let removeTagBTNArr = document.querySelectorAll('.removeTagBTN');
    removeTagBTNArr.forEach(item => item.removeEventListener("click",removeElemTag));
    removeTagBTNArr.forEach(item => item.addEventListener("click", removeElemTag));
}
function removeElemTag() {
    this.parentElement.remove();
}

// pages functions here
let prev = document.getElementById("prev");
let next = document.getElementById("next");

let params = new URLSearchParams(document.location.search);
let page = params.get("page");
let tags = params.get("tags");
let searchText = params.get("searchText");
if (page == 0) {
    prev.classList.add("disabled");
}
prev.addEventListener("click",()=>{
    if (page == 0 || page == null) {return}
    changePage(--page)
})
next.addEventListener("click",()=>{
    if (page == null && tags == null && searchText == null) {return}
    changePage(++page)
})

function changePage(page) {
    console.log(1)
    let params = new URLSearchParams(document.location.search);
    let fetchStrToAdd = "tags=" + params.get("tags") + "&searchText=" + params.get("searchText") + "&page=" + page;
    window.location.href = `${window.location.protocol}//${window.location.host}/search?${fetchStrToAdd}`
}