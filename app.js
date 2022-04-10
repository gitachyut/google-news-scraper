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
        var $ = cheerio.load(body);
        $('#main > div').each(async function (i) {
            const headline = $(this).find('.ZINbbc > .egMi0.kCrYT > a > h3 > div').text();
            const source = $(this).find('.ZINbbc > .egMi0.kCrYT > a > .BNeawe.UPmit.AP7Wnd').text();
            const timeDescription = $(this).find('.ZINbbc > .kCrYT > div > div > div > div').text();
            const URL = $(this).find('.ZINbbc > .egMi0.kCrYT > a').attr('href');
            const newsUrl = URL && URL.split('/url?q=')[1].split('&sa=')[0]
            const timeSting  = timeDescription.split(' � ')[0]
            const time = timeSting && await date_service(timeSting);
            const description = timeDescription.split(' � ')[1]
            if(headline && source && URL)
                NEWS.push([
                    uuidv4(),
                    headline,
                    source,
                    time.date_time,
                    time.date,
                    description,
                    newsUrl
                ])
        });
        if(start <= 50) {
            fireGoogleQuery(searchHost, searchQuery, restOftheUrl01, restOftheUrl02, start+10)
        }
    });

    // console.log('NEWS', NEWS)
    // Add News Data
    addToSheet('Dev Test', NEWS, GOOGLE_SHEET_ID);
}

function loadApp() {
    let searchHost = 'https://www.google.com/search'
    let searchQuery = '?q=site:straitstimes.com+AND+"nanyang+business+school"'
    let restOftheUrl01 = '&tbm=nws&sxsrf=APq-WBtpd_2OCGQePEJaJhquWW5Z1F0wPw:1649596050086&ei=ktZSYrfnBMyOseMP4NKZgAQ'
    let restOftheUrl02 = '&sa=N&ved=2ahUKEwi3-NmUyIn3AhVMR2wGHWBpBkAQ8tMDegQIARA-&biw=1440&bih=821&dpr=2'
    fireGoogleQuery(searchHost, searchQuery, restOftheUrl01, restOftheUrl02)
}

loadApp();