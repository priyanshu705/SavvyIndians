// Configuration for Google Sheets Integration
export const GOOGLE_SHEETS_CONFIG = {
  // Replace this with your actual Google Apps Script Web App URL
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyvZTKBZR_9a5YiGdykuXzhIsoFWzhveOTNwFGvSQ47y36jXZXG7De8liZQrugAVNdiwg/exec',

  // Enable/disable Google Sheets integration
  ENABLED: true, // Set to true after setup

  // Fallback options
  FALLBACK_EMAIL: 'swapnilkumar2028@gmail.com',

  // Form configuration
  FORMS: {
    MASTERCLASS: 'Join Our Masterclasses',
    SERVICES: 'Get Service Details',
    JOURNEY: 'Start Your AI Journey',
    NEWSLETTER: 'Subscribe to Newsletter'
  }
};

// Utility function to submit form data
export async function submitToGoogleSheets(formData: {
  name: string;
  phone: string;
  email: string;
  formType: string;
  message?: string; // Optional message field
}) {
  if (!GOOGLE_SHEETS_CONFIG.ENABLED) {
    console.log('Google Sheets integration disabled. Form data:', formData);
    return { success: true, message: 'Form submitted successfully!' };
  }

  try {
    const response = await fetch(GOOGLE_SHEETS_CONFIG.SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        formType: formData.formType,
        message: formData.message || '', // Include message if provided
        timestamp: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        return { success: true, message: 'Form submitted successfully!' };
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Google Sheets submission error:', error);
    throw error;
  }
}