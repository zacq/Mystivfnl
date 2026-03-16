exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const token = process.env.AIRTABLE_TOKEN;
    const base  = process.env.AIRTABLE_BASE  || 'appIusIxCmha7lwTx';
    const table = process.env.AIRTABLE_TABLE || 'tblztDpDrbvOpkhYg';

    if (!token) {
        return { statusCode: 500, body: JSON.stringify({ error: 'AIRTABLE_TOKEN not configured' }) };
    }

    let body;
    try { body = JSON.parse(event.body); } catch {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    const res = await fetch(`https://api.airtable.com/v0/${base}/${table}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            records: [{
                fields: {
                    'Full Name':         body['Full Name']         || '',
                    'Phone Number':      body['Phone Number']      || '',
                    'Email Address':     body['Email Address']     || '',
                    'Vehicle':           body['Vehicle']           || '',
                    'Service Requested': body['Service Requested'] || '',
                    'Preferred Date':    body['Preferred Date']    || '',
                    'Preferred Time':    body['Preferred Time']    || '',
                    'Additional Notes':  body['Additional Notes']  || '',
                    'Submission Source': 'Booking Form',
                    'Status':            '🆕 New'
                }
            }]
        })
    });

    const result = await res.json();
    return {
        statusCode: res.ok ? 200 : res.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
    };
};
