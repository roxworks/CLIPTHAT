// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getSession } from "next-auth/react"
import {init} from '@amplitude/node';
const ampClient = init('89e981520ef6f51935d9ada1c05587ee');

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const session = await getSession({ req })
    if(!session) {
        res.status(401).json({ name: 'error', error: 'Unauthorized', message: 'You must be logged in to twitch to create a clip' } as Data);
        return;
    }
    try {
        console.log('Attempting clip');
        const channelName = session?.user?.name;
        console.log(`access token ${session.accessToken ? 'found' : 'not found'}`);
        let token = session.accessToken || (process.env.TWITCH_OAUTH_TOKEN as string);
        // get broadcaster id
        let idBlob = await axios.get(`https://api.twitch.tv/helix/users?login=${channelName}`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Client-ID': process.env.TWITCH_CLIENT_ID as string
            }
        });
        let id = idBlob?.data?.data[0]?.id;
        console.log('ID: ' + id);

        //post to clip endpoint with oauth token from .env (POST https://api.twitch.tv/helix/clips)
        let clipBlob = await axios.post(`https://api.twitch.tv/helix/clips?broadcaster_id=${id}`, {}, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Client-ID': process.env.TWITCH_CLIENT_ID as string
            }
        });
        
        console.log('Clip response: ', clipBlob?.data);
        let clipURL = clipBlob?.data?.data?.[0]?.edit_url;
        let clipId = clipBlob?.data?.data?.[0]?.id;
        console.log('Clip URL: ' + clipURL);
        ampClient.logEvent({
            'event_type': 'clipthat_clip_made', 
            user_id: channelName || 'No Channel Found',
            event_properties: {
                url: clipURL
            }
        });

        console.log(`searching for clip at: https://api.twitch.tv/helix/clips?id=${clipId}`);

        let newClipDataBlob = await axios.get('https://api.twitch.tv/helix/clips?id=' + clipId, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Client-ID': process.env.TWITCH_CLIENT_ID as string
            }
        });
        console.log('New clip data: ', newClipDataBlob?.data);
        let newClipData = newClipDataBlob?.data?.data?.[0];
        let thumbnailUrl = newClipData?.thumbnail_url;
        let downloadUrl = thumbnailUrl.split('-preview-')[0] + '.mp4';

        res.status(200).json({ name: 'clip response', url: clipURL, src: downloadUrl } as Data);
    } catch (e: any) {
        console.log('Error: ', e);
        console.log('Error message: ', e?.response?.data?.message);
        res.status(500).json({ name: 'error', error: 'Internal Server Error', message: e?.response?.data?.message || e?.message || 'Failed to make a clip' } as Data);
    }
}
