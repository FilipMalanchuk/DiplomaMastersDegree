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
    let inputedTag = document.querySelector('#postTags').value;
    insertTag(inputedTag)
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


