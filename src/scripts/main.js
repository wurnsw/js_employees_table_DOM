'use strict';

const titles = document.querySelectorAll('th');
const tBody = document.querySelector('tbody');

// Сonvert salary
function convertSalaryToNumber(salary) {
  return +salary.slice(1).replace(',', '');
}

// Sort employees
titles.forEach((title, index) => {
  title.addEventListener('click', (e) => {
    const rows = [...tBody.rows];
    const isAsc = title.classList.toggle('asc');

    rows.sort((row1, row2) => {
      const firstRow = row1.children[index].innerText;
      const secondRow = row2.children[index].innerText;

      if (e.target.innerText === 'Age') {
        if (isAsc) {
          return +firstRow - +secondRow;
        } else {
          return +secondRow - +firstRow;
        }
      }

      if (e.target.innerText === 'Salary') {
        if (isAsc) {
          return (
            convertSalaryToNumber(firstRow) - convertSalaryToNumber(secondRow)
          );
        } else {
          return (
            convertSalaryToNumber(secondRow) - convertSalaryToNumber(firstRow)
          );
        }
      }

      if (isAsc) {
        return firstRow.localeCompare(secondRow);
      } else {
        return secondRow.localeCompare(firstRow);
      }
    });
    tBody.append(...rows);
  });
});

// Row focus
tBody.addEventListener('click', (e) => {
  [...tBody.rows].forEach((row) => {
    row.classList.remove('active');
  });
  e.target.closest('tr').classList.add('active');
});

// Create form
const form = document.createElement('form');

form.classList.add('new-employee-form');

// Create input for name
const nameLabel = document.createElement('label');

nameLabel.textContent = 'Name: ';

const nameInput = document.createElement('input');

nameInput.name = 'name';
nameInput.type = 'text';
nameInput.setAttribute('data-qa', 'name');
nameLabel.appendChild(nameInput);

// Create input for position
const positionLabel = document.createElement('label');

positionLabel.textContent = 'Position: ';

const positionInput = document.createElement('input');

positionInput.name = 'position';
positionInput.type = 'text';
positionInput.setAttribute('data-qa', 'position');
positionLabel.appendChild(positionInput);

// Create select for office
const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office :';

const officeSelect = document.createElement('select');

officeSelect.name = 'office';
officeSelect.setAttribute('data-qa', 'office');

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

offices.forEach((office) => {
  const option = document.createElement('option');

  option.value = office;
  option.textContent = office;
  officeSelect.appendChild(option);
});
officeLabel.appendChild(officeSelect);

// Create input for age
const ageLabel = document.createElement('label');

ageLabel.textContent = 'Age :';

const ageInput = document.createElement('input');

ageInput.name = 'age';
ageInput.type = 'number';
ageInput.setAttribute('data-qa', 'age');
ageLabel.appendChild(ageInput);

// Create input for salary
const salaryLabel = document.createElement('label');

salaryLabel.textContent = 'Salary: ';

const salaryInput = document.createElement('input');

salaryInput.name = 'salary';
salaryInput.type = 'number';
salaryInput.setAttribute('data-qa', 'salary');
salaryLabel.appendChild(salaryInput);

// Create submit button
const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';

// Add elements to the form
form.appendChild(nameLabel);
form.appendChild(positionLabel);
form.appendChild(officeLabel);
form.appendChild(ageLabel);
form.appendChild(salaryLabel);
form.appendChild(submitButton);

// Add form to the document
document.body.appendChild(form);

// Checks data
submitButton.addEventListener('click', (e) => {
  e.preventDefault();

  const firstName = nameInput.value;
  const age = parseInt(ageInput.value, 10);
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification');

  if (firstName.length < 4) {
    notification.classList.add('error');
    notification.textContent = 'Name too short.';
  } else if (age < 18 || age > 90) {
    notification.classList.add('error');
    notification.textContent = 'Age not valid.';
  } else {
    notification.classList.add('success');
    notification.textContent = 'Employee added.';
  }

  document.body.appendChild(notification);
});
