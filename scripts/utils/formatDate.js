function formatDate(date) {
  const [_, month, day] = date.split("-");
  return `${day}/${month}`;
}

function getCurrentTime() {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, '0');
    return `${hour}:00`;

}

export {
    formatDate,
    getCurrentTime
}