const convertToVietnameseDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  // Manually extract the components
  const dayName = new Intl.DateTimeFormat('vi-VN', { weekday: 'long' }).format(date);
  const day = date.getDate();
  const month = new Intl.DateTimeFormat('vi-VN', { month: 'long' }).format(date);
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  // Return the custom formatted string without "lúc"
  return `${dayName}, ${day} ${month}, ${year}, ${hours}:${minutes}:${seconds}`;
};

export default convertToVietnameseDateTime;
