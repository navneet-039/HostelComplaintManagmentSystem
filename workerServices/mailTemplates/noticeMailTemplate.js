export const hostelNoticeEmailTemplate = ({
  title,
  description,
  hostelName,
  publishedByName,
  createdAt,
  expiryDate,
}) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>${title}</title>
  </head>

  <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
    <table
      width="100%"
      cellspacing="0"
      cellpadding="0"
      style="max-width:600px; margin:auto; background:white; padding:20px; border-radius:8px;"
    >
      <tr>
        <td align="center">
          <h2 style="color:#333;">📢 Hostel Notice</h2>
          <p style="color:#555; font-size:14px;">
            ${hostelName}
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding: 20px;">
          <h3 style="color:#444;">${title}</h3>

          <p style="color:#555; font-size:14px; line-height:1.6;">
            ${description}
          </p>

          <br />

          <p><strong>Published By:</strong> ${publishedByName}</p>
          <p><strong>Published On:</strong> ${new Date(createdAt).toDateString()}</p>

          ${
            expiryDate
              ? `<p><strong>Valid Till:</strong> ${new Date(expiryDate).toDateString()}</p>`
              : ""
          }

          <br />
          <p style="font-size:12px; color:#777;">
            Please ensure compliance with this notice. For any clarification,
            contact the hostel administration.
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
