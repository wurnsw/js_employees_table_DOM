'use strict';

const tBody = document.querySelector('tbody');
const titles = document.querySelectorAll('th');
const rows = [...tBody.rows];

// Сonvert salary

function convertSalaryToNumber(salary) {
  return +salary.slice(1).replace(',', '');
}

function convertSalaryToString(salary) {
  return '$' + Number(salary).toLocaleString('en-US');
}

// Sort employees

titles.forEach((title, index) => {
  title.addEventListener('click', (e) => {
    const isAsc = e.target.classList.toggle('asc');

    rows.sort((row1, row2) => {
      const firstRow = row1.children[index].innerText;
      const secondRow = row2.children[index].innerText;

      switch (e.target.innerText) {
        case 'Age':
          return isAsc ? +firstRow - +secondRow : +secondRow - +firstRow;
        case 'Salary':
          return isAsc
            ? convertSalaryToNumber(firstRow) - convertSalaryToNumber(secondRow)
            : convertSalaryToNumber(secondRow) -
                convertSalaryToNumber(firstRow);
        default:
          return isAsc
            ? firstRow.localeCompare(secondRow)
            : secondRow.localeCompare(firstRow);
      }
    });
    tBody.append(...rows);
  });
});

// Row focus

tBody.addEventListener('click', (e) => {
  rows.forEach((row) => {
    row.classList.remove('active');
  });
  e.target.closest('tr').classList.add('active');
});

// Create form

const form = document.createElement('form');

form.classList.add('new-employee-form');

// Create inputs & button

const inputs = ['Name', 'Position', 'Age', 'Salary'];

inputs.forEach((elem) => {
  const input = document.createElement('input');
  const label = document.createElement('label');

  label.textContent = elem + ':';
  input.name = elem.toLocaleLowerCase();
  input.setAttribute('data-qa', elem.toLocaleLowerCase());

  if (elem === 'Age' || elem === 'Salary') {
    input.type = 'number';
  } else {
    input.type = 'text';
  }

  label.appendChild(input);
  form.appendChild(label);

  if (elem === 'Position') {
    const select = document.createElement('select');
    const selectLabel = document.createElement('label');

    selectLabel.textContent = 'Office';
    select.name = 'office';
    select.setAttribute('data-qa', 'office');

    const options = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    options.forEach((city) => {
      const option = document.createElement('option');

      option.textContent = city;
      select.appendChild(option);
    });

    selectLabel.appendChild(select);
    form.appendChild(selectLabel);
  }
});

const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';
form.appendChild(button);

document.body.appendChild(form);

// Checks data and adds new employee

function capitalize(value) {
  let result = '';

  for (let i = 0; i < value.length; i++) {
    if (i === 0 || value[i - 1] === ' ') {
      result += value[i].toUpperCase();
    } else {
      result += value[i];
    }
  }

  return result;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Checks data and create notifications

  const { age, position, salary, office, name: emplName } = e.target.elements;

  const isError =
    emplName.value.length < 4 ||
    age.value < 18 ||
    age.value > 90 ||
    position.value.length < 1 ||
    salary.value < 1;

  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification', isError ? 'error' : 'success');
  notification.textContent = isError ? 'Error' : 'Employee added';

  setTimeout(() => {
    notification.remove();
  }, 3000);

  document.body.appendChild(notification);

  if (isError) {
    return;
  }

  // Adds new employee
  const employee = document.createElement('tr');

  const employeeData = [
    capitalize(emplName.value),
    capitalize(position.value),
    office.value,
    age.value,
    convertSalaryToString(salary.value),
  ];

  employeeData.forEach((data) => {
    const cell = document.createElement('td');

    cell.textContent = data;
    employee.appendChild(cell);
  });

  tBody.appendChild(employee);

  form.reset();
});

// Editing cells

tBody.addEventListener('click', (e) => {
  const cell = e.target;

  const textCell = cell.textContent;
  const editInput = document.createElement('input');

  editInput.value = cell.textContent;
  editInput.classList.add('cell-input');
  cell.textContent = '';
  cell.appendChild(editInput);

  editInput.addEventListener('blur', () => {
    cell.textContent = editInput.value;
    cell.textContent = editInput.value ? editInput.value : textCell;
    editInput.remove();
  });

  editInput.addEventListener('keydown', (even) => {
    if (even.key === 'Enter') {
      cell.textContent = editInput.value ? editInput.value : textCell;
      editInput.remove();
    }
  });
});
