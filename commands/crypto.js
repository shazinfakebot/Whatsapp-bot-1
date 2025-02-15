//jshint esversion:8
//Coded by Sumanjay (https://github.com/cyberboysumanjay)
const axios = require('axios');

async function getPrice(cryptoCode) {
    cryptoCode = cryptoCode.toUpperCase();
    let mainconfig = {
        method: 'get',
        url: 'https://public.coindcx.com/market_data/current_prices'
    };
    return axios(mainconfig)
        .then(async function (response) {
            let data = response.data;
            let cryptoCodeINR = cryptoCode + "INR";
            if (data[cryptoCode] != undefined || data[cryptoCodeINR] != undefined) {
                cryptoCode = data[cryptoCode] == undefined ? cryptoCodeINR : cryptoCode;
                let out = ({
                    name: cryptoCode,
                    price: data[cryptoCode]
                });
                return out;
            } else {
                return "unsupported";
            }
        })
        .catch(function (error) {
            return "error";
        });
}
const execute = async (client,msg,args) => {
    // msg.delete(true);
    let chat=await msg.getChat();
    let idk=chat.id._serialized;
    let data = await getPrice(args[0]);
    if (data == "error") {
        await client.sendMessage(idk, `🙇‍♂️ *Error*\n\n` + "```Something unexpected happened while fetching Cryptocurrency Price```");
    }
    if (data == "unsupported") {
        await client.sendMessage(idk, `🙇‍♂️ *Error*\n\n` + "```Support for this CryptoCurrency is not yet added```");
    }
    else {
        let date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        await client.sendMessage(idk, `Price of *${data.name}* as of ${date} is *₹ ${data.price}*`);
    }
};

module.exports = {
    name: 'Crypto Currency',
    description: 'Gets price info for requested crypto currency',
    command: '!crypto',
    commandType: 'plugin',
    isDependent: false,
    help: `*Crypto Currency*\n\nGet current price of cryptocurrency. \n\n*!crypto [crypto-code]*\n`,
    execute};