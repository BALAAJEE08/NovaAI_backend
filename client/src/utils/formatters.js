export const shortDate = (date) => date ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date)) : "-";
export const titleCase = (value = "") => value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
