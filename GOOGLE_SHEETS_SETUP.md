   - A1: **Name**
   - B1: **Phone**
   - C1: **Email**
   - D1: **Form Type**
   - E1: **Timestamp**

## Step 2: Create Google Apps Script
1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete existing code and paste this:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Get form data
    const name = e.parameter.name || '';
    const phone = e.parameter.phone || '';
    const email = e.parameter.email || '';
    const formType = e.parameter.formType || '';
    const message = e.parameter.message || '';
    const timestamp = e.parameter.timestamp || new Date().toISOString();
    
    // Add data to sheet
    sheet.appendRow([name, phone, email, formType, message, timestamp]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return doPost(e);
}
```

## Step 3: Deploy the Script
1. Click **Deploy > New deployment**
2. Choose type: **Web app**
3. Set execute as: **Me**
4. Set access: **Anyone**
5. Click **Deploy**
6. Copy the **Web app URL**

## Step 4: Update Your Website
1. Open `src/app/page.tsx`
2. Find this line: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`
3. Replace `YOUR_SCRIPT_ID` with your actual script URL

## Step 5: Test the Integration
1. Submit a form on your website
2. Check your Google Sheet
3. Data should appear automatically!

## Optional: Email Notifications
Add this to your Apps Script for email alerts:

```javascript
// Add this inside doPost function after sheet.appendRow()
MailApp.sendEmail({
  to: 'your-email@gmail.com',
  subject: 'New Form Submission - SavvyIndians',
  body: `
    New form submission received:
    
    Name: ${name}
    Phone: ${phone}
    Email: ${email}
    Form Type: ${formType}
    Message: ${message}
    Time: ${timestamp}
  `
});
```

## Security Notes
- Never share your script URL publicly
- Consider adding basic validation
- Monitor usage to prevent spam

## Troubleshooting
- Check Apps Script execution logs for errors
- Ensure sheet permissions are correct
- Test with simple data first