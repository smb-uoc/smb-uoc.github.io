/**
 * @class Model
 *
 * Manages the data of the application.
 */
class Expense {
  constructor({text, amount, id}) {
    this.id = id || this.generateID();
    this.text = text;
    this.amount = amount;
  }

  // Generate random ID
  generateID() {
    return Math.floor(Math.random() * 100000000);
  }
}
