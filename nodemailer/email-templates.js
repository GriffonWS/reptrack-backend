export const invitationEmailTemplate = (
  userName,
  uniqueId,
  setupLink,
  tokenExpiry
) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .details {
            font-size: 16px;
            color: #333333;
            line-height: 1.6;
        }
        .unique-id {
            font-weight: bold;
            color: #28a745;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .expiry-warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 10px;
            margin: 15px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Welcome to RepTrack!</h2>
        <p class="details">Hi <strong>${userName}</strong>,</p>
        <p class="details">Your account has been created. Complete your setup by setting your password:</p>

        <p class="details">Your Unique ID: <span class="unique-id">${uniqueId}</span></p>

        <center>
            <a href="${setupLink}" class="button">Set Password & Login</a>
        </center>

        <p class="details">Or copy and paste this link into your browser or RepTrack app:</p>
        <p style="word-break: break-all; color: #007bff; font-size: 14px;">${setupLink}</p>

        <div class="expiry-warning">
            <strong>⏰ This link expires in ${tokenExpiry} hours.</strong> Please complete your setup before then.
        </div>

        <p class="details">If you have any questions, contact your gym administrator.</p>
    </div>
</body>
</html>
  `;
};

export const welcomeEmailTemplate = (
  userName,
  uniqueId,
  email,
  password,
  androidLink,
  iosLink
) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .details {
            font-size: 16px;
            color: #333333;
            line-height: 1.6;
        }
        .credential-box {
            background-color: #f8f9fa;
            border-left: 4px solid #007bff;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .unique-id {
            font-weight: bold;
            color: #28a745;
            font-size: 16px;
        }
        .email-text {
            font-weight: bold;
            color: #007bff;
        }
        .password-text {
            font-weight: bold;
            color: #dc3545;
            font-size: 18px;
        }
        .app-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 20px 0;
        }
        .app-button {
            display: inline-block;
            background-color: #28a745;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            font-size: 14px;
            margin-right: 4px;
        }
        .app-button:hover {
            background-color: #218838;
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 10px;
            margin: 15px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Welcome to RepTrack!</h2>
        <p class="details">Hi <strong>${userName}</strong>,</p>
        <p class="details">Your gym membership account has been successfully created! Here are your login credentials:</p>

        <div class="credential-box">
            <p class="details">Unique ID: <span class="unique-id">${uniqueId}</span></p>
            <p class="details">Email: <span class="email-text">${email}</span></p>
            <p class="details">Password: <span class="password-text">${password}</span></p>
        </div>

        <div class="warning">
            <strong>🔒 Important:</strong> Please change your password after your first login for security purposes.
        </div>

        <h3>Download the RepTrack App:</h3>
        <div class="app-links" style="text-align: center;">
            <a href="${androidLink}" class="app-button">Download for Android</a>
            <a href="${iosLink}" class="app-button">Download for iOS</a>
        </div>

        <p class="details">If you have any questions or need assistance, please contact your gym administrator.</p>

        <p class="details" style="margin-top: 30px; font-size: 14px; color: #666;">
            <strong>Note:</strong> This is an automated email. Please do not reply to this message.
        </p>
    </div>
</body>
</html>
  `;
};

export const forgotPasswordEmailTemplate = (userName, uniqueId, email, tempPassword) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .details {
            font-size: 16px;
            line-height: 1.6;
            color: #333;
        }
        .credential-box {
            background-color: #f8f9fa;
            border-left: 4px solid #007bff;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .unique-id {
            font-weight: bold;
            color: #28a745;
            font-size: 16px;
        }
        .email-text {
            font-weight: bold;
            color: #007bff;
            font-size: 16px;
        }
        .password-text {
            font-weight: bold;
            color: #dc3545;
            font-size: 18px;
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 10px;
            margin: 15px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset Request</h2>
        <p class="details">Hi <strong>${userName}</strong>,</p>
        <p class="details">You requested to reset your password. Here is your temporary password:</p>

        <div class="credential-box">
            <p class="details">Unique ID: <span class="unique-id">${uniqueId}</span></p>
            <p class="details">Email: <span class="email-text">${email}</span></p>
            <p class="details">Temporary Password: <span class="password-text">${tempPassword}</span></p>
        </div>

        <div class="warning">
            <strong>🔒 Important:</strong> Please change your password immediately after logging in for security purposes.
        </div>

        <p class="details">If you didn't request this password reset, please contact your gym administrator immediately.</p>

        <p class="details" style="margin-top: 30px; font-size: 14px; color: #666;">
            <strong>Note:</strong> This is an automated email. Please do not reply to this message.
        </p>
    </div>
</body>
</html>
  `;
};
