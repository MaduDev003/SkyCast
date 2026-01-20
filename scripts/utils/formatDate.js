function formatDate(date) {
  const [_, month, day] = date.split("-");
  return `${day}/${month}`;
}

export {
    formatDate
}