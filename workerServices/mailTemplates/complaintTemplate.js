export const complaintTemplate = (
  title,
  description,
  studentName,
  studentEmail
) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>New Hostel Complaint</title>
  </head>

  <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
    <table width="100%" cellspacing="0" cellpadding="0"
      style="max-width:600px; margin:auto; background:white; padding:20px; border-radius:8px;">

      <tr>
        <td align="center">
          <h2 style="color:#c0392b;">New Hostel Complaint</h2>
        </td>
      </tr>

      <tr>
        <td style="padding:20px;">
          <p><strong>Title:</strong> ${title}</p>

          <p><strong>Description:</strong></p>
          <p style="background:#f9f9f9; padding:12px; border-radius:5px; color:#444;">
            ${description}
          </p>

          <hr style="margin:20px 0;" />

          <p><strong>Student Name:</strong> ${studentName}</p>
          <p><strong>Student Email:</strong> ${studentEmail}</p>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding-top:20px; font-size:12px; color:#999;">
          © ${new Date().getFullYear()} HostelSync
        </td>
      </tr>

    </table>
  </body>
</html>`;
};
