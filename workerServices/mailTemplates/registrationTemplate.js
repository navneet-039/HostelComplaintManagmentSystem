export const registerStudentTemplate = (
  email,
  password,
  registrationNumber,
  hostel,
  room,
  resetLink
) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome Student</title>
  </head>

  <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; margin:auto; background:white; padding:20px; border-radius:8px;">
      <tr>
        <td align="center">
          <h2 style="color:#333;">Welcome to HostelSync</h2>
          <p style="color:#555; font-size:14px;">
            Your hostel account has been successfully created. Please find your login details below.
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding: 20px;">
          <h3 style="color:#444;">Your Login Details</h3>

          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
          <p><strong>Hostel:</strong> ${hostel}</p>
          <p><strong>Room Number:</strong> ${room}</p>
          <p><strong>Registration Number:</strong> ${registrationNumber}</p>

          <br />

          <a href="${resetLink}"
            style="
              display:inline-block;
              padding:12px 18px;
              background:#4CAF50;
              color:white;
              text-decoration:none;
              border-radius:5px;
              font-size:14px;">
            Click here to change your password
          </a>

          <br /><br />

          <p style="font-size:12px; color:#777;">
            If you did not request this account, please contact your warden immediately.
          </p>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding-top:20px; font-size:12px; color:#999;">
          © ${new Date().getFullYear()} HostelSync. All rights reserved.
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
