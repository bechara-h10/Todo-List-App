import { format, compareAsc } from 'date-fns'

class Todo {
  constructor(title = '', dueDate = '') {
    this.id = Date.now()
    this.title = title
    this.dueDate = dueDate
  }

  setTitle(title) {
    this.title = title
  }

  setDueDate(dueDate) {
    this.dueDate = dueDate
  }
}

export default Todo
