export const formatDateTime = (dateTimeString: string) => {
  if (!dateTimeString) return "";

  if (dateTimeString.includes("T")) {
    return dateTimeString;
  }

  const [datePart, timePart] = dateTimeString.split(" ");
  const [year, month, day] = datePart.split("-");
  const [hours, minutes] = timePart.split(":");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export const formatForInput = (dateTimeString: string) => {
  if (!dateTimeString) return "";

  return dateTimeString.replace(" ", "T").substring(0, 16);
};
