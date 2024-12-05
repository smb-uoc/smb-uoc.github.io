/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/controllers/todo.controller.ts":
/*!********************************************!*\
  !*** ./src/controllers/todo.controller.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TodoController: () => (/* binding */ TodoController)
/* harmony export */ });
/**
 * @class Controller
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */
class TodoController {
    constructor(service, view) {
        this.onTodoListChanged = (todos) => {
            this.view.displayTodos(todos);
        };
        this.handleAddTodo = (todoText) => {
            this.service.addTodo(todoText);
        };
        this.handleEditTodo = (id, todoText) => {
            this.service.editTodo(id, todoText);
        };
        this.handleDeleteTodo = (id) => {
            this.service.deleteTodo(id);
        };
        this.handleToggleTodo = (id) => {
            this.service.toggleTodo(id);
        };
        this.service = service;
        this.view = view;
        // Explicit this binding
        this.service.bindTodoListChanged(this.onTodoListChanged);
        this.view.bindAddTodo(this.handleAddTodo);
        this.view.bindEditTodo(this.handleEditTodo);
        this.view.bindDeleteTodo(this.handleDeleteTodo);
        this.view.bindToggleTodo(this.handleToggleTodo);
        // Display initial todos
        this.onTodoListChanged(this.service.todos);
    }
}


/***/ }),

/***/ "./src/models/todo.model.ts":
/*!**********************************!*\
  !*** ./src/models/todo.model.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Todo: () => (/* binding */ Todo)
/* harmony export */ });
/**
 * @class Model
 *
 * Manages the data of the application.
 */
class Todo {
    constructor({ text, complete = false }) {
        this.id = this.uuidv4();
        this.text = text;
        this.complete = complete;
    }
    uuidv4() {
        const result = [1e7].toString() + (-1e3).toString() + (-4e3).toString() + (-8e3).toString() + (-1e11).toString();
        return (result).replace(/[018]/g, (c) => (c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
    }
}


/***/ }),

/***/ "./src/services/todo.service.ts":
/*!**************************************!*\
  !*** ./src/services/todo.service.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TodoService: () => (/* binding */ TodoService)
/* harmony export */ });
/* harmony import */ var models_todo_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! models/todo.model */ "./src/models/todo.model.ts");

/**
 * @class Service
 *
 * Manages the data of the application.
 */
class TodoService {
    constructor() {
        this.onTodoListChanged = () => {
        };
        let list = localStorage.getItem("todos");
        if (list === null) {
            this.todos = [];
        }
        else {
            this.todos = (JSON.parse(list) || []).map((todo) => new models_todo_model__WEBPACK_IMPORTED_MODULE_0__.Todo(todo));
        }
    }
    bindTodoListChanged(callback) {
        this.onTodoListChanged = callback;
    }
    _commit(todos) {
        this.onTodoListChanged(todos);
        localStorage.setItem("todos", JSON.stringify(todos));
    }
    addTodo(text) {
        this.todos.push(new models_todo_model__WEBPACK_IMPORTED_MODULE_0__.Todo({ text }));
        this._commit(this.todos);
    }
    editTodo(id, updatedText) {
        this.todos = this.todos.map(todo => todo.id === id
            ? new models_todo_model__WEBPACK_IMPORTED_MODULE_0__.Todo(Object.assign(Object.assign({}, todo), { text: updatedText }))
            : todo);
        this._commit(this.todos);
    }
    deleteTodo(_id) {
        this.todos = this.todos.filter(({ id }) => id !== _id);
        this._commit(this.todos);
    }
    toggleTodo(_id) {
        this.todos = this.todos.map(todo => todo.id === _id ? new models_todo_model__WEBPACK_IMPORTED_MODULE_0__.Todo(Object.assign(Object.assign({}, todo), { complete: !todo.complete })) : todo);
        this._commit(this.todos);
    }
}


/***/ }),

/***/ "./src/views/todo.views.ts":
/*!*********************************!*\
  !*** ./src/views/todo.views.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TodoView: () => (/* binding */ TodoView)
