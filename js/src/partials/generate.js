import * as frontend from "./frontend";
import * as error from "./errno";

import { filter, setFilterParameters, setFiltersToField } from "./filter";
import { isGradeExist, setGradeValues, addGrade } from "./grade";

let parametersNumber = 3,
  parameterKitSumm = 1,
  parameterStep = 0.2,
  parameterDecimalPlaces,
  parameterDecimalCount,
  parametersKitsGenerateNumber;

let parametersKitsArray = [],
  parametersKitsArrayGeneratePull = [],
  average = [];

const DecimalPlacesNumber = (x) =>
  x.toString().includes(".") ? x.toString().split(".").pop().length : 0;

function getParametersNumber() {
  return Number(parametersNumber);
}

function getParameterKitSumm() {
  return Number(parameterKitSumm);
}

function getParameterStep() {
  return Number(parameterStep);
}

function setParametersNumber(number) {
  parametersNumber = number;
  return parametersNumber;
}

function addAverage() {
  if (parametersKitsArray[0]) {
    average = new Array(parametersKitsArray[0].length).fill(0);
    let allParam = parametersKitsArray;
    let allParamLength = allParam.length;
    allParam.forEach((kit, num) => {
      kit.forEach((item, i) => {
        average[i] += item;
      });
    });
    average = average.map((item, i) => {
      return Math.round((item / allParamLength) * 100) / 100;
    });
  }

  console.log("addAverage parametersKitsArray", parametersKitsArray);
  console.log("addAverage average", average);
}

function getAverage() {
  return average;
}

function decimalPlacesCount() {
  let DecimalPlaces = DecimalPlacesNumber(parameterStep);
  if (DecimalPlaces < DecimalPlacesNumber(parameterKitSumm)) {
    DecimalPlaces = DecimalPlacesNumber(parameterKitSumm);
  }
  return DecimalPlaces;
}

function toInteger() {
  parameterDecimalPlaces = decimalPlacesCount();
  parameterDecimalCount = 10 ** parameterDecimalPlaces;
  console.log("toInteger parameterDecimalCount", parameterDecimalCount);

  parameterKitSumm *= parameterDecimalCount;
  console.log("toInteger parameterKitSumm", parameterKitSumm);
  parameterStep *= parameterDecimalCount;
}

function toDouble(parametersKit) {
  return parametersKit.map((item) => {
    return Math.round((item / parameterDecimalCount) * 100) / 100;
  });
}

function parametersKitsGenerateSettings(settingsForm) {
  // set data from filters block to hidden input
  setFiltersToField();
  console.log("старт расчетов");

  // parameters to generate parameters kit
  parametersNumber = settingsForm.querySelector(
    ".js_parametrs-number-input"
  ).value;
  parameterStep = settingsForm.querySelector(".js_parametrs-step-input").value;
  parametersKitsGenerateNumber = parameterKitSumm / parameterStep;
  if (!Number.isInteger(parametersKitsGenerateNumber)) {
    error.stepError(parameterKitSumm);
    return false;
  }

  // parameters to filter parameters kit
  if (
    !setFilterParameters(
      settingsForm.querySelector(".js_parametrs-filter-input").value
    )
  ) {
    error.setFilterParametersError();
    return false;
  }

  // parameters to calculete grade of parameters kit
  if (
    !setGradeValues(
      settingsForm.querySelector(".js_parametrs-grade-input"),
      parametersNumber
    )
  ) {
    error.setGradeValuesError();
    return false;
  }

  return true;
}

function kitIsNotExist(parametersKit) {
  for (let j = parametersKitsArrayGeneratePull.length - 1; j >= 0; j--) {
    // с конца пула генерации проверяем
    const kit = parametersKitsArrayGeneratePull[j].slice(0);
    if (kit[0] != parametersKit[0]) return true; // если кончились элементы вычесленные в этой итерации цикла генерации
    let kitElemIsExist = 1;
    for (let i = 1; i < kit.length; i++) {
      if (kit[i] == parametersKit[i]) {
        kitElemIsExist++;
      }
    }
    if (kitElemIsExist == kit.length) return false;
  }
  return true;
}

