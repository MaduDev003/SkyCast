function formatDate(date) {
  const [_, month, day] = date.split("-");
  return `${day}/${month}`;
}
function formatTime(time) {
  const hour = time.includes("T")
    ? time.split("T")[1].split(":")[0]
    : time.split(":")[0];

  return `${hour}:00`;
}

function getCurrentTime(timeZone) { 
  return new Date().toLocaleTimeString("pt-BR", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit"
  });
}


export {
    formatTime,
    formatDate,
    getCurrentTime
}