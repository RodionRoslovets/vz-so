import { getParametersNumber, getParametersKits, getAverage } from "./generate";
import { getGradeNumbers } from "./grade";
import { grathDraw } from "./grathic";
import { setNullResaultError } from "./errno";
import { addObjectName } from "./common";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";

let resultTable, resultGradeExist, errnoField;

let resultTablePageNumber,
  itemNumberOnPage = 100,
  resultTableOpenPage = 1;

function setResultTable(parametersTable) {
  resultTable = parametersTable;
}

function setErrorField(errorField) {
  errnoField = errorField;
}

function clear(errnoField, parametersTable) {
  parametersTable.innerHTML = "";
  errnoField.innerHTML = "";
}

function addTableItem(parametersRow, itemValue, rowSettings = {}) {
  const parametersItem = document.createElement("td");
  parametersItem.innerHTML = itemValue;
  if (rowSettings.colspan)
    parametersItem.setAttribute("colspan", rowSettings.colspan);
  if (rowSettings.rowspan)
    parametersItem.setAttribute("rowspan", rowSettings.rowspan);
  if (rowSettings.style)
    parametersItem.setAttribute("style", rowSettings.style);

  parametersRow.append(parametersItem);
}

function setResultTablePageNumber(parametersKitsArray) {
  resultTablePageNumber = Math.ceil(
    parametersKitsArray.length / itemNumberOnPage
  );
}

function getParametersKitsOnThisPage() {
  const pageShiftParameter = itemNumberOnPage * (resultTableOpenPage - 1);
  return getParametersKits().slice(
    0 + pageShiftParameter,
    itemNumberOnPage + pageShiftParameter
  );
}

function paginationItemEventListenerOnClick(event) {
  const paginationItem = this;
  const paginationBlock = paginationItem.parentNode;
  paginationBlock.querySelectorAll(".open").forEach(function (element) {
    element.classList.remove("open");
  });
  resultTableOpenPage = paginationItem.value;

  clear(errnoField, resultTable);
  resultTableDraw(resultGradeExist);
}