function parametersKitArrayAdd(parametersKit) {
  let kitArray = parametersKit.slice(0);
  if (kitIsNotExist(kitArray)) {
    parametersKitsArrayGeneratePull.push(kitArray);

    // Фильтрация конечных значений
    if (filter(kitArray)) {
      //Добавление оценки
      if (isGradeExist()) kitArray = addGrade(kitArray);

      // Приведение набора к вещественному типу данных
      kitArray = toDouble(kitArray);

      // Добавление результата в результирующий массив
      parametersKitsArray.push(kitArray);
    }
  }
}

function parametersKitArrayPrepareClear(parametersKit) {
  (parametersKitsArray = []), (parametersKitsArrayGeneratePull = []);

  parametersKitArrayAdd(parametersKit);
}

function parametersKitArrayPrepareBefore(parametersKit, i) {
  const KitArray = parametersKit.slice(0);
  KitArray[0] -= parameterStep;
  KitArray[i] += parameterStep;
  return KitArray;
}

function parametersKitArrayPrepareAfter(parametersKit, i) {
  const KitArray = parametersKit.slice(0);
  KitArray[0] += parameterStep;
  KitArray[i] -= parameterStep;
  return KitArray;
}

function parametersKitsArrayPrepareToGenerate() {
  toInteger();
  const kitArray = [];
  for (let i = 0; i < parametersNumber; i++) {
    kitArray[i] = 0;
  }
  kitArray[0] = parameterKitSumm;

  parametersKitArrayPrepareClear(kitArray);
}

function parametersKitsArrayGenerateAfter() {
  parameterKitSumm /= parameterDecimalCount;
  parameterStep /= parameterDecimalCount;

  // Принудительное очищение памяти, что бы точно очистелась на этом моменте.
  parametersKitsArrayGeneratePull = [];

  // Подсчёт средних значений
  addAverage();

  // Вывод результата
  frontend.resultAdd(isGradeExist());
}

function parametersKitsArrayGenerate() {
  parametersKitsArrayPrepareToGenerate();

  console.log("parametersKitsGenerateNumber", parametersKitsGenerateNumber);
  for (let j = 0; j < parametersKitsGenerateNumber; j++) {
    console.log(`проход генерации: ${j + 1} из ${parametersKitsGenerateNumber}, 
		количество элементов массива генерации на этом этапе: ${
      parametersKitsArrayGeneratePull.length
    }`);
    const parametersKitsArrayGeneratePullLength =
      parametersKitsArrayGeneratePull.length;
    console.log(
      "parametersKitsArrayGeneratePullLength",
      parametersKitsArrayGeneratePullLength
    );
    console.log(
      "parametersKitsArrayGeneratePull",
      parametersKitsArrayGeneratePull
    );

    for (let p = 0; p < parametersKitsArrayGeneratePullLength; p++) {
      let KitArray = parametersKitsArrayGeneratePull.shift();
      console.log("KitArray", KitArray);
      if (KitArray[0] <= 0) continue;
      for (let i = 1; i < KitArray.length; i++) {
        KitArray = parametersKitArrayPrepareBefore(KitArray, i);
        console.log("after parametersKitArrayPrepareBefore", KitArray);

        parametersKitArrayAdd(KitArray);
        console.log("after parametersKitArrayAdd ", KitArray);
        KitArray = parametersKitArrayPrepareAfter(KitArray, i);
        console.log("after parametersKitArrayPrepareAfter ", KitArray);
      }
    }
  }

  parametersKitsArrayGenerateAfter();
}

async function submitToGenerate(settingsForm, errorField, parametersTable) {
  frontend.clear(errorField, parametersTable);
  frontend.setResultTable(parametersTable);
  frontend.setErrorField(errorField);
  error.setErrorField(errorField);
  const start = performance.mark("начало");

  if (parametersKitsGenerateSettings(settingsForm)) {
    frontend.generateBegin();
    parametersKitsArrayGenerate();
    frontend.generateEnd();
  }

  const finish = performance.mark("конец");

  performance.measure("итого", "начало", "конец");
  console.log(performance.getEntriesByName("итого")[0].duration);
  performance.clearMeasures();
  performance.clearMarks();
}

function getParametersKits() {
  return parametersKitsArray;
}

export {
  getParametersNumber,
  setParametersNumber,
  submitToGenerate,
  getParametersKits,
  getAverage,
  getParameterKitSumm,
  getParameterStep,
};
