document.addEventListener("DOMContentLoaded", () => {
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const calculateButton = document.getElementById("calculateBtn");
  const resultDiv = document.getElementById("result");

  calculateButton.addEventListener("click", () => {
    console.log("Calculating date difference...");
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    let months = 0;
    let years = 0;
    let vacations = 0;
    let resultMessage = "";
    resultDiv.textContent = ""; // Clear previous result

    if (isNaN(startDate) || isNaN(endDate)) {
      resultMessage = "Ambas fechas deben ser llenadas";
      return;
    } else if (startDate > endDate) {
      resultMessage =
        "La fecha de inicio no puede ser posterior a la fecha de fin";
      return;
    } else if (startDate.toDateString() === endDate.toDateString()) {
      resultMessage = "Las fechas son iguales";
      return;
    } else {
      let days = calcularDiasEntreFechas(startDate, endDate);
      if (days >= 365) {
        years = Math.floor(days / 365);
        console.log(`Años completos: ${years}`);
        if (days % 365 === 0) {
          resultPrint(`te corresponden ${years * 15} días de vacaciones.`);
          return;
        }
        startDate.setFullYear(startDate.getFullYear() + years);
      }
      days = calcularDiasEntreFechas(startDate, endDate);
      if (days >= 30) {
        months = Math.floor(days / 30);
        console.log(`Meses completos: ${months}`);
        if (days % 30 === 0) {
          vacations = Math.floor(months * 1.25);
          resultPrint(`te corresponden ${vacations} días de vacaciones.`);
          return;
        }
        startDate.setMonth(startDate.getMonth() + months);
      } else {
        resultPrint("No tienes derecho a vacaciones.");
        return;
      }
      let remainingDays = calcularDiasEntreFechas(startDate, endDate);
      console.log(`Días restantes: ${remainingDays}`);

      if (years > 0) {
        vacations = years * 15 + months * 1.25 + (remainingDays / 30) * 1.25;
      } else {
        vacations = months * 1.25 + (remainingDays / 30) * 1.25;
      }
      resultPrint(
        `${years} años, ${Math.floor(
          months
        )} meses y ${remainingDays} dias por lo cual te corresponden ${vacations.toFixed(
          2
        )} días de vacaciones.`
      );
    }
  });

  const resultPrint = (message) => {
    resultDiv.textContent = message;
    resultDiv.style.display = "block";
  };
});

function calcularDiasEntreFechas(startDate, endDate) {
  // Clonar las fechas y ponerlas al inicio del día para evitar problemas con la hora
  // Esto es crucial para obtener el número de días "completos" entre fechas
  const date1 = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const date2 = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );

  // Calcular la diferencia en milisegundos
  const diferenciaMilisegundos = Math.abs(date2.getTime() - date1.getTime());

  // Convertir milisegundos a días
  // 1 día = 24 horas * 60 minutos * 60 segundos * 1000 milisegundos
  const milisegundosPorDia = 1000 * 60 * 60 * 24;

  const dias = Math.ceil(diferenciaMilisegundos / milisegundosPorDia);

  return dias;
}