function resultTableDraw(gradeExist) {
  const parametersKitsArray = getParametersKitsOnThisPage();
  const parametersNames = document.querySelectorAll(".number-names-list input");
  const objectsNames = document.querySelectorAll(".objects-names-list input");

  if (parametersKitsArray.length > 0) {
    const table = document.createElement("table");
    resultTable.append(table);

    // Создание шапки таблицы
    const tableHeader = document.createElement("thead");
    let headerRow = document.createElement("tr");

    addTableItem(headerRow, `№`, { rowspan: 2 });
    let gradeNumbers = getGradeNumbers();
    let parametersNumber = parametersKitsArray[0].length - gradeNumbers;
    const borderStyle = "1px solid #000";

    addTableItem(
      headerRow,
      `Значения рандомизированных весовых коэффициентов`,
      {
        colspan: parametersNumber,
      }
    );
    if (gradeExist) {
      addTableItem(headerRow, `Рейтинг объекта`, {
        colspan: gradeNumbers,
        style: `border-left: ${borderStyle};`,
      });
      headerRow.setAttribute("style", `border-top: ${borderStyle};`);
    }
    tableHeader.append(headerRow);
    headerRow = document.createElement("tr");

    for (let i = 1; i <= parametersNumber; i++) {
      addTableItem(
        headerRow,
        parametersNames[i - 1].value
          ? parametersNames[i - 1].value
          : `p<sub>${i}</sub>`
      );
    }
    if (gradeExist) {
      for (let i = 1; i <= gradeNumbers; i++) {
        let parameters =
          i == 1 ? { style: `border-left: ${borderStyle};` } : {};
        addTableItem(
          headerRow,
          objectsNames[i - 1].value
            ? objectsNames[i - 1].value
            : `O<sub>${i}</sub>`,
          parameters
        );
      }
    }
    tableHeader.append(headerRow);
    table.append(tableHeader);

    // Наполнение таблицы
    const tableBody = document.createElement("tbody");
    const itemNumberShift = itemNumberOnPage * (resultTableOpenPage - 1) + 1;
    parametersKitsArray.forEach((kit, num) => {
      const parametersRow = document.createElement("tr");
      addTableItem(parametersRow, itemNumberShift + num);
      kit.forEach((item, i) => {
        let parameters =
          i == parametersNumber
            ? { style: `border-left: ${borderStyle};` }
            : {};

        addTableItem(parametersRow, isNaN(item) ? 0 : item, parameters);
      });

      //add labels to objects
      const objectsCells = Array.from(
        parametersRow.querySelectorAll("td")
      ).slice(parametersNumber + 1);

      if (objectsCells.length > 0) {
        const sortedVals = objectsCells
          .map((cell) => parseFloat(cell.innerText))
          .sort((a, b) => b - a);

        objectsCells.map((cell) => {
          sortedVals.forEach((val, valInd) => {
            if (val === parseFloat(cell.innerText)) {
              cell.innerHTML =
                cell.innerText +
                `<span class="cell-label">${valInd + 1}</span>`;
            }
          });
        });
      }

      tableBody.append(parametersRow);
    });

    // Добавление средних значений в конец таблицы:
    // if (resultTableOpenPage == resultTablePageNumber) {
    const averageRow = document.createElement("tr");
    averageRow.classList.add("parameters-table__row");
    addTableItem(averageRow, "Среднее<br>значение");

    const average = getAverage();
    average.forEach((item, i) => {
      let parameters =
        i == parametersNumber ? { style: `border-left: ${borderStyle};` } : {};
      addTableItem(
        averageRow,
        i >= parametersNumber ? (item * 10).toFixed(1) : item,
        parameters
      );
    });

    tableBody.append(averageRow);
    // }

    table.append(tableBody);

    // Добавление пагинации
    const resultTableBlock = resultTable.parentNode;
    const paginationBlock = resultTableBlock.querySelector(
      ".js_result-table-pagination"
    );
    const paginationInfo = resultTableBlock.querySelector(".js_this-page-info");
    paginationBlock.innerHTML = "";
    paginationInfo.innerHTML = ``;
    let hasDots = false;

    if (resultTablePageNumber > 1) {
      //prev btn
      if (+resultTableOpenPage !== 1) {
        const prevBtn = document.createElement("button");
        prevBtn.classList.add("result-table__pagination-item");
        prevBtn.value = +resultTableOpenPage - 1;
        prevBtn.innerHTML = "<";
        prevBtn.addEventListener("click", paginationItemEventListenerOnClick);
        paginationBlock.append(prevBtn);
      }

      for (let i = 0; i < resultTablePageNumber; i++) {
        if (resultTablePageNumber > 6) {
          if (
            +resultTableOpenPage === i + 1 &&
            +resultTableOpenPage > 3 &&
            +resultTableOpenPage <= resultTablePageNumber - 3
          ) {
            //prev page
            if (+resultTableOpenPage !== 4) {
              const prevItem = document.createElement("button");
              prevItem.classList.add("result-table__pagination-item");

              prevItem.value = i;
              prevItem.innerHTML = prevItem.value;
              paginationBlock.append(prevItem);

              prevItem.addEventListener(
                "click",
                paginationItemEventListenerOnClick
              );
            }

            //current page
            const paginationItem = document.createElement("button");
            paginationItem.classList.add("result-table__pagination-item");

            if (+resultTableOpenPage === i + 1) {
              paginationItem.classList.add("open");
            }

            paginationItem.value = i + 1;
            paginationItem.innerHTML = paginationItem.value;
            paginationBlock.append(paginationItem);

            paginationItem.addEventListener(
              "click",
              paginationItemEventListenerOnClick
            );

            //next page
            if (+resultTableOpenPage !== resultTablePageNumber - 3) {
              const nextItem = document.createElement("button");
              nextItem.classList.add("result-table__pagination-item");

              nextItem.value = i + 2;
              nextItem.innerHTML = nextItem.value;
              paginationBlock.append(nextItem);

              nextItem.addEventListener(
                "click",
                paginationItemEventListenerOnClick
              );

              //dots end
              if (
                +resultTableOpenPage !== resultTablePageNumber - 4 &&
                i !== resultTablePageNumber - 4
              ) {
                const dots = document.createElement("div");
                dots.classList.add("result-table__pagination-dots");

                dots.innerHTML = "...";
                paginationBlock.append(dots);
              }
            }

            continue;
          }

          if (i >= 3 && i < resultTablePageNumber - 3) {
            if (
              !hasDots &&
              +resultTableOpenPage !== 4 &&
              +resultTableOpenPage !== 5
            ) {
              const paginationItem = document.createElement("div");
              paginationItem.classList.add("result-table__pagination-dots");

              paginationItem.innerHTML = "...";
              paginationBlock.append(paginationItem);

              hasDots = true;
            }

            continue;
          }
        }

        const paginationItem = document.createElement("button");
        paginationItem.classList.add("result-table__pagination-item");

        if (+resultTableOpenPage === i + 1) {
          paginationItem.classList.add("open");
        }

        paginationItem.value = i + 1;
        paginationItem.innerHTML = paginationItem.value;
        paginationBlock.append(paginationItem);

        paginationItem.addEventListener(
          "click",
          paginationItemEventListenerOnClick
        );
      }
      paginationInfo.innerHTML = `Текущая страница ${resultTableOpenPage} из ${resultTablePageNumber}`;
    }

    //next btn
    if (+resultTableOpenPage !== resultTablePageNumber) {
      const nextBtn = document.createElement("button");
      nextBtn.classList.add("result-table__pagination-item");
      nextBtn.value = +resultTableOpenPage + 1;
      nextBtn.innerHTML = ">";
      nextBtn.addEventListener("click", paginationItemEventListenerOnClick);
      paginationBlock.append(nextBtn);
    }
  }
}

