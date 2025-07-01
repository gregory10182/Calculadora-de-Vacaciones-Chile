document.addEventListener("DOMContentLoaded", () => {
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const calculateButton = document.getElementById("calculateBtn");
  const resultDiv = document.getElementById("result");
  const restarDiasUsadosInput = document.getElementById("usedVacations");

  calculateButton.addEventListener("click", () => {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    const diasUsados = parseInt(restarDiasUsadosInput.value, 10) || 0;
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
        if (days % 365 === 0) {
          vacations = years * 15;
          vacations = restarDiasUsados(diasUsados, vacations);
          if (vacations >= 0) {
            resultPrint(`Tienes ${vacations} días de vacaciones.`);
          }
          return;
        }
        startDate.setFullYear(startDate.getFullYear() + years);
      }
      days = calcularDiasEntreFechas(startDate, endDate);
      if (days >= 30) {
        months = Math.floor(days / 30);
        if (days % 30 === 0) {
          vacations = Math.floor(months * 1.25);
          vacations = restarDiasUsados(diasUsados, vacations);
          if (vacations >= 0) {
            resultPrint(`Te corresponden ${vacations} días de vacaciones.`);
          }
          return;
        }
        startDate.setMonth(startDate.getMonth() + months);
      }
      let remainingDays = calcularDiasEntreFechas(startDate, endDate);

      if (years > 0) {
        vacations = years * 15 + months * 1.25 + (remainingDays / 30) * 1.25;
      } else {
        vacations = months * 1.25 + (remainingDays / 30) * 1.25;
      }
      vacations = restarDiasUsados(diasUsados, vacations);
      if (vacations >= 0) {
        resultPrint(
          `${years} años, ${Math.floor(
            months
          )} meses y ${remainingDays} dias por lo cual te corresponden ${vacations.toFixed(
            2
          )} días de vacaciones.`
        );
      }
    }
  });
  const resultPrint = (message) => {
    resultDiv.textContent = message;
    resultDiv.style.display = "block";
  };

  const calcularDiasEntreFechas = (startDate, endDate) => {
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
  };

  const restarDiasUsados = (diasUsados, diasTotales) => {
    if (diasUsados < 0 || diasTotales < 0) {
      resultPrint("Los días usados y totales deben ser números positivos.");
      return -1;
    } else if (diasUsados > diasTotales) {
      resultPrint(
        "Los días usados no pueden ser mayores que los días totales."
      );
      return -1;
    } else {
      const diasRestantes = diasTotales - diasUsados;
      return diasRestantes;
    }
  };
});
