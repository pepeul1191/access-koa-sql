// app/config/helpers.js

export const formatDate = (date) => {
  if (!date) return null;

  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Formato: dd/mm/aaaa - hh:MM:ss AM/PM
export const formatDateTime = (date) => {
  if (!date) return null;

  const d = new Date(date);

  // Fecha
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  // Hora 12h
  let hours = d.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours; // 0 → 12
  const strHours = String(hours).padStart(2, '0');

  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} - ${strHours}:${minutes}:${seconds} ${ampm}`;
};