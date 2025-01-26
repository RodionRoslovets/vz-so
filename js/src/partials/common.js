import { slideDown, slideUp } from "./slideUpAndDown";

export const inputBtnsNumberControl = () => {
  const wrappers = document.querySelectorAll(".common__button-number-wrapper");

  if (wrappers?.length > 0) {
    wrappers.forEach((wrapper) => {
      const input = wrapper.querySelector(".common__input");
      const decreaseBtn = wrapper.querySelector(
        ".common__button-button--decrease"
      );
      const increaseBtn = wrapper.querySelector(
        ".common__button-button--increase"
      );

      if (input && increaseBtn && decreaseBtn) {
        increaseBtn.addEventListener("click", () => {
          input.stepUp();

          input.dispatchEvent(new Event("change"));
        });

        decreaseBtn.addEventListener("click", () => {
          if (input.value && Number(input.value) > Number(input.min)) {
            input.stepDown();
          } else {
            input.value = input.min;
          }

          input.dispatchEvent(new Event("change"));
        });
      }
    });
  }
};

const COMPARE_VALS = [">"];

const addFiltersBlock = () => {
  const filtersBlock = document.querySelector(".common__filters__block");
  const wrapper = document.createElement("div");
  const beforeInput = document.createElement("input");
  const afterInput = document.createElement("input");
  const filtersSelect = document.createElement("select");
  const removeButton = document.createElement("button");

  COMPARE_VALS.forEach((val, index) => {
    const opt = document.createElement("option");
    opt.value = val;
    opt.innerHTML = val === ">=" ? "&#8805;" : val === "<=" ? "&#8804;" : val;

    if (index === 0) {
      opt.selected = true;
    }

    filtersSelect.appendChild(opt);
  });

  beforeInput.type = "text";
  afterInput.type = "text";
  removeButton.type = "button";

  wrapper.classList.add("common__parameters-block");
  beforeInput.classList.add(
    "js_parametrs-step-input",
    "common__input",
    "common__input--condition",
    "common__input--condition--left"
  );
  afterInput.classList.add(
    "js_parametrs-step-input",
    "common__input",
    "common__input--condition",
    "common__input--condition--right"
  );
  filtersSelect.classList.add("common__select");
  removeButton.classList.add(
    "common__button-button",
    "common__button-button--decrease",
    "filters__bt--remove"
  );

  removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                                <rect x="7" y="12.001" width="1" height="9" transform="rotate(-90 7 12.001)" fill="#151833" fill-opacity="0.46"/>
                            </svg>`;

  removeButton.addEventListener("click", () => {
    filtersBlock.removeChild(wrapper);
  });

  filtersSelect.disabled = true;

  wrapper.appendChild(beforeInput);
  wrapper.appendChild(filtersSelect);
  wrapper.appendChild(afterInput);
  wrapper.appendChild(removeButton);

  filtersBlock.appendChild(wrapper);
};

export const filtersBtns = () => {
  const addBtn = document.querySelector(".filters__bt--add");

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      addFiltersBlock();
    });
  }
};

const addNumberName = (index) => {
  const namesList = document.querySelector(".number-names-list");
  const wrapper = document.createElement("div");
  const input = document.createElement("input");
  const span = document.createElement("span");

  span.innerText = index + 1;
  input.type = "text";

  wrapper.classList.add("number-name");
  input.classList.add("common__input");

  wrapper.appendChild(span);
  wrapper.appendChild(input);

  namesList.appendChild(wrapper);
};

export const addObjectName = (index) => {
  const namesList = document.querySelector(".objects-names-list");
  const wrapper = document.createElement("div");
  const input = document.createElement("input");
  const span = document.createElement("span");

  span.innerText = index + 1;
  input.type = "text";

  wrapper.classList.add("objects-name");
  input.classList.add("common__input");

  wrapper.appendChild(span);
  wrapper.appendChild(input);

  namesList.appendChild(wrapper);

  namesList.parentElement.style.display = "block";
};

const removeLastChildsFromObjectNames = (count) => {
  const namesList = document.querySelector(".objects-names-list");

  namesList.removeChild(namesList.lastElementChild);
};

const removeLastChildsFromNames = (count) => {
  const namesList = document.querySelector(".number-names-list");

  for (let i = 0; i < count; i++) {
    namesList.removeChild(namesList.lastElementChild);
  }
};

export const numberNamesHandler = () => {
  const input = document.querySelector("#number");
  const namesWrapper = document.querySelector(".number-names");

  if (input && namesWrapper) {
    input.addEventListener("change", () => {
      const value = +input.value;
      const namesList = document.querySelector(".number-names-list");

      if (value > 0 && namesList.children.length >= 0) {
        namesWrapper.style.display = "block";

        for (let i = namesList.children.length; i < value; i++) {
          addNumberName(i);
        }
      } else {
        namesList.innerHTML = "";
        namesWrapper.style.display = "none";
      }

      if (value < namesList.children.length) {
        removeLastChildsFromNames(namesList.children.length - value);
      }
    });
  }
};

export const commonDescriptionMobile = () => {
  const btn = document.querySelector(".common-text-btn");
  const description = document.querySelector(".common-text-content");
  let windowWidth = window.innerWidth;

  window.addEventListener("resize", () => {
    windowWidth = window.innerWidth;

    description.style.display = windowWidth > 890 ? "block" : "none";
  });

  if (description && btn) {
    btn.addEventListener("click", () => {
      if (windowWidth > 890) return;

      if (btn.classList.contains("common-text-btn--active")) {
        btn.classList.remove("common-text-btn--active");
        slideUp(description);
      } else {
        btn.classList.add("common-text-btn--active");
        slideDown(description);
      }
    });
  }
};

export const objectsNamesBtnsHandler = () => {
  const addBtn = document.querySelector(".objects-add");
  const removeBtn = document.querySelector(".objects-remove");

  if (addBtn && removeBtn) {
    addBtn.addEventListener("click", () => {
      const objectsNamesList = document.querySelector(".objects-names-list");

      addObjectName(objectsNamesList.children.length);
    });

    removeBtn.addEventListener("click", () => {
      const objectsNamesList = document.querySelector(".objects-names-list");

      removeLastChildsFromObjectNames(objectsNamesList.children.length);
    });
  }
};