function addGradePDraw() {
  let numGrade = getGradeNumbers(),
    parametersKits = getParametersKits(),
    shift = getParametersNumber(),
    arrLength = parametersKits.length;

  if (numGrade > 1) {
    // Создание матрицы из количества элементов
    let resultMatrix = Array.from({ length: numGrade }, (_, i) =>
      Array.from({ length: numGrade }, (_, j) => {
        if (i == j) return 0;
        if (i < j)
          return (
            Math.round(
              (1 -
                parametersKits.filter(
                  (value, index) =>
                    value[shift + j] > parametersKits[index][shift + i]
                ).length /
                  arrLength) *
                100
            ) / 100
          );
        return (
          Math.round(
            (parametersKits.filter(
              (value, index) =>
                value[shift + i] > parametersKits[index][shift + j]
            ).length /
              arrLength) *
              100
          ) / 100
        );
      })
    );

    // Выводим результат в таблице
    const table = document.createElement("table");
    const tableBlock = document.querySelector(".js_result-grade-p-table");
    tableBlock.innerHTML = "";
    // tableBlock.append(`
    // Таблица стохастического доминирования оценок —
    // Вероятность, что оценка набора строки больше оценки набора столбца`);
    tableBlock.append(table);
    document
      .querySelector('[data-menu-name="grade-p"]')
      .classList.remove("hide");

    // Создание шапки таблицы
    const tableHeader = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const objectsNames = document.querySelectorAll(".objects-names-list input");

    addTableItem(headerRow, `№`);
    for (let i = 1; i <= resultMatrix.length; i++) {
      addTableItem(
        headerRow,
        objectsNames[i - 1].value
          ? objectsNames[i - 1].value
          : `O<sub>${i}</sub>`
      );
    }
    tableHeader.append(headerRow);
    table.append(tableHeader);

    // Наполнение таблицы
    const tableBody = document.createElement("tbody");
    resultMatrix.forEach((kit, num) => {
      const row = document.createElement("tr");
      addTableItem(
        row,
        objectsNames[num].value
          ? objectsNames[num].value
          : `O<sub>${num + 1}</sub>`
      );
      kit.forEach((item, i) => {
        addTableItem(row, item);
      });

      tableBody.append(row);
    });
    table.append(tableBody);
  } else {
    document.querySelector('[data-menu-name="grade-p"]').classList.add("hide");
  }
}

