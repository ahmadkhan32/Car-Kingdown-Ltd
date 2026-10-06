export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "");
export const fmtKm = (n) => (n == null ? "—" : `${Number(n).toLocaleString()} KM`);
