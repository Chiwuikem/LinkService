// http://localhost:3000/twitch/callback
async function twitchApiGet(endpoint, accessToken, clientId, params={}) {
    const url = new URL(`https://api.twitch.tv/helix/${endpoint}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k,v));

    //Send GET requests with required headers
    const res = await fetch(url.toString(), {
        headers: {
            'Client-ID': clientId,
            'Authorization': `Bearer ${accessToken}`,

        },
    });

    if(!res.ok){
        throw new Error(`Twitch API error ${res.status}`);
    }
    return res.json(); 
}

//Retrieve the authenticated user's Twitch profile
export async function getTwitchUser(accessToken, clientId){
    const data = await twitchApiGet('users', accessToken, clientId);
    return data.data[0]
}


export async function getSubscriberCount(broadcasterId, accessToken, clientId){
    try{
        const data = await twitchApiGet('subscriptions', accessToken, clientId, { broadcaster_id: broadcasterId});
        return data.total || 0;
    } catch (err){
        console.error("Subscriber count failed:", err);
        return 0;
    }
}

export async function getAverageViews(broadcasterId, accessToken, clientId, first=20){
    const videos = await twitchApiGet('videos', accessToken, clientId, {user_id: broadcasterId, first});
    const counts = videos.data.map(v => v.view_count);
    const sum = counts.reduce((a,b) => a+b, 0 );
    // if len counts is at least 1 return avg view count else return 0
    return counts.length ? Math.round(sum/counts.length) : 0;
}