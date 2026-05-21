export async function unSubOnHashtag(hashtagName) {
    try {
        let response = await fetch(`${window.location.protocol}//${window.location.host}/api/unSubOnHashtag`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ 'hashtagName' : hashtagName})
        })

        const data = await response.json();
        return data



    } catch (error) {
        console.error('Fetch error:', error);
    }
}