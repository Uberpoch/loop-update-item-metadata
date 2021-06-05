const axios = require('axios');
const fs = require('fs');


const clientID = '';
const secretKey = '';
// let tokenType = '';

// const desinationStream = 7106516;
// const destHub = 63867;
// const outputFile = 'unqork';
// const toppage = 15;
const ogItems = require('./source.js');



const auth = async (key, secret) => {
    return axios.post('https://v2.api.uberflip.com/authorize', {
        grant_type:	'client_credentials',
        client_id: key,
        client_secret: secret
    })
    .catch(function (error) {
        console.log(error);
        })
    .then(function (response) {
        // tokenType = response.data.token_type;
        const token = response.data.access_token;
        // console.log(token);
        return token;
    });

}
const publish = async (token,data) => {
    axios.post(`https://v2.api.uberflip.com/items/${data.item}/publish`, {
        published_at: data.pubDate
    },{
        headers: {
            'Authorization': `Bearer ${token}`,
            'User_Agent': `Nathan UF`
        }
    })
    .catch(err => {
        console.log(err);
    })
    .then(res => {
        let data = res;
        // console.log(data);
        console.log(`published: ${data.request.path} ${data.status}`);
    })
}

const call = async (token, item) => {

    return axios.patch(`https://v2.api.uberflip.com/items/${item.item_id}`, {
        "hide_publish_date": false
        },{
            headers: { 
                'Authorization': `Bearer ${token}`,
                'User_Agent': `Nathan UF`
            }
        })
        .catch(error => {
            console.log(error);
            })
        .then(res => {
            let data = res.data;
            // console.log(data);
            let pubdata = {
                item: data.id,
                pubDate: data.published_at
            }
            return pubdata;
    });   

}

const loop = async (token, array) => {
    array.forEach(async(item) => {
        const oneCall = await call(token, item);
        await publish(token, oneCall);
    })

}


const run = async () => {
    const token = await auth(clientID, secretKey);
    const runLoop = await loop(token, ogItems);
    console.log('run complete');

};
run();