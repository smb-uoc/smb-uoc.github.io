/**
 * @class Controller
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */
class ExpenseController {
  constructor(service, view) {
    this.service = service;
    this.view = view;

    // Explicit this binding
    this.service.bindExpenseListChanged(this.onExpenseListChanged);
    this.view.bindAddExpense(this.handleAddExpense);
    this.view.bindDeleteExpense(this.handleDeleteExpense);
    this.view.bindEditExpense(this.handleEditExpense);

    // Display initial expenses
    this.onExpenseListChanged(this.service.expenses);
  }

  handleAddExpense = (text, amount) => {
    this.service.addExpense(text, amount);
  };

  onExpenseListChanged = expenses => {
    this.view.displayExpenses(expenses);
  };

  handleDeleteExpense = id => {
    this.service.deleteExpense(id);
  };

  handleEditExpense = (id, value) => {
    this.service.editExpense(id, value);
  };
}
