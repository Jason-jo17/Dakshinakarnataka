import emailjs from '@emailjs/browser';

// These should be set in your .env file
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'default_public_key';
const TEMPLATE_ID_VERIFY = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_VERIFY || 'template_verify';
const TEMPLATE_ID_SURVEY = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_SURVEY || 'template_survey';

export const emailService = {
  /**
   * Sends a verification email once the user clicks "Verify Information"
   */
  sendVerificationEmail: async (userEmail: string, userName: string) => {
    try {
      const templateParams = {
        to_email: userEmail,
        user_name: userName,
        message: 'Your company information has been verified successfully on the DK District platform.'
      };

      const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID_VERIFY, templateParams, PUBLIC_KEY);
      console.log('Verification email sent successfully:', response.status, response.text);
      return response;
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw error;
    }
  },

  /**
   * Sends a survey completion email once the survey is submitted
   */
  sendSurveyCompletionEmail: async (userEmail: string, companyName: string) => {
    try {
      const templateParams = {
        to_email: userEmail,
        company_name: companyName,
        message: `Your survey for ${companyName} has been submitted successfully. Thank you for your contribution.`
      };

      const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID_SURVEY, templateParams, PUBLIC_KEY);
      console.log('Survey completion email sent successfully:', response.status, response.text);
      return response;
    } catch (error) {
      console.error('Failed to send survey completion email:', error);
      throw error;
    }
  },

  /**
   * Sends a delegation email with credentials
   */
  sendDelegationEmail: async (toEmail: string, companyName: string, credentials: any) => {
    try {
      const templateParams = {
        to_email: toEmail,
        company_name: companyName,
        username: credentials.username,
        password: credentials.password_hash || 'Welcome@2024', // Fallback if hash hidden
        message: `You have been invited to fill the survey for ${companyName}. Please login with these credentials.`
      };

      // Reuse verify template or a new one - using verify for now as a fallback
      const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID_VERIFY, templateParams, PUBLIC_KEY);
      console.log('Delegation email sent:', response.status);
      return response;
    } catch (error) {
      console.error('Failed to send delegation email:', error);
      throw error;
    }
  }
};
