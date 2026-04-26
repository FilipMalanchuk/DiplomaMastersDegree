// user logged in confirmation
import { sendToken, getCookie } from './tokenConfirmation.js'

let tokenCookie = getCookie('token');
if (tokenCookie) {
    let answer = await sendToken(tokenCookie);
    console.log(answer)
    if (answer.tokenConfirmed) {
        // user is logged in, remove buttons register and log in from the panel
        document.querySelector(".logInBTN").style.display = "none";
        document.querySelector(".registerBTN").style.display = "none";
        document.querySelector(".logInToPost").style.display = 'none';

        let userProfileBlock = document.querySelector(".userProfile")
        userProfileBlock.style.display = "flex";
        document.querySelector('.userName').textContent = answer.data.user.name;
        document.querySelector(".userEmail").textContent = answer.data.user.email;
    }
}
