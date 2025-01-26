const {
  Chart,
  registerables,
} = require("/node_modules/chart.js/dist/chart.js");
Chart.register(...registerables);

import {
  getParametersNumber,
  getParametersKits,
  getAverage,
  getParameterKitSumm,
  getParameterStep,
} from "./generate";
import { isGradeExist, getGradeNumbers } from "./grade";

const DOWNLOAD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>`;

const donloadHandler = (btn) => {
  var link = document.createElement("a");
  const srcCanvas = btn.previousElementSibling;

  const destinationCanvas = document.createElement("canvas");
  destinationCanvas.width = srcCanvas.width;
  destinationCanvas.height = srcCanvas.height;

  const destCtx = destinationCanvas.getContext("2d");

  //create a rectangle with the desired color
  destCtx.fillStyle = "#FFFFFF";
  destCtx.fillRect(0, 0, srcCanvas.width, srcCanvas.height);

  //draw the original canvas onto the destination canvas
  destCtx.drawImage(srcCanvas, 0, 0);

  link.download = btn.dataset.name;
  link.href = destinationCanvas.toDataURL();
  link.click();
};

function grathDraw() {
  let parametersKits = getParametersKits(),
    gradeNumbers = getGradeNumbers(),
    parametersNumber = getParametersNumber(),
    parameterKitSumm = getParameterKitSumm(),
    parameterStep = getParameterStep(),
    grathStep = 0.05;

  grathStep = grathStep < parameterStep ? grathStep : parameterStep;

  const grathBlock = document.querySelector(".js_result-graths");
  grathBlock.innerHTML = "";

  const parametersAverage = getAverage();

  // если количество параметров в графиках больше 64, ничего не рисуем
  if (parametersNumber < 64) {
    const parametersGrathBlock = document.createElement("div"),
      gradesGrathBlock = document.createElement("div");

    let labels, datasets, values, valuesNumber;

    // parameters kits grathic
    grathBlock.append(parametersGrathBlock);
    parametersGrathBlock.append(`Графики весовых коэффициентов`);

    valuesNumber = Math.round((parameterKitSumm / grathStep) * 100) / 100;
    values = new Array(valuesNumber).fill().map(function (item, i) {
      return Math.round((parameterKitSumm - grathStep * i) * 100) / 100;
    });

    values.sort((a, b) => a - b);

    labels = new Array(valuesNumber).fill().map(function (item, i) {
      return `${values[i]}`;
    });
    datasets = new Array(parametersNumber).fill().map(function (item, i) {
      const parametersGrathWrapper = document.createElement("div");
      parametersGrathWrapper.classList.add("parameters-grath-wrapper");
      const parametersGrathBtn = document.createElement("button");
      parametersGrathBtn.classList.add("parameters-grath-btn");
      parametersGrathBtn.innerHTML = DOWNLOAD_SVG;
      parametersGrathBtn.dataset.name = `Grath p${i + 1}`;
      const parametersGrath = document.createElement("canvas");
      parametersGrathBtn.addEventListener("click", () => {
        donloadHandler(parametersGrathBtn);
      });
      parametersGrathWrapper.append(parametersGrath);
      parametersGrathWrapper.append(parametersGrathBtn);

      parametersGrathBlock.append(parametersGrathWrapper);

      return new Chart(parametersGrath, {
        data: {
          labels: labels,
          datasets: [
            {
              type: "bar",
              label: `Показатель X${i + 1}`,
              data: new Array(values.length).fill().map(function (item, k) {
                return parametersKits.reduce(function (currentSum, currentKit) {
                  return currentKit[i] == values[k] ? ++currentSum : currentSum;
                }, 0);
              }),
            },
          ],
        },
        options: {
          backgroundColor: "rgb(160, 34, 255)",
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });

    labels = new Array(parametersNumber).fill().map(function (item, i) {
      return `p${i + 1}`;
    });

    const parametersGrathWrapper = document.createElement("div");
    parametersGrathWrapper.classList.add("parameters-grath-wrapper");
    const parametersGrathBtn = document.createElement("button");
    parametersGrathBtn.classList.add("parameters-grath-btn");
    parametersGrathBtn.innerHTML = DOWNLOAD_SVG;

    parametersGrathBtn.dataset.name = `График изменения значений весовых коэффициентов для показателей в наборах`;
    parametersGrathBtn.addEventListener("click", () => {
      donloadHandler(parametersGrathBtn);
    });

    let parametersGrath = document.createElement("canvas");
    parametersGrathWrapper.append(parametersGrath);
    parametersGrathWrapper.append(parametersGrathBtn);
    parametersGrathBlock.append(parametersGrathWrapper);

    datasets = new Chart(parametersGrath, {
      type: "bar",
      data: {
        labels: labels.map((_, ind) => `X${ind + 1}`),
        datasets: [
          {
            type: "bar",
            label: `значений весовых коэффициентов для показателей в наборах`,
            data: labels.map(function (item, k) {
              return [
                Math.max(...parametersKits.map((innerArray) => innerArray[k])),
                Math.min(...parametersKits.map((innerArray) => innerArray[k])),
              ];
            }),
          },
        ],
      },
      options: {
        backgroundColor: "rgb(160, 34, 255)",
        barThickness: 40,
        scales: {
          y: {
            min: 0,
            max: parameterKitSumm,
            beginAtZero: true,
            ticks: {
              stepSize: 0.05,
            },
          },
        },
      },
    });

    // grades grathic
    if (isGradeExist() && gradeNumbers > 1 && gradeNumbers < 64) {
      grathBlock.append(gradesGrathBlock);
      gradesGrathBlock.append(`Графики изменения рейтинговых оценок`);

      valuesNumber = Math.round((parameterKitSumm / grathStep) * 100) / 100;
      values = new Array(valuesNumber).fill().map(function (item, i) {
        return Math.round((parameterKitSumm - grathStep * i) * 100) / 100;
      });

      values.sort((a, b) => a - b);

      labels = new Array(valuesNumber).fill().map(function (item, i) {
        return `${values[i]}`;
      });

      for (let i = 0; gradeNumbers > i; i++) {
        const gradesGrathWrapper = document.createElement("div");
        gradesGrathWrapper.classList.add("parameters-grath-wrapper");
        const gradesGrathBtn = document.createElement("button");
        gradesGrathBtn.classList.add("parameters-grath-btn");
        gradesGrathBtn.innerHTML = DOWNLOAD_SVG;
        gradesGrathBtn.dataset.name = `Grath Q${i + 1}`;
        gradesGrathBtn.addEventListener("click", () => {
          donloadHandler(gradesGrathBtn);
        });
        const gradesGrath = document.createElement("canvas");
        gradesGrathWrapper.appendChild(gradesGrath);
        gradesGrathWrapper.appendChild(gradesGrathBtn);

        gradesGrathBlock.append(gradesGrathWrapper);
        new Chart(gradesGrath, {
          data: {
            labels: labels,
            datasets: [
              {
                type: "bar",
                label: `Оценка Q${i + 1}`,
                data: new Array(values.length).fill().map(function (item, k) {
                  return parametersKits.reduce(function (
                    currentSum,
                    currentKit
                  ) {
                    return currentKit[parametersNumber + i] <= values[k] &&
                      currentKit[parametersNumber + i] > values[k] - grathStep
                      ? ++currentSum
                      : currentSum;
                  },
                  0);
                }),
              },
            ],
          },
          options: {
            backgroundColor: "rgb(160, 34, 255)",
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }

      labels = new Array(gradeNumbers).fill().map(function (item, i) {
        return `Q${i + 1}`;
      });

      const gradesGrathWrapper = document.createElement("div");
      gradesGrathWrapper.classList.add("parameters-grath-wrapper");
      const gradesGrathBtn = document.createElement("button");
      gradesGrathBtn.classList.add("parameters-grath-btn");
      gradesGrathBtn.innerHTML = DOWNLOAD_SVG;
      gradesGrathBtn.dataset.name = `Соотношение максимальных и минимальных значений оценок в наборах`;
      gradesGrathBtn.addEventListener("click", () => {
        donloadHandler(gradesGrathBtn);
      });
      const gradesGrath = document.createElement("canvas");
      gradesGrathWrapper.appendChild(gradesGrath);
      gradesGrathWrapper.appendChild(gradesGrathBtn);
      gradesGrathBlock.appendChild(gradesGrathWrapper);

      new Chart(gradesGrath, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              type: "bar",
              label: `Соотношение максимальных и минимальных значений оценок в наборах`,
              data: labels.map(function (item, k) {
                return [
                  Math.max(
                    ...parametersKits.map(
                      (innerArray) => innerArray[parametersNumber + k]
                    )
                  ),
                  Math.min(
                    ...parametersKits.map(
                      (innerArray) => innerArray[parametersNumber + k]
                    )
                  ),
                ];
              }),
            },
          ],
        },
        options: {
          backgroundColor: "rgb(160, 34, 255)",
          barThickness: 40,
          scales: {
            y: {
              min: 0,
              max: parameterKitSumm,
              beginAtZero: true,
              ticks: {
                stepSize: 0.05,
              },
            },
          },
        },
      });
    }
  }
}

export { grathDraw };
