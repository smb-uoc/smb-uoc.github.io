/**
 * @class View
 *
 * Visual representation of the model.
 */
class ExpenseView {
  constructor() {
    this.form = this.getElement("#form");
    this.text = this.getElement("#text");
    this.amount = this.getElement("#amount");
    this.list = this.getElement("#list");
    this.money_minus = this.getElement("#money-minus");
    this.money_plus = this.getElement("#money-plus");
    this.balance = this.getElement("#balance");

    this._editing = null;
  }

  get _expenseText() {
    return this.text.value;
  }

  get _amountText() {
    return +this.amount.value;
  }

  _resetInputs() {
    this.text.value = "";
    this.amount.value = "";
  }

  getElement(selector) {
    return document.querySelector(selector);
  }

  displayExpenses(expenses) {
    this.list.innerHTML = '';
    expenses.forEach(expense => {
      // Get sign
      const sign = expense.amount < 0 ? '-' : '+';

      const item = document.createElement('li');

      // Add class based on value
      item.classList.add(expense.amount < 0 ? 'minus' : 'plus');
      item.id = expense.id;
      item.innerHTML = `
${expense.text} <span>${sign}${Math.abs(expense.amount)}</span>
 <button class="delete-btn">x</button>`;
      this.list.appendChild(item);
    });

    const amounts = expenses.map(expense => expense.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts
      .filter(item => item > 0)
      .reduce((acc, item) => (acc += item), 0)
      .toFixed(2);

    const expense = (
      amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
      -1
    ).toFixed(2);

    this.balance.innerText = `$${total}`;
    this.money_plus.innerText = `$${income}`;
    this.money_minus.innerText = `$${expense}`;
  }

  bindAddExpense(handler) {
    this.form.addEventListener("submit", event => {
      event.preventDefault();

      if (this._expenseText.trim() === '' || this._amountText === '') {
        alert('Please add a text and amount');
      } else {
        handler(this._expenseText, this._amountText);
        this._resetInputs();
      }
    });
  }

  bindDeleteExpense(handler) {
    this.list.addEventListener("click", event => {
      if (event.target.className === "delete-btn") {
        const id = event.target.parentElement.id;
        handler(id);
      }
    });
  }

  bindEditSaveExpense(handler, id) {
    this._editing.addEventListener("blur", event => {
      handler(id, this._editing.value);
    });
  }

  bindEditExpense(handler) {
    this.list.addEventListener("click", event => {
      if (this._editing === null && (event.target.className === "minus" || event.target.className === "plus")) {
        this.displayEditableAmount(event.target, handler);
      }
    });
  }

  displayEditableAmount(element, handler) {
    const id = element.id;
    const span = Array.from(element.children).find(child => child.tagName === "SPAN");

    this._editing = document.createElement("input");
    this._editing.type = "number";
    this._editing.value = +span.textContent;
    this._editing.className = "input-editable"; // Puedes añadir estilos a este input

    element.removeChild(span);
    element.appendChild(this._editing);
    this._editing.focus();
    this.bindEditSaveExpense(handler, id);
  }
}
