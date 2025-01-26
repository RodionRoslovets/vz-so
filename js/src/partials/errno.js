let errorField;

function setErrorField(field) {
    errorField = field;
}

function stepError(parameterKitSumm) {
    errorField.innerHTML += `Введите пожалуйста шаг, которому кратна сумма ряда равная: ${parameterKitSumm}`;
}

function setFilterParametersError() {
    errorField.innerHTML += `Введите пожалуйста корректную строку для фильтрации`;
}

function setGradeValuesError() {
    errorField.innerHTML += `Введите пожалуйста корректные данные для вычисления оценок`;
}

function setNullResaultError() {
    errorField.innerHTML += `Подходящих элементов не найдено`;
}


export {
    stepError,
    setErrorField,
    setFilterParametersError,
    setGradeValuesError,
    setNullResaultError,
};