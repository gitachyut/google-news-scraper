const { google } = require('googleapis');
const sheets = google.sheets('v4');

const authentication = require("../google-sheet/auth");
const random = _ =>  Math.floor(100000 + Math.random() * 9000000);

const addNewTab = (sheetName, spreadsheetId) =>  new Promise(async(resolve, reject) => {
    const auth =  await authentication.authenticate();
    const sheetId = random();
    const request = {
          auth: auth,
          "spreadsheetId": spreadsheetId,
          "resource": {
              "requests": [
                  {
                      "addSheet": {
                          "properties": {
                              "sheetId": sheetId,
                              "title": sheetName,
                              "index": 2,
                              "rightToLeft": false
                          }
                      }
                  }
              ]
          }
      };
  
      sheets.spreadsheets.batchUpdate(request, (err, response) => {
          if (err) {
            console.log('err addSheet => ', err);
            reject(err);
          } else {
            resolve(sheetId);
          }
      });

})

const addToSheet =  (sheetName , values, spreadsheetId) => new Promise(async (resolve, reject) => {
    const auth =  await authentication.authenticate();
    const resource = {
        values,
      };
      sheets.spreadsheets.values.append({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: `${sheetName}!A:A`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource,
      }, (err, result) => {
        if (err) {
            console.log(err)
            reject(err);
        } else {
            resolve(result); 
        }
    });
}) 


const appendData =  (sheetName, values, spreadsheetId) => new Promise(async (resolve, reject) => {
    const auth =  await authentication.authenticate();
    const resource = {
        values,
      };
      sheets.spreadsheets.values.update({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'USER_ENTERED',
        resource,
      }, (err, result) => {
        if (err) {
          // Handle error
            console.log('err appendData => ', err)
            reject(err);
        } else {
            resolve(result);
            
        }
    });
}) 

// addToSheet('Dev Test -009',[[1,2,43], [23,4,4]],GOOGLE_SHEET_ID)
// addNewTab("test 002", GOOGLE_SHEET_ID)

module.exports = {
    addNewTab,
    addToSheet,
    appendData
}
