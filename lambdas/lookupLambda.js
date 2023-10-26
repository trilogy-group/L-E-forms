import { findRowInSheet } from '../handlers/googleSheetsHandler.js';

export const handler = async (event) => {
    const { ParentEmail, StudentEmail } = event.queryStringParameters;
    const row = await findRowInSheet(ParentEmail, StudentEmail);
    if (row) {
        return {
            statusCode: 200,
            body: JSON.stringify(row)
        };
    } else {
        return {
            statusCode: 404,
            body: 'Not found'
        };
    }
};
