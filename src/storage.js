import TodoList from './todolist'
import Project from './project'
import Todo from './todo'

class Storage {
  static saveTodoList(todoList) {
    localStorage.setItem('todoList', JSON.stringify(todoList))
  }

  static getTodoList() {
    const todoList = Object.assign(
      new TodoList(),
      JSON.parse(localStorage.getItem('todoList'))
    )

    todoList.setProjects(
      todoList
        .getProjects()
        .map((project) => Object.assign(new Project(), project))
    )

    todoList
      .getProjects()
      .forEach((project) =>
        project.setTodos(
          project.getTodos().map((todo) => Object.assign(new Todo(), todo))
        )
      )
    if (todoList.projects == []) {
      todoList = new TodoList()
    }
    return todoList
  }

  static deleteTodoList() {
    localStorage.clear()
  }
}

export default Storage