function setResultNumber() {
  const numberKits = getParametersKits().length;
  document
    .querySelectorAll(".js_parametrs-kits-end-number")
    .forEach((element) => {
      element.innerHTML = numberKits ? numberKits : "-";
    });
}

function resultAdd(gradeExist) {
  if (getParametersKits().length) {
    // Вывод таблицы
    setResultTablePageNumber(getParametersKits());
    resultTableOpenPage = 1;
    resultTableDraw((resultGradeExist = gradeExist));
    document.querySelector(".js_result-block").classList.add("active");

    // Таблица вероятности оценок
    addGradePDraw();

    //Вывод графиков
    grathDraw();

    // Подготовка файла на скачивание
    // downloadButtonPrepare();
    downloadHandler();
  } else {
    setNullResaultError();
  }
  setResultNumber();
}

function generateBegin() {
  document.body.classList.add("calculate");
  document.querySelector(".js_result-block").classList.remove("active");
}

function generateEnd() {
  document.body.classList.remove("calculate");
}

function addGradeTableHeaderItem(headerRow, itemName) {
  const headerItem = document.createElement("td");
  headerItem.classList.add("parameters-grade-table__header-item");
  headerItem.classList.add("parameters-grade-table__item");
  headerItem.innerHTML = itemName;
  headerRow.append(headerItem);
}

function addGradeTableItem(parametersRow, text = 0) {
  const parametersItem = document.createElement("td");
  parametersItem.classList.add("parameters-grade-table__item");
  let parametersItemInput;

  if (text) {
    parametersItemInput = document.createElement("div");
    parametersItemInput.classList.add("parameters-grade-table__input");
    parametersItemInput.classList.add("parameters-grade-table__input--text");
    parametersItemInput.innerHTML = text;
  } else {
    parametersItemInput = document.createElement("input");
    //parametersItemInput.setAttribute('type', 'number');
    parametersItemInput.classList.add("parameters-grade-table__input");
    parametersItemInput.classList.add("js_parameters-grade-table-item-input");
  }

  parametersItem.append(parametersItemInput);

  parametersRow.append(parametersItem);
}

function createGradeInputTable(parametersNumber) {
  const table = document.createElement("table");
  table.classList.add("parameters-grade-table");

  // Создание шапки таблицы
  const tableHeader = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.classList.add("parameters-grade-table__header-row");

  const oldTable = document.querySelector(
    ".js_parametrs-grade-input .js-parameters-grade-table-block table tbody"
  );
  let oldTableRowsNumber = oldTable
    ? oldTable.querySelectorAll("tr:last-child td").length
    : 2;

  addGradeTableHeaderItem(headerRow, `№`);
  for (let i = 1; i < oldTableRowsNumber; i++) {
    addGradeTableHeaderItem(headerRow, `O<sub>${i}</sub>`);
  }
  tableHeader.append(headerRow);
  table.append(tableHeader);

  // Наполнение таблицы
  const tableBody = document.createElement("tbody");
  for (let n = 1; n <= parametersNumber; n++) {
    const parametersRow = document.createElement("tr");
    parametersRow.classList.add("parameters-grade-table__row");
    parametersRow.classList.add("js_parameters-grade-table-row");

    addGradeTableItem(parametersRow, `X<sub>${n}</sub>`);
    for (let i = 1; i < oldTableRowsNumber; i++) {
      addGradeTableItem(parametersRow);
    }

    tableBody.append(parametersRow);
  }

  table.append(tableBody);

  const objectsNamesList = document.querySelector(".objects-names-list");

  if (objectsNamesList.children.length === 0) addObjectName(0);

  return table;
}