/* harmony export */ });
/**
 * @class View
 *
 * Visual representation of the model.
 */
class TodoView {
    constructor() {
        this.app = this.getElement("#root");
        this.form = this.createElement("form");
        this.input = this.createElement("input");
        this.input.type = "text";
        this.input.placeholder = "Add todo";
        this.input.name = "todo";
        this.submitButton = this.createElement("button");
        this.submitButton.textContent = "Submit";
        this.form.append(this.input, this.submitButton);
        this.title = this.createElement("h1");
        this.title.textContent = "Todos";
        this.todoList = this.createElement("ul", "todo-list");
        this.app.append(this.title, this.form, this.todoList);
        this._temporaryTodoText = "";
        this._initLocalListeners();
    }
    get _todoText() {
        return this.input.value;
    }
    _resetInput() {
        this.input.value = "";
    }
    createElement(tag, className) {
        const element = document.createElement(tag);
        if (className)
            element.classList.add(className);
        return element;
    }
    getElement(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            throw new Error(`No element found with selector: ${selector}`);
        }
        return element;
    }
    displayTodos(todos) {
        // Delete all nodes
        while (this.todoList.firstChild) {
            this.todoList.removeChild(this.todoList.firstChild);
        }
        // Show default message
        if (todos.length === 0) {
            const p = this.createElement("p");
            p.textContent = "Nothing to do! Add a task?";
            this.todoList.append(p);
        }
        else {
            // Create nodes
            todos.forEach(todo => {
                const li = this.createElement("li");
                li.id = todo.id;
                const checkbox = this.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = todo.complete;
                const span = this.createElement("span");
                span.contentEditable = 'true';
                span.classList.add("editable");
                if (todo.complete) {
                    const strike = this.createElement("s");
                    strike.textContent = todo.text;
                    span.append(strike);
                }
                else {
                    span.textContent = todo.text;
                }
                const deleteButton = this.createElement("button", "delete");
                deleteButton.textContent = "Delete";
                li.append(checkbox, span, deleteButton);
                // Append nodes
                this.todoList.append(li);
            });
        }
        // Debugging
        console.log(todos);
    }
    _initLocalListeners() {
        this.todoList.addEventListener("input", (event) => {
            const target = event.target;
            if (target && target.classList.contains("editable")) {
                this._temporaryTodoText = target.innerText;
            }
        });
    }
    bindAddTodo(handler) {
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            if (this._todoText) {
                handler(this._todoText);
                this._resetInput();
            }
        });
    }
    bindDeleteTodo(handler) {
        this.todoList.addEventListener("click", (event) => {
            const target = event.target;
            if (target && target.className === "delete") {
                const parentElement = target.parentElement;
                if (parentElement && parentElement.id) {
                    const id = parentElement.id;
                    handler(id);
                }
            }
        });
    }
    bindEditTodo(handler) {
        this.todoList.addEventListener("focusout", (event) => {
            const target = event.target;
            if (target && this._temporaryTodoText) {
                const parentElement = target.parentElement;
                if (parentElement && parentElement.id) {
                    const id = parentElement.id;
                    handler(id, this._temporaryTodoText);
                    this._temporaryTodoText = "";
                }
            }
        });
    }
    bindToggleTodo(handler) {
        this.todoList.addEventListener("change", (event) => {
            const target = event.target;
            if (target && target.type === "checkbox") {
                const parentElement = target.parentElement;
                if (parentElement && parentElement.id) {
                    const id = parentElement.id;
                    handler(id);
                }
            }
        });
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var controllers_todo_controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! controllers/todo.controller */ "./src/controllers/todo.controller.ts");
/* harmony import */ var services_todo_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! services/todo.service */ "./src/services/todo.service.ts");
/* harmony import */ var views_todo_views__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! views/todo.views */ "./src/views/todo.views.ts");



