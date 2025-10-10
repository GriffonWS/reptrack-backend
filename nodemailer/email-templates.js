export const DetailsEmailTemplate = (verificationToken, name) => {
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
				        }
				        .password {
				            font-weight: bold;
				            color: #007bff;
				        }
				        .unique-id {
				            font-weight: bold;
				            color: #28a745;
				        }
				        .subscription {
				            font-weight: bold;
				            color: #dc3545;
				        }
				        .date {
				            font-weight: bold;
				            color: #6c757d;
				        }
				    </style>
				</head>
				<body>
				    <div class="container">
				        <h2>Your Account Details</h2>
				        <p class="details">Your account has been successfully created. Below are your login credentials:</p>
				        <p class="details">Unique ID: <span class="unique-id">%s</span></p>
				        <p class="details">Password: <span class="password">%s</span></p>
				        <p class="details">Subscription Type: <span class="subscription">%s</span></p>
				        <p class="details">Registration Date: <span class="date">%s</span></p>
				         <p class="details">You can Login at: <span class="password">%s</span></p>
				    </div>
				</body>
				</html>
  `;
};
