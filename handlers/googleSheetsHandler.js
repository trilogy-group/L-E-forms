import { google } from 'googleapis';

const sheets = google.sheets('v4');
const SPREADSHEET_ID = '1Yp4U0r5OytxNaSXuHdB9JTjIoVSySiLsuU4hKMJtVpk';
const SHEET_NAME = "Sheet1";
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');

// Authenticate and set up the Google Sheets API client.
const auth = new google.auth.JWT(
    CLIENT_EMAIL,
    null,
    PRIVATE_KEY,
    ['https://www.googleapis.com/auth/spreadsheets']
);


export const findRowInSheet = async (ParentEmail, StudentEmail) => {
    try {
        const response = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A2:C`, 
        });

        const rows = response.data.values;

        if (!rows || rows.length === 0) {
            return null;
        }

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            
            const studentEmailInRow = row[0];
            const parentEmailInRow = row[2];

            // If both values are provided
            if (StudentEmail && ParentEmail) {
                if (studentEmailInRow === StudentEmail && parentEmailInRow === ParentEmail) {
                    return formatRow(row);
                }
            } 
            // If only StudentEmail is provided
            else if (StudentEmail) {
                if (studentEmailInRow === StudentEmail && parentEmailInRow) {
                    return formatRow(row);
                }
            } 
            // If only ParentEmail is provided
            else if (ParentEmail) {
                if (parentEmailInRow === ParentEmail && studentEmailInRow) {
                    return formatRow(row);
                }
            }
        }
    
        return null;

    } catch (error) {
        console.error('Error accessing Google Sheets:', error);
        throw error;
    }
};

function formatRow(row) {
    return {
        'Student Email': row[0],
        'Parent Name': row[1],
        'Parent Email': row[2]
    };
}