const app = new controllers_todo_controller__WEBPACK_IMPORTED_MODULE_0__.TodoController(new services_todo_service__WEBPACK_IMPORTED_MODULE_1__.TodoService(), new views_todo_views__WEBPACK_IMPORTED_MODULE_2__.TodoView());

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKOzs7Ozs7O1VDaktEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ042RDtBQUNUO0FBQ1I7QUFFNUMsTUFBTSxHQUFHLEdBQUcsSUFBSSx1RUFBYyxDQUFDLElBQUksOERBQVcsRUFBRSxFQUFFLElBQUksc0RBQVEsRUFBRSxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wZWMzX2VqNC8uL3NyYy9jb250cm9sbGVycy90b2RvLmNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vcGVjM19lajQvLi9zcmMvbW9kZWxzL3RvZG8ubW9kZWwudHMiLCJ3ZWJwYWNrOi8vcGVjM19lajQvLi9zcmMvc2VydmljZXMvdG9kby5zZXJ2aWNlLnRzIiwid2VicGFjazovL3BlYzNfZWo0Ly4vc3JjL3ZpZXdzL3RvZG8udmlld3MudHMiLCJ3ZWJwYWNrOi8vcGVjM19lajQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcGVjM19lajQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3BlYzNfZWo0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcGVjM19lajQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wZWMzX2VqNC8uL3NyYy9hcHAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtUb2RvU2VydmljZX0gZnJvbSBcInNlcnZpY2VzL3RvZG8uc2VydmljZVwiO1xuaW1wb3J0IHtUb2RvVmlld30gZnJvbSBcInZpZXdzL3RvZG8udmlld3NcIjtcbmltcG9ydCB7VG9kb30gZnJvbSBcIm1vZGVscy90b2RvLm1vZGVsXCI7XG5cbi8qKlxuICogQGNsYXNzIENvbnRyb2xsZXJcbiAqXG4gKiBMaW5rcyB0aGUgdXNlciBpbnB1dCBhbmQgdGhlIHZpZXcgb3V0cHV0LlxuICpcbiAqIEBwYXJhbSBtb2RlbFxuICogQHBhcmFtIHZpZXdcbiAqL1xuZXhwb3J0IGNsYXNzIFRvZG9Db250cm9sbGVyIHtcbiAgICBwcml2YXRlIHNlcnZpY2U6IFRvZG9TZXJ2aWNlO1xuICAgIHByaXZhdGUgdmlldzogVG9kb1ZpZXc7XG5cbiAgICBjb25zdHJ1Y3RvcihzZXJ2aWNlOiBUb2RvU2VydmljZSwgdmlldzogVG9kb1ZpZXcpIHtcbiAgICAgICAgdGhpcy5zZXJ2aWNlID0gc2VydmljZTtcbiAgICAgICAgdGhpcy52aWV3ID0gdmlldztcblxuICAgICAgICAvLyBFeHBsaWNpdCB0aGlzIGJpbmRpbmdcbiAgICAgICAgdGhpcy5zZXJ2aWNlLmJpbmRUb2RvTGlzdENoYW5nZWQodGhpcy5vblRvZG9MaXN0Q2hhbmdlZCk7XG4gICAgICAgIHRoaXMudmlldy5iaW5kQWRkVG9kbyh0aGlzLmhhbmRsZUFkZFRvZG8pO1xuICAgICAgICB0aGlzLnZpZXcuYmluZEVkaXRUb2RvKHRoaXMuaGFuZGxlRWRpdFRvZG8pO1xuICAgICAgICB0aGlzLnZpZXcuYmluZERlbGV0ZVRvZG8odGhpcy5oYW5kbGVEZWxldGVUb2RvKTtcbiAgICAgICAgdGhpcy52aWV3LmJpbmRUb2dnbGVUb2RvKHRoaXMuaGFuZGxlVG9nZ2xlVG9kbyk7XG5cbiAgICAgICAgLy8gRGlzcGxheSBpbml0aWFsIHRvZG9zXG4gICAgICAgIHRoaXMub25Ub2RvTGlzdENoYW5nZWQodGhpcy5zZXJ2aWNlLnRvZG9zKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uVG9kb0xpc3RDaGFuZ2VkID0gKHRvZG9zOiBUb2RvW10pOiB2b2lkID0+IHtcbiAgICAgICAgdGhpcy52aWV3LmRpc3BsYXlUb2Rvcyh0b2Rvcyk7XG4gICAgfTtcblxuICAgIGhhbmRsZUFkZFRvZG8gPSAodG9kb1RleHQ6IHN0cmluZykgPT4ge1xuICAgICAgICB0aGlzLnNlcnZpY2UuYWRkVG9kbyh0b2RvVGV4dCk7XG4gICAgfTtcblxuICAgIGhhbmRsZUVkaXRUb2RvID0gKGlkOiBzdHJpbmcsIHRvZG9UZXh0OiBzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy5zZXJ2aWNlLmVkaXRUb2RvKGlkLCB0b2RvVGV4dCk7XG4gICAgfTtcblxuICAgIGhhbmRsZURlbGV0ZVRvZG8gPSAoaWQ6IHN0cmluZykgPT4ge1xuICAgICAgICB0aGlzLnNlcnZpY2UuZGVsZXRlVG9kbyhpZCk7XG4gICAgfTtcblxuICAgIGhhbmRsZVRvZ2dsZVRvZG8gPSAoaWQ6IHN0cmluZykgPT4ge1xuICAgICAgICB0aGlzLnNlcnZpY2UudG9nZ2xlVG9kbyhpZCk7XG4gICAgfTtcbn1cbiIsIi8qKlxuICogQGNsYXNzIE1vZGVsXG4gKlxuICogTWFuYWdlcyB0aGUgZGF0YSBvZiB0aGUgYXBwbGljYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBUb2RvIHtcbiAgICBpZDogc3RyaW5nO1xuICAgIHRleHQ6IHN0cmluZztcbiAgICBjb21wbGV0ZTogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKHsgdGV4dCwgY29tcGxldGUgPSBmYWxzZSB9OiB7IHRleHQ6IHN0cmluZzsgY29tcGxldGU/OiBib29sZWFuIH0pIHtcbiAgICAgICAgdGhpcy5pZCA9IHRoaXMudXVpZHY0KCk7XG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMuY29tcGxldGUgPSBjb21wbGV0ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHV1aWR2NCgpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCByZXN1bHQ6IHN0cmluZyA9IFsxZTddLnRvU3RyaW5nKCkgKyAoLTFlMykudG9TdHJpbmcoKSArICgtNGUzKS50b1N0cmluZygpICsgKC04ZTMpLnRvU3RyaW5nKCkgKyAoLTFlMTEpLnRvU3RyaW5nKCk7XG4gICAgICAgIHJldHVybiAocmVzdWx0KS5yZXBsYWNlKC9bMDE4XS9nLCAoYzogYW55KSA9PlxuICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgIGMgXlxuICAgICAgICAgICAgICAgIChjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KDEpKVswXSAmICgxNSA+PiAoYyAvIDQpKSlcbiAgICAgICAgICAgICkudG9TdHJpbmcoMTYpXG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVG9kbyB9IGZyb20gXCJtb2RlbHMvdG9kby5tb2RlbFwiO1xuXG4vKipcbiAqIEBjbGFzcyBTZXJ2aWNlXG4gKlxuICogTWFuYWdlcyB0aGUgZGF0YSBvZiB0aGUgYXBwbGljYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBUb2RvU2VydmljZSB7XG4gICAgdG9kb3M6IFRvZG9bXTtcbiAgICBwcml2YXRlIG9uVG9kb0xpc3RDaGFuZ2VkOiBGdW5jdGlvbiA9ICgpID0+IHtcbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGxldCBsaXN0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0b2Rvc1wiKTtcbiAgICAgICAgaWYgKGxpc3QgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudG9kb3MgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudG9kb3MgPSAoSlNPTi5wYXJzZShsaXN0KSB8fCBbXSkubWFwKFxuICAgICAgICAgICAgICAgICh0b2RvOiBUb2RvKSA9PiBuZXcgVG9kbyh0b2RvKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJpbmRUb2RvTGlzdENoYW5nZWQoY2FsbGJhY2s6IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Ub2RvTGlzdENoYW5nZWQgPSBjYWxsYmFjaztcbiAgICB9XG5cbiAgICBfY29tbWl0KHRvZG9zOiBUb2RvW10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vblRvZG9MaXN0Q2hhbmdlZCh0b2Rvcyk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidG9kb3NcIiwgSlNPTi5zdHJpbmdpZnkodG9kb3MpKTtcbiAgICB9XG5cbiAgICBhZGRUb2RvKHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLnRvZG9zLnB1c2gobmV3IFRvZG8oe3RleHR9KSk7XG4gICAgICAgIHRoaXMuX2NvbW1pdCh0aGlzLnRvZG9zKTtcbiAgICB9XG5cbiAgICBlZGl0VG9kbyhpZDogc3RyaW5nLCB1cGRhdGVkVGV4dDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMudG9kb3MgPSB0aGlzLnRvZG9zLm1hcCh0b2RvID0+XG4gICAgICAgICAgICB0b2RvLmlkID09PSBpZFxuICAgICAgICAgICAgICAgID8gbmV3IFRvZG8oe1xuICAgICAgICAgICAgICAgICAgICAuLi50b2RvLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiB1cGRhdGVkVGV4dFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgOiB0b2RvXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5fY29tbWl0KHRoaXMudG9kb3MpO1xuICAgIH1cblxuICAgIGRlbGV0ZVRvZG8oX2lkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50b2RvcyA9IHRoaXMudG9kb3MuZmlsdGVyKCh7aWR9KSA9PiBpZCAhPT0gX2lkKTtcbiAgICAgICAgdGhpcy5fY29tbWl0KHRoaXMudG9kb3MpO1xuICAgIH1cblxuICAgIHRvZ2dsZVRvZG8oX2lkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50b2RvcyA9IHRoaXMudG9kb3MubWFwKHRvZG8gPT5cbiAgICAgICAgICAgIHRvZG8uaWQgPT09IF9pZCA/IG5ldyBUb2RvKHsuLi50b2RvLCBjb21wbGV0ZTogIXRvZG8uY29tcGxldGV9KSA6IHRvZG9cbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLl9jb21taXQodGhpcy50b2Rvcyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVG9kbyB9IGZyb20gXCJtb2RlbHMvdG9kby5tb2RlbFwiO1xuXG4vKipcbiAqIEBjbGFzcyBWaWV3XG4gKlxuICogVmlzdWFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtb2RlbC5cbiAqL1xuZXhwb3J0IGNsYXNzIFRvZG9WaWV3IHtcbiAgICBwcml2YXRlIGFwcDogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBmb3JtOiBIVE1MRm9ybUVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBpbnB1dDogSFRNTElucHV0RWxlbWVudDtcbiAgICBwcml2YXRlIHN1Ym1pdEJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgcHJpdmF0ZSB0aXRsZTogSFRNTEhlYWRpbmdFbGVtZW50O1xuICAgIHByaXZhdGUgdG9kb0xpc3Q6IEhUTUxVTGlzdEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBfdGVtcG9yYXJ5VG9kb1RleHQ6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmFwcCA9IHRoaXMuZ2V0RWxlbWVudChcIiNyb290XCIpO1xuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpIGFzIEhUTUxGb3JtRWxlbWVudDtcbiAgICAgICAgdGhpcy5pbnB1dCA9IHRoaXMuY3JlYXRlRWxlbWVudChcImlucHV0XCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgIHRoaXMuaW5wdXQudHlwZSA9IFwidGV4dFwiO1xuICAgICAgICB0aGlzLmlucHV0LnBsYWNlaG9sZGVyID0gXCJBZGQgdG9kb1wiO1xuICAgICAgICB0aGlzLmlucHV0Lm5hbWUgPSBcInRvZG9cIjtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24gPSB0aGlzLmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLnRleHRDb250ZW50ID0gXCJTdWJtaXRcIjtcbiAgICAgICAgdGhpcy5mb3JtLmFwcGVuZCh0aGlzLmlucHV0LCB0aGlzLnN1Ym1pdEJ1dHRvbik7XG4gICAgICAgIHRoaXMudGl0bGUgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoXCJoMVwiKSBhcyBIVE1MSGVhZGluZ0VsZW1lbnQ7XG4gICAgICAgIHRoaXMudGl0bGUudGV4dENvbnRlbnQgPSBcIlRvZG9zXCI7XG4gICAgICAgIHRoaXMudG9kb0xpc3QgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCBcInRvZG8tbGlzdFwiKSBhcyBIVE1MVUxpc3RFbGVtZW50O1xuICAgICAgICB0aGlzLmFwcC5hcHBlbmQodGhpcy50aXRsZSwgdGhpcy5mb3JtLCB0aGlzLnRvZG9MaXN0KTtcblxuICAgICAgICB0aGlzLl90ZW1wb3JhcnlUb2RvVGV4dCA9IFwiXCI7XG4gICAgICAgIHRoaXMuX2luaXRMb2NhbExpc3RlbmVycygpO1xuICAgIH1cblxuICAgIGdldCBfdG9kb1RleHQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXQudmFsdWU7XG4gICAgfVxuXG4gICAgX3Jlc2V0SW5wdXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW5wdXQudmFsdWUgPSBcIlwiO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlRWxlbWVudCh0YWc6IHN0cmluZywgY2xhc3NOYW1lPzogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICAgICAgICBpZiAoY2xhc3NOYW1lKSBlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRFbGVtZW50KHNlbGVjdG9yOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGVsZW1lbnQgZm91bmQgd2l0aCBzZWxlY3RvcjogJHtzZWxlY3Rvcn1gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICB9XG5cbiAgICBkaXNwbGF5VG9kb3ModG9kb3M6IFRvZG9bXSk6IHZvaWQge1xuICAgICAgICAvLyBEZWxldGUgYWxsIG5vZGVzXG4gICAgICAgIHdoaWxlICh0aGlzLnRvZG9MaXN0LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIHRoaXMudG9kb0xpc3QucmVtb3ZlQ2hpbGQodGhpcy50b2RvTGlzdC5maXJzdENoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNob3cgZGVmYXVsdCBtZXNzYWdlXG4gICAgICAgIGlmICh0b2Rvcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgcC50ZXh0Q29udGVudCA9IFwiTm90aGluZyB0byBkbyEgQWRkIGEgdGFzaz9cIjtcbiAgICAgICAgICAgIHRoaXMudG9kb0xpc3QuYXBwZW5kKHApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIG5vZGVzXG4gICAgICAgICAgICB0b2Rvcy5mb3JFYWNoKHRvZG8gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpID0gdGhpcy5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgICAgICAgICAgbGkuaWQgPSB0b2RvLmlkO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgY2hlY2tib3ggPSB0aGlzLmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgICAgICAgIGNoZWNrYm94LnR5cGUgPSBcImNoZWNrYm94XCI7XG4gICAgICAgICAgICAgICAgY2hlY2tib3guY2hlY2tlZCA9IHRvZG8uY29tcGxldGU7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzcGFuID0gdGhpcy5jcmVhdGVFbGVtZW50KFwic3BhblwiKSBhcyBIVE1MU3BhbkVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgc3Bhbi5jb250ZW50RWRpdGFibGUgPSAndHJ1ZSc7XG4gICAgICAgICAgICAgICAgc3Bhbi5jbGFzc0xpc3QuYWRkKFwiZWRpdGFibGVcIik7XG5cbiAgICAgICAgICAgICAgICBpZiAodG9kby5jb21wbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdHJpa2UgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoXCJzXCIpO1xuICAgICAgICAgICAgICAgICAgICBzdHJpa2UudGV4dENvbnRlbnQgPSB0b2RvLnRleHQ7XG4gICAgICAgICAgICAgICAgICAgIHNwYW4uYXBwZW5kKHN0cmlrZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IHRvZG8udGV4dDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVCdXR0b24gPSB0aGlzLmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwgXCJkZWxldGVcIik7XG4gICAgICAgICAgICAgICAgZGVsZXRlQnV0dG9uLnRleHRDb250ZW50ID0gXCJEZWxldGVcIjtcbiAgICAgICAgICAgICAgICBsaS5hcHBlbmQoY2hlY2tib3gsIHNwYW4sIGRlbGV0ZUJ1dHRvbik7XG5cbiAgICAgICAgICAgICAgICAvLyBBcHBlbmQgbm9kZXNcbiAgICAgICAgICAgICAgICB0aGlzLnRvZG9MaXN0LmFwcGVuZChsaSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERlYnVnZ2luZ1xuICAgICAgICBjb25zb2xlLmxvZyh0b2Rvcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfaW5pdExvY2FsTGlzdGVuZXJzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnRvZG9MaXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAodGFyZ2V0ICYmIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJlZGl0YWJsZVwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RlbXBvcmFyeVRvZG9UZXh0ID0gdGFyZ2V0LmlubmVyVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYmluZEFkZFRvZG8oaGFuZGxlcjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgKGV2ZW50OiBTdWJtaXRFdmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl90b2RvVGV4dCkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIodGhpcy5fdG9kb1RleHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2V0SW5wdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYmluZERlbGV0ZVRvZG8oaGFuZGxlcjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy50b2RvTGlzdC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAodGFyZ2V0ICYmIHRhcmdldC5jbGFzc05hbWUgPT09IFwiZGVsZXRlXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRFbGVtZW50ID0gdGFyZ2V0LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmVudEVsZW1lbnQgJiYgcGFyZW50RWxlbWVudC5pZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IHBhcmVudEVsZW1lbnQuaWQ7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYmluZEVkaXRUb2RvKGhhbmRsZXI6IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMudG9kb0xpc3QuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3Vzb3V0XCIsIChldmVudDogRm9jdXNFdmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgaWYgKHRhcmdldCAmJiB0aGlzLl90ZW1wb3JhcnlUb2RvVGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudEVsZW1lbnQgPSB0YXJnZXQucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50RWxlbWVudCAmJiBwYXJlbnRFbGVtZW50LmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gcGFyZW50RWxlbWVudC5pZDtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihpZCwgdGhpcy5fdGVtcG9yYXJ5VG9kb1RleHQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90ZW1wb3JhcnlUb2RvVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBiaW5kVG9nZ2xlVG9kbyhoYW5kbGVyOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLnRvZG9MaXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGV2ZW50OiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAodGFyZ2V0ICYmIHRhcmdldC50eXBlID09PSBcImNoZWNrYm94XCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRFbGVtZW50ID0gdGFyZ2V0LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmVudEVsZW1lbnQgJiYgcGFyZW50RWxlbWVudC5pZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IHBhcmVudEVsZW1lbnQuaWQ7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBUb2RvQ29udHJvbGxlciB9IGZyb20gXCJjb250cm9sbGVycy90b2RvLmNvbnRyb2xsZXJcIjtcbmltcG9ydCB7IFRvZG9TZXJ2aWNlIH0gZnJvbSBcInNlcnZpY2VzL3RvZG8uc2VydmljZVwiO1xuaW1wb3J0IHsgVG9kb1ZpZXcgfSBmcm9tIFwidmlld3MvdG9kby52aWV3c1wiO1xuXG5jb25zdCBhcHAgPSBuZXcgVG9kb0NvbnRyb2xsZXIobmV3IFRvZG9TZXJ2aWNlKCksIG5ldyBUb2RvVmlldygpKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==