// ../email/emailTemplate.js
export const PAYMENT_SUCCESS = (name, courseTitle, paymentDetails) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Successful - EduBraining</title>
        <style>
            /* Base Styles */
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f7f9fc;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
            }
            .header {
                background-color: #4a6bdf;
                padding: 20px;
                text-align: center;
                color: white;
            }
            .header img {
                max-height: 60px;
            }
            .content {
                padding: 30px;
            }
            .footer {
                background-color: #f2f4f8;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
            }
            h1 {
                color: #4a6bdf;
                margin-top: 0;
            }
            .button {
                display: inline-block;
                background-color: #4a6bdf;
                color: white;
                text-decoration: none;
                padding: 12px 25px;
                border-radius: 4px;
                font-weight: bold;
                margin: 20px 0;
            }
            .steps {
                background-color: #f7f9fc;
                padding: 15px;
                border-radius: 4px;
                margin: 15px 0;
            }
            .steps li {
                margin-bottom: 10px;
            }
            .social-links {
                margin-top: 15px;
            }
            .social-links a {
                display: inline-block;
                margin: 0 10px;
            }
            .payment-details {
                background-color: #f7f9fc;
                padding: 15px;
                border-radius: 4px;
                margin: 20px 0;
            }
            .payment-details p {
                margin: 5px 0;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <img src="https://edubraining.com/logo.png" alt="EduBraining Logo">
                <h2>Payment Successful, ${name}!</h2>
            </div>
            <div class="content">
                <h1>🎉 Welcome to ${courseTitle}!</h1>
                <p>Hi ${name},</p>
                <p>Thank you for your purchase of <strong>${courseTitle}</strong> at Edubrain. Your payment has been successfully processed and you're now enrolled in the course!</p>
                
                <div class="payment-details">
                    <h3>Payment Details:</h3>
                    <p><strong>Transaction ID:</strong> ${paymentDetails.id}</p>
                    <p><strong>Amount:</strong> ${paymentDetails.amount / 100} ${paymentDetails.currency}</p>
                    <p><strong>Payment Method:</strong> ${paymentDetails.method}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                
                <h2>Here's how to access your course:</h2>
                <ol class="steps">
                    <li><strong>Login:</strong> Head over to <a href="https://edubraining.com/login">Edubraining.com</a> and log in to your account.</li>
                    <li><strong>Access Your Dashboard:</strong> Once logged in, you'll be taken to your personal dashboard where you'll find all your enrolled courses.</li>
                    <li><strong>Start Learning:</strong> Click on "${courseTitle}" to begin your learning journey immediately.</li>
                </ol>
                
                <h2>What to expect:</h2>
                <p>• Engaging video lectures from industry experts</p>
                <p>• Practical exercises and projects</p>
                <p>• Community support and discussion forums</p>
                
                <p>If you have any questions or need assistance, our support team is here to help. Reach out to us at <a href="mailto:support@edubraining.com">support@edubraining.com</a>.</p>
                
                <div style="text-align: center; margin-top: 30px;">
                    <a href="https://edubraining.com/dashboard" class="button">Go to My Dashboard</a>
                </div>
                
                <p>Get ready to unlock your potential!</p>
                <p>Happy learning!</p>
                <p>The EduBraining Team</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} EduBraining. All rights reserved.</p>
                <p>You're receiving this email because you made a purchase at EduBraining.com</p>
                <div class="social-links">
                    <a href="https://facebook.com/edubraining">Facebook</a> | 
                    <a href="https://twitter.com/edubraining">Twitter</a> | 
                    <a href="https://instagram.com/edubraining">Instagram</a> | 
                    <a href="https://linkedin.com/company/edubraining">LinkedIn</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  };