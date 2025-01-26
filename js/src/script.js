"use strict";

import {
  getParametersNumber,
  setParametersNumber,
  submitToGenerate,
  getParametersKits,
} from "./partials/generate";

import {
  createGradeInputTable,
  parametrsGradeInputRemoveKit,
  parametrsGradeInputAddKit,
} from "./partials/frontend";

import { setGradeValues } from "./partials/grade";

import {
  commonDescriptionMobile,
  filtersBtns,
  inputBtnsNumberControl,
  numberNamesHandler,
  objectsNamesBtnsHandler,
} from "./partials/common";

const changeLoaderState = async () => {
  const btn = document.querySelector(".submit");

  if (btn) {
    if (btn.classList.contains("submit--active")) {
      btn.classList.remove("submit--active");
    } else {
      btn.classList.add("submit--active");
    }
  }
};

const settingsForm = document.querySelector(".js_parameters-form");

const parametersTable = document.querySelector(".js_parameters-table");
const errorField = document.querySelector(".js_errno-field");

settingsForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  changeLoaderState();
  setTimeout(() => {
    submitToGenerate(this, errorField, parametersTable);
    changeLoaderState();
  }, 1000);
});

function partialFactorial(n, k = 1) {
  if (k > n) {
    throw new Error("k должно быть меньше или равно n");
  }

  let result = 1;
  for (let i = n; i > k; i--) {
    result *= i;
  }

  return result;
}

function parametrsNumberKitsNumberGet() {
  const paramNumber = document.querySelector(
    ".js_parametrs-number-input"
  ).value;
  const paramStep = document.querySelector(".js_parametrs-step-input").value;

  if (paramNumber && paramStep) {
    let k = 1 / paramStep - 1;
    let n = paramNumber - 1;

    document.querySelector(".js_parametrs-kits-number").innerHTML =
      partialFactorial(k, k - n) / partialFactorial(n);
  }
}

function parametrsNumberInputChangeEventListener(e) {
  const gradeTable = createGradeInputTable(
    setParametersNumber(Number(e.target.value))
  );
  settingsForm
    .querySelectorAll(".js-parameters-grade-table-block")
    .forEach(function (element) {
      element.closest(".js_parametrs-grade-input").classList.add("active");
      const table = element.querySelector("table");
      if (table) table.parentNode.removeChild(table);
      element.append(gradeTable);
    });
  parametrsNumberKitsNumberGet();
}
settingsForm
  .querySelectorAll(".js_parametrs-number-input")
  .forEach((element) => {
    element.addEventListener("change", parametrsNumberInputChangeEventListener);
  });

settingsForm.querySelectorAll(".js_parametrs-step-input").forEach((element) => {
  element.addEventListener("change", parametrsNumberKitsNumberGet);
});

function parametrsGradeInputChangeEventListener(e) {
  setGradeValues;
}
settingsForm
  .querySelectorAll(".js_parametrs-grade-input")
  .forEach((element) => {
    element.addEventListener("change", parametrsGradeInputChangeEventListener);
  });

function parametrsGradeInputKitRemoveEventListener(e) {
  parametrsGradeInputRemoveKit(e.target);
}
settingsForm
  .querySelectorAll(".js_parametrs-grade-input-number-control-remove")
  .forEach((element) => {
    element.addEventListener(
      "click",
      parametrsGradeInputKitRemoveEventListener
    );
  });

function parametrsGradeInputKitAddEventListener(e) {
  parametrsGradeInputAddKit(e.target, getParametersNumber());
}
settingsForm
  .querySelectorAll(".js_parametrs-grade-input-number-control-add")
  .forEach((element) => {
    element.addEventListener("click", parametrsGradeInputKitAddEventListener);
  });

function menuButtonEventListener(event) {
  const menuButton = this;
  const targetMenuItem = menuButton.dataset.menuName;
  menuButton.parentNode.querySelector(".active").classList.remove("active");
  const resultBlock = menuButton.parentNode.parentNode;
  resultBlock.querySelector(".active").classList.remove("active");
  resultBlock
    .querySelector(
      `[data-menu-name=${targetMenuItem}]:not(.js_result-menu-button)`
    )
    .classList.add("active");
  menuButton.classList.add("active");
}
const resultMenuButtons = document.querySelectorAll(".js_result-menu-button");
resultMenuButtons.forEach((element) => {
  element.addEventListener("click", menuButtonEventListener);
});

window.addEventListener("DOMContentLoaded", () => {
  inputBtnsNumberControl();
  filtersBtns();
  numberNamesHandler();
  commonDescriptionMobile();
  objectsNamesBtnsHandler();
});
