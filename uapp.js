var request = require('request');
var cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');
const { addToSheet } = require('./utils/addToSheet');
const { GOOGLE_SHEET_ID } = require('./config/config')
const date_service = require('./utils/date');

const NEWS = []

async function fireGoogleQuery(searchHost, searchQuery, restOftheUrl01, restOftheUrl02,start=0) {
    let url = `${searchHost}${searchQuery}${restOftheUrl01}&start=${start}${restOftheUrl02}`;
    
    request(url,function(err,res,body){
        console.log('body', body)
        var $ = cheerio.load(body);
        $('#main > div').each(async function (i) {
            const headline = $(this).find('.ZINbbc > .egMi0.kCrYT > a > h3 > div').text();
            const source = $(this).find('.ZINbbc > .egMi0.kCrYT > a > .BNeawe.UPmit.AP7Wnd').text();
            const timeDescription = $(this).find('.ZINbbc > .kCrYT > div > div > div > div').text();
            const URL = $(this).find('.ZINbbc > .egMi0.kCrYT > a').attr('href');
            const newsUrl = URL && URL.split('/url?q=')[1].split('&sa=')[0]
            const timeSting  = timeDescription && timeDescription.split(' � ')[0]
            const description = timeDescription.split(' � ')[1]
            if(headline && source && URL && timeDescription)
                NEWS.push([
                    uuidv4(),
                    headline,
                    source,
                    timeSting,
                    description,
                    newsUrl
                ])
        });
        if(start <= 10) {
            fireGoogleQuery(searchHost, searchQuery, restOftheUrl01, restOftheUrl02, start+10)
        }
    });

    console.log('NEWS', NEWS)
    // Add News Data
    addToSheet('Google Search News', NEWS, GOOGLE_SHEET_ID);
}

function loadApp() {
    let searchHost = 'https://www.google.com/search'
    let searchQuery = '?q="nanyang+business+school"'
    let restOftheUrl01 = '&tbs=sbd:1,cdr:1,cd_min:3/1/2021,cd_max:3/31/2022&tbm=nws&sxsrf=APq-WBvlEL640P2dBjmEszkNgTPnVNgmTw:1649605369797&ei=-fpSYoCoMLDC3LUPrs-twAY&'
    let restOftheUrl02 = '&sa=N&ved=2ahUKEwjAiNjw6on3AhUwIbcAHa5nC2gQ8tMDegQIARA9&biw=1440&bih=821&dpr=2'
    fireGoogleQuery(searchHost, searchQuery, restOftheUrl01, restOftheUrl02)
}

loadApp();
