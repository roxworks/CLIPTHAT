// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    console.log('Attempting clip');
    const channelName = req.query.channelName as string;
    console.log('Channel name: ' + channelName);
    // get broadcaster id
    let idBlob = await axios.get(`https://api.twitch.tv/helix/users?login=${channelName}`, {
        headers: {
            'Authorization': 'Bearer ' + process.env.TWITCH_OAUTH_TOKEN,
            'Client-ID': process.env.TWITCH_CLIENT_ID as string
        }
    });
    let id = idBlob?.data?.data[0]?.id;
    console.log('ID: ' + id);

    //post to clip endpoint with oauth token from .env (POST https://api.twitch.tv/helix/clips)
    let clipBlob = await axios.post(`https://api.twitch.tv/helix/clips?broadcaster_id=${id}`, {}, {
        headers: {
            Authorization: `Bearer ${process.env.TWITCH_OAUTH_TOKEN}`,
            'Client-ID': process.env.TWITCH_CLIENT_ID as string
        }
    });
    
    console.log('Clip response: ', clipBlob?.data);
    let clipURL = 'https://clips.twitch.tv/' + clipBlob?.data?.data?.[0]?.id;
    console.log('Clip URL: ' + clipURL);

    res.status(200).json({ name: 'clip response', url: clipURL } as Data);
}
