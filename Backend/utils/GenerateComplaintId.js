export const generateComplaintId = (complaint) => {
  const date = new Date(complaint.date);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const unique = complaint._id.toString().slice(-4).toUpperCase();

  return `CMP-${year}-${month}-${day}-${unique}`;
};
