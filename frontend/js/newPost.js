// user logged in confirmation
import { sendToken, getCookie } from './tokenConfirmation.js'

let tokenCookie = getCookie('token');
if (tokenCookie) {
    let answer = await sendToken(tokenCookie);
    if (answer.tokenConfirmed) {
        // user is logged in, remove buttons register and log in from the panel
        document.querySelector(".logInBTN").style.display = "none";
        document.querySelector(".registerBTN").style.display = "none";
        document.querySelector(".logInToPost").style.display = 'none';

        // check if its simple user and not redactor or admin
        let userRole = answer.data.user.role
        if (userRole === 'user') {
            let reddirUrl = `${window.location.protocol}//${window.location.host}${'/'}`;
            window.location.href = reddirUrl;
        }

        let userProfileBlock = document.querySelector(".userProfile")
        userProfileBlock.style.display = "flex";
        document.querySelector('.userName').textContent = answer.data.user.name;
        document.querySelector(".userEmail").textContent = answer.data.user.email;
    } else {
        let reddirUrl = `${window.location.protocol}//${window.location.host}${'/'}`;
        window.location.href = reddirUrl;
    }
}
// button to add new tag for the post
let confirmTagBTN = document.querySelector(".confirmTag"); 
confirmTagBTN.addEventListener('click', (e)=>{
    let postTagsVal = document.querySelector('#postTags').value;
    if (postTagsVal.length<1){return}

    let inputedTag = postTagsVal;
    insertTag(inputedTag);
    document.querySelector('#postTags').value = '';
})
function insertTag(value) {
    let target = document.querySelector(".tagsDiv");
    let insertedText = `<div class="tagLine">
                        <p class="confirmedTag">${value}</p>
                        <div class="removeTag tagBTN">Remove</div>
                    </div>`
    target.insertAdjacentHTML('afterbegin',insertedText);
    confirmedTagEvents()
}
function confirmedTagEvents (){
    document.querySelectorAll('.removeTag').forEach(item => {
        item.addEventListener("click", ()=>{
            item.parentElement.remove();
        })
    })
}

//TODO ADD CHECKS BEFORE SEND DATA TO SERVER(remove ',' from tags ets)
// button press to sendNewPost
let postBTN = document.querySelector('.postBTN');
postBTN.addEventListener('click', () => {
    let dataToSend = collectData();

    
    fetch(`${window.location.protocol}//${window.location.host}/api/newPost`, {
        method: 'POST',
        credentials: "include",
        body : dataToSend
    }).then(res => {
        return res.json();
    }).then((data)=> {
        let newData = JSON.parse(JSON.stringify(data))
        if (newData.code === 200) {
            document.querySelector('.articlePosted').style.display = 'block';
            setTimeout(() => {
                document.querySelector('.articlePosted').style.display = 'none';
            }, 2000);
        }
    }).catch(err => console.log(err));


})


function collectData() {
    let postHeader = document.querySelector('.postHeader').value;
    let postTextArea = document.querySelector('#postTextArea').value;
    let tagBlocksArr = document.querySelectorAll('.confirmedTag');
    let tagsArr = [];
    for (let i = 0; i<tagBlocksArr.length;i++){
        tagsArr.push(tagBlocksArr[i].textContent);
    }
    let postImage = document.querySelector('#postImage');
    const file = postImage.files[0];

    const formData = new FormData();
    formData.append("image", file);
    formData.append("headline", postHeader);
    formData.append("articleText", postTextArea);
    formData.append("tags", tagsArr);

    return formData
}