function parametrsGradeInputRemoveKit(element) {
  const gradeTable = element
    .closest(".js_parametrs-grade-input")
    .querySelector(".js-parameters-grade-table-block");
  const tableLastRows = gradeTable.querySelectorAll("tr td:last-child");
  if (tableLastRows.length > 1) {
    tableLastRows.forEach((element) => element.parentNode.removeChild(element));
  }
}

function parametrsGradeInputAddKit(element, parametersNumber) {
  const gradeTable = element
    .closest(".js_parametrs-grade-input")
    .querySelector(".js-parameters-grade-table-block");
  const tableHead = gradeTable.querySelector("thead");
  tableHead.querySelectorAll("tr").forEach((tableRow) => {
    addGradeTableHeaderItem(
      tableRow,
      `O<sub>${tableRow.querySelectorAll("td").length}</sub>`
    );
  });
  const tableBody = gradeTable.querySelector("tbody");
  tableBody.querySelectorAll("tr").forEach((tableRow) => {
    addGradeTableItem(tableRow);
  });
}

function downloadButtonPrepare() {
  const anchor = document.querySelector(".js_result-download");

  // Download json | No need
  // let data = JSON.stringify(getParametersKits(), null, '\t');

  // anchor.href = `data:text/json;charset=utf-8,${encodeURIComponent(data)}`;
  // anchor.download = 'data.json';

  // Dounload csv | Need
  let data = [...getParametersKits()];
  let dataHeader = new Array(data[0].length).fill().map(function (item, i) {
    if (i < getParametersNumber()) {
      return `p${i + 1}`;
    }
    if (i < getParametersNumber() + getGradeNumbers()) {
      return `O${i + 1 - getParametersNumber()}`;
    }
    return `undefined`;
  });
  data.unshift(dataHeader);
  data = data
    .map((e) => e.join(";"))
    .join("\n")
    .replaceAll(".", ",");

  anchor.href = `data:text/csv;charset=utf-8,${encodeURIComponent(data)}`;
  anchor.download = "data.csv";
}

const exportStat = async () => {
  const results = [...getParametersKits()];
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const extention = ".xlsx";
  const numNames = document.querySelectorAll(".number-names-list input");
  const objNames = document.querySelectorAll(".objects-names-list input");
  const btn = document.querySelector(".js_result-download");

  btn.classList.add("js_result-download--active");

  setTimeout(() => {
    try {
      const date = new Date();
      const name = `Weights_Export_${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}__${date.getHours()}-${date.getMinutes()}`;

      let keys = [];

      numNames?.forEach((item, index) => {
        if (item.value) {
          keys.push(item.value);
        } else {
          keys.push(`P${index + 1}`);
        }
      });
      objNames?.forEach((item, index) => {
        if (item.value) {
          keys.push(item.value);
        } else {
          keys.push(`O${index + 1}`);
        }
      });

      if (keys.length !== results[0].length) {
        keys = keys.slice(0, results[0].length);
      }

      const exportData = results.map((item) => {
        const obj = {};
        keys.forEach((key, index) => {
          obj[key] = item[index];
        });

        return obj;
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const exelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
      });
      const fileData = new Blob([exelBuffer], { type: fileType });
      FileSaver.saveAs(fileData, name + extention);
    } catch (e) {
      console.log(e);
    } finally {
      btn.classList.remove("js_result-download--active");
    }
  }, 1000);
};

const downloadHandler = () => {
  const btn = document.querySelector(".js_result-download");

  if (btn) {
    btn.addEventListener("click", exportStat);
  }
};

export {
  clear,
  resultAdd,
  generateBegin,
  generateEnd,
  setResultTable,
  setErrorField,
  createGradeInputTable,
  parametrsGradeInputRemoveKit,
  parametrsGradeInputAddKit,
  downloadHandler,
};
