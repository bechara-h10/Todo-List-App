import Todo from './todo'

class Project {
  constructor(title = '') {
    this.id = Date.now()
    this.title = title
    this.todos = []
  }

  addTodo(todoTitle) {
    this.todos.push(new Todo(todoTitle))
  }

  addFullTodo(todoTitle, todoDueDate) {
    this.todos.push(new Todo(todoTitle, todoDueDate))
  }

  deleteTodo(todoId) {
    this.todos = this.todos.filter((todo) => todo.id != todoId)
  }

  setTitle(title) {
    this.title = title
  }

  getTodo(todoId) {
    const result = this.todos.filter((todo) =>
      todo.id == todoId ? todo : null
    )
    return result[0]
  }

  getTodos() {
    return this.todos
  }

  setTodos(todos) {
    this.todo = todos
  }
}

export default Project
