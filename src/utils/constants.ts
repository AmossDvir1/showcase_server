export const generateVerificationEmailBody = (
  username: string,
  otp: string
) => `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - Showcase</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f1f1f1;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h1 {
            text-align: center;
            color: #333;
        }

        p {
            color: #666;
        }

        .otp-container {
            text-align: center;
            margin-bottom: 20px;
        }

        .otp {
            display: inline-block;
            background-color: #7573C5;
            color: #fff;
            text-decoration: none;
            letter-spacing: 7px;
            padding: 10px 20px;
            border-radius: 4px;
			cursor:pointer;
			
        }
		
		.otp:hover {
            background-color: #8A88D8;
        }
		
		.copy-button {
            margin-left: 10px;
            padding: 8px 12px;
            background-color: #ccc;
            border: none;
            border-radius: 4px;
            cursor: pointer !important;
        }

        .footer {
            margin-top: 20px;
            text-align: center;
            color: #888;
        }
    </style>
    <script>
        function copyOTP() {
            const otpElement = document.getElementById("otp");
            const otp = otpElement.textContent;
            const textarea = document.createElement("textarea");
            textarea.value = otp;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
        }
    </script>
</head>

<body>
    <div class="container">
        <h1>Activate Your Account</h1>
        <p>Dear ${username},</p>
        <p>Thank you for signing up on Showcase! We are thrilled to have you as part of our community. To complete the verification process, please copy and paste the One-Time Password (OTP) provided below:</p>
		<div class="otp-container">
            <h2 class="otp" id="otp" onclick="copyOTP()">${otp}</h2>
        </div>
        
        <p>Once your account is verified, you will gain full access to all the features and functionalities of Showcase. You'll
            be able to enjoy a personalized experience, connect with other users, and make the most of our services.</p>
        <p>If you did not sign up for an account on Showcase, please disregard this email. It is possible that someone else
            entered your email address by mistake. No further action is required on your part.</p>

        <p>Thank you for choosing Showcase. We look forward to having you as an active member of our community!</p>
        <p class="footer">Best regards,<br>Showcase Team</p>
    </div>
</body>

</html>
`

export const emailSubject = "Activate Your Account - Email Verification for Showcase"