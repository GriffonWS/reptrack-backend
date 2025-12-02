export const invitationEmailTemplate = (userName, uniqueId, setupLink, tokenExpiry) => {
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

