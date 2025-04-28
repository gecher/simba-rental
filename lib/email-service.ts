// Email service utility for Simba Rental
// This is a simplified implementation that logs emails to console in development
// In production, this would connect to a real email service like SendGrid, Mailgun, etc.

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

interface BookingDetails {
  bookingId: string;
  propertyTitle: string;
  propertyLocation: string;
  totalAmount: number;
  paymentMethod: string;
  date: string;
  slots: string[];
  isRecurringBooking?: boolean;
  recurringDates?: string[];
}

/**
 * Sends an email (simulated in development, would use real service in production)
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // In a real application, this would call an email service API
    // For now, we'll just log the email details to the console
    console.log('SENDING EMAIL:');
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('HTML Content:', options.html);
    
    // Simulate a successful email send
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

/**
 * Generates the HTML content for a booking confirmation email
 */
export function generateBookingConfirmationEmail(
  userEmail: string,
  bookingDetails: BookingDetails
): string {
  const { 
    bookingId, 
    propertyTitle, 
    propertyLocation, 
    totalAmount, 
    paymentMethod,
    date,
    slots,
    isRecurringBooking,
    recurringDates
  } = bookingDetails;
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedSlots = slots.join(', ');
  
  let datesSection = '';
  if (isRecurringBooking && recurringDates && recurringDates.length > 0) {
    const formattedDates = recurringDates.map(d => 
      new Date(d).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    ).join('<br>');
    
    datesSection = `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">Dates:</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${formattedDates}</td>
      </tr>
    `;
  } else {
    datesSection = `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">Date:</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${formattedDate}</td>
      </tr>
    `;
  }
  
  let paymentNote = '';
  if (paymentMethod === 'cash') {
    paymentNote = `
      <p style="color: #e67e22; font-weight: bold; margin-top: 20px;">
        IMPORTANT: Please bring the exact amount of $${totalAmount.toFixed(2)} in cash when you arrive at the property.
      </p>
    `;
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmation - Simba Rental</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #4f46e5;
        }
        .booking-details {
          background-color: #f9fafb;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          text-align: left;
          padding: 10px;
          border-bottom: 2px solid #e5e7eb;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #6b7280;
        }
        .button {
          display: inline-block;
          background-color: #4f46e5;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">SIMBA RENTAL</div>
        <h1>Booking Confirmation</h1>
      </div>
      
      <p>Dear Valued Customer,</p>
      
      <p>Thank you for choosing Simba Rental! Your booking has been confirmed. Below are the details of your reservation:</p>
      
      <div class="booking-details">
        <table>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">Booking ID:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${bookingId}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">Property:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${propertyTitle}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">Location:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${propertyLocation}</td>
          </tr>
          ${datesSection}
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">Time Slots:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${formattedSlots}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">Payment Method:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${paymentMethod}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">Total Amount:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">$${totalAmount.toFixed(2)}</td>
          </tr>
        </table>
      </div>
      
      ${paymentNote}
      
      <p>If you have any questions or need to make changes to your booking, please contact our customer service team.</p>
      
      <div style="text-align: center;">
        <a href="https://simbarental.com/account" class="button">View Booking Details</a>
      </div>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} Simba Rental. All rights reserved.</p>
        <p>This email was sent to ${userEmail}</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Sends a booking confirmation email
 */
export async function sendBookingConfirmationEmail(
  userEmail: string,
  bookingDetails: BookingDetails
): Promise<boolean> {
  const emailHtml = generateBookingConfirmationEmail(userEmail, bookingDetails);
  
  return sendEmail({
    to: userEmail,
    subject: `Booking Confirmation - ${bookingDetails.propertyTitle}`,
    html: emailHtml
  });
} 