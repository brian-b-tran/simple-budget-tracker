export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const dateFormatted = new Intl.DateTimeFormat('en-US').format(date);
  return dateFormatted;
}

export function formatTime(timeString: string): string {
  const time = new Date(timeString);
  const timeFormatted = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  }).format(time);
  return timeFormatted;
}
