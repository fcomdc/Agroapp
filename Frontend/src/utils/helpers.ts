// Funciones utilitarias para AgroApp
export const parseLocalDate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(
        Number(value.slice(0, 4)),
        Number(value.slice(5, 7)) - 1,
        Number(value.slice(8, 10))
      )
    : new Date(value);

export const isValidDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = parseLocalDate(value);
  return (
    date.getFullYear() === Number(value.slice(0, 4)) &&
    date.getMonth() + 1 === Number(value.slice(5, 7)) &&
    date.getDate() === Number(value.slice(8, 10))
  );
};

/**
 * Formatea una fecha para mostrar en formato DD/MM/YYYY
 * @param {string} dateString - Fecha en formato ISO o YYYY-MM-DD
 * @returns {string} Fecha formateada
 */
export const formatDate = (dateString?: string | null) => {
  if (!dateString) return "";
  try {
    const date = parseLocalDate(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};

/**
 * Formatea fecha y hora para mostrar en formato DD/MM/YYYY HH:mm
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Fecha y hora formateada
 */
export const formatDateTime = (dateString?: string | null) => {
  if (!dateString) return "";
  try {
    const date = parseLocalDate(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch {
    return dateString;
  }
};

/**
 * Calcula la edad a partir de la fecha de nacimiento
 * @param {string} birthDate - Fecha de nacimiento en formato ISO o YYYY-MM-DD
 * @returns {string} Edad en meses o años
 */
export const calculateAge = (birthDate?: string | null) => {
  if (!birthDate) return "";
  try {
    const birth = parseLocalDate(birthDate);
    const now = new Date();
    if (isNaN(birth.getTime())) return "";

    let months = (now.getFullYear() - birth.getFullYear()) * 12;
    months += now.getMonth() - birth.getMonth();

    if (now.getDate() < birth.getDate()) {
      months--;
    }

    if (months < 0) return "0 meses";
    if (months < 1) {
      const days = Math.floor(
        (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
      );
      return `${days} día${days !== 1 ? "s" : ""}`;
    }
    if (months < 12) {
      return `${months} mes${months !== 1 ? "es" : ""}`;
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (remainingMonths === 0) {
      return `${years} año${years !== 1 ? "s" : ""}`;
    }
    return `${years} año${years !== 1 ? "s" : ""} y ${remainingMonths} mes${remainingMonths !== 1 ? "es" : ""}`;
  } catch {
    return "";
  }
};

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 * @returns {string} Fecha actual
 */
export const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Obtiene la fecha y hora actual como cadena ISO
 * @returns {string} Fecha y hora actual en formato ISO
 */
export const getCurrentDateTime = () => {
  return new Date().toISOString();
};

export const calcularEdad = calculateAge;
export const formatearFecha = formatDate;
export const formatearFechaHora = formatDateTime;
export const formatDateToday = getCurrentDate;
