let gradeExist = true,
    gradeKitNumbers = 0;
let gradeValues = [];

function transposeArray(array, parametersNumber) {
    // Проверяем, что входной параметр - это двумерный массив
    if (!Array.isArray(array) || array.length === 0 || !Array.isArray(array[0])) {
        throw new Error('Invalid input. Expected a 2D array.');
    }

    const numRows = array.length;
    const numCols = array[0].length;

    // Создаем новый массив для транспонированной матрицы
    const transposedArray = [];

    // Итерируем по колонкам и создаем строки для транспонированной матрицы
    for (let col = 0; col < numCols; col++) {
        const newRow = [];
        // Итерируем по строкам и добавляем элементы из текущей колонки
        for (let row = 0; row < numRows; row++) {
            newRow.push(array[row][col]);
        }
        if (newRow.length != parametersNumber) {
            gradeExist = false;
            return
        }

        // Добавляем сформированную строку в транспонированный массив
        transposedArray.push(newRow);
    }

    return transposedArray;
}

function divideElementsByMax(array) {
    // Проходим по каждому одномерному массиву в двумерном массиве
    for (let i = 0; i < array.length; i++) {
        const subArray = array[i];
        
        // Находим наибольший элемент в текущем одномерном массиве
        const maxElement = Math.max(...subArray);

        // Перебираем элементы текущего одномерного массива и делим их на maxElement
        for (let j = 0; j < subArray.length; j++) {
            subArray[j] /= maxElement;
        }
    }

    return array;
}

function setGradeValues(valuesTable, parametersNumber) {
    let gradeKit, gradeKits = [];
    gradeExist = true;
    gradeValues = [];
    const valuesTableRows = valuesTable.querySelector(".js-parameters-grade-table-block").querySelectorAll(".js_parameters-grade-table-row");
    for (let j = 0; j < valuesTableRows.length; j++) {
        gradeKit = [];
        const inputItems = valuesTableRows[j].querySelectorAll(".js_parameters-grade-table-item-input");
        for(let i = 0; i < inputItems.length; i++) {
            let value = inputItems[i].value;
            if (!value) {
                gradeExist = false;
                return true;
            }
            if (isFinite(value)) {
                gradeKit.push(Number(inputItems[i].value));
            } else {
                return gradeExist = false;
            };
        }

        gradeKits.push(gradeKit);
    }

    gradeValues = transposeArray(divideElementsByMax(gradeKits), parametersNumber);


    gradeKitNumbers = gradeValues.length;
    return gradeExist;
}

function isGradeExist() {
    return gradeExist;
}

function getGrade(parametersKit) {
    let kitGrade = [], grade;
    for (let i = 0; i < gradeValues.length; i++) {
        grade = 0;
        let valuesKit = gradeValues[i];
        for (let i = 0; i < parametersKit.length; i++) {
            grade += parametersKit[i] * valuesKit[i];
        }
        kitGrade.push(grade);
    }
    return kitGrade
}

function getGradeNumbers() {
    return gradeKitNumbers;
}

function addGrade(parametersKit) {
    let kitArray = parametersKit.slice(0);
    kitArray = kitArray.concat(getGrade(kitArray));
    return kitArray;
}

export {
    isGradeExist,
    setGradeValues,
    addGrade,
    getGradeNumbers,
};