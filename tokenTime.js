// Converts a token number + a doctor's consultation start time into a
// human-readable arrival time, e.g. token 3 starting at 09:00 with a
// 10-minute slot -> "9:20 AM".
function tokenToArrivalTime(token, startTime, slotMinutes = 10) {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const totalMinutes = startHour * 60 + startMin + (token - 1) * slotMinutes;
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const ampm = h24 < 12 ? "AM" : "PM";
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

module.exports = { tokenToArrivalTime };
