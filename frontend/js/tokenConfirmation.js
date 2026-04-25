export async function sendToken(token) {
    let answer = { 'tokenConfirmed': false }
    try {
        let response = await fetch(`${window.location.protocol}//${window.location.host}/api/indexFeed`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })

        const data = await response.json();
        console.log(data)
        let newData = JSON.parse(JSON.stringify(data))
                if (newData.code === 200) {
                    // user is logged in
                    answer.tokenConfirmed = true;
                    answer.data = newData;
                }
    } catch (error) {
        console.error('Fetch error:', error);
    }
    return answer
}

export function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
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