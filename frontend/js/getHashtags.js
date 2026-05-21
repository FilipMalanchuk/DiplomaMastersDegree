export async function getHashtags(page = 0) {
    try {
        let response = await fetch(`${window.location.protocol}//${window.location.host}/api/getHashtags`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ 'page' : page})
        })

        const data = await response.json();
        return data



    } catch (error) {
        console.error('Fetch error:', error);
    }
}