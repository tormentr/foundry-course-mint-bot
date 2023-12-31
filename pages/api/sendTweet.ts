import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosRequestConfig } from 'axios';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const consumerKey = process.env.TWITTER_CONSUMER_KEY || '';
    const consumerSecret = process.env.TWITTER_CONSUMER_SECRET || '';
    const accessToken = process.env.TWITTER_ACCESS_TOKEN || '';
    const tokenSecret = process.env.TWITTER_TOKEN_SECRET || '';
    const BIG_FAT_SECRET = process.env.BIG_FAT_SECRET || ''
    const authToken = req.headers.authorization?.split(' ')[1];

    const { twitterHandle } = JSON.parse(req.body);

     const serverToken = crypto.createHmac('sha256', BIG_FAT_SECRET).update(twitterHandle).digest('hex');
     if(authToken !== serverToken) {
       res.status(403).json({ error: 'Invalid token' });
       return;
     }

    const oauth = new OAuth({
        consumer: { key: consumerKey, secret: consumerSecret },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            return crypto
                .createHmac('sha1', key)
                .update(base_string)
                .digest('base64');
        },
    });

    const request_data = {
        url: 'https://api.twitter.com/2/tweets',
        method: 'POST'
    };

    try {
        const response = await axios({
            url: request_data.url,
            method: request_data.method,
            data: {text: `🎉Congrats ${twitterHandle}🎉  You've solved the Ultimate, Learn Blockchain Development, Solidity, AI-Powered Smart Contract Course | Foundry Edition Challenge!!  Check out the course by @PatrickAlphaC https://youtu.be/umepbfKp5rI`},
            headers: oauth.toHeader(oauth.authorize(request_data, { key: accessToken, secret: tokenSecret })),
        } as AxiosRequestConfig);

        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error.response.status).json(error.response.data);
    }
}
