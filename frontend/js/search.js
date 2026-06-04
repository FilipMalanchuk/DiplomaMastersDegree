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

