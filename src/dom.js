import TodoList from './todolist'
import Project from './project'
import Todo from './todo'
import Storage from './storage'
import { format } from 'date-fns'
let switcher = 0
let currentProject

class Dom {
  static showProjects(todoList) {
    const projectsDiv = document.querySelector('.projects-container')
    const contentDiv = document.getElementById('content')
    const defaultProjectDiv = document.querySelector(
      '.default-project-container'
    )
    const inboxProjectDiv = defaultProjectDiv.querySelector('.inbox-container')
    const todayProjectDiv = defaultProjectDiv.querySelector('.today-container')
    const thisWeekProjectDiv = defaultProjectDiv.querySelector(
      '.this-week-container'
    )
    projectsDiv.innerText = ''
    inboxProjectDiv.innerText = ''
    todayProjectDiv.innerText = ''
    thisWeekProjectDiv.innerText = ''
    todoList.projects.forEach((project) => {
      const projectTitle = document.createElement('h3')
      const projectLogo = document.createElement('div')
      projectLogo.classList.add('project-logo')
      const xLogo = document.createElement('p')
      xLogo.innerHTML = ' <i class="fa-solid fa-xmark"></i>'
      xLogo.classList.add('logo-x')
      if (project.title == 'Inbox') {
        projectLogo.innerHTML = `<i class="fa-solid fa-inbox"></i>`
        projectTitle.innerText = project.title
        inboxProjectDiv.appendChild(projectLogo)
        inboxProjectDiv.appendChild(projectTitle)
        inboxProjectDiv.classList.add('project-container')
      } else if (project.title == 'Today') {
        projectLogo.innerHTML = `<i class="fa-solid fa-calendar-day"></i> `
        projectTitle.innerText = project.title
        todayProjectDiv.appendChild(projectLogo)
        todayProjectDiv.appendChild(projectTitle)
        todayProjectDiv.classList.add('project-container')
      } else if (project.title == 'This Week') {
        projectLogo.innerHTML = `<i class="fa-solid fa-calendar-week"></i>`
        projectTitle.innerText = project.title
        thisWeekProjectDiv.appendChild(projectLogo)
        thisWeekProjectDiv.appendChild(projectTitle)
        thisWeekProjectDiv.classList.add('project-container')
      } else {
        projectLogo.innerHTML = `<i class="fa-solid fa-list-check"></i>`
        const projectDiv = document.createElement('div')
        projectDiv.classList.add('project-container')
        projectTitle.innerText = project.title
        projectDiv.appendChild(projectLogo)
        projectDiv.appendChild(projectTitle)
        projectDiv.appendChild(xLogo)
        projectsDiv.appendChild(projectDiv)
        xLogo.onclick = () => {
          todoList.deleteProject(project.id)
          this.showProjects(todoList)
        }
      }
    })
    const projects = document.querySelectorAll('.project-container')
    projects.forEach(
      (project) =>
        (project.onclick = (e) => {
          currentProject = project.innerText
          Dom.showProjectContent(todoList, project.innerText)
        })
    )
    this.addProjectOption(todoList)
    Storage.saveTodoList(todoList)
  }

  static showProjectContent(todoList, projectTitle) {
    const project = todoList.getProject(projectTitle)
    const projectTitleDiv = document.querySelector('.project-title')
    const todosDiv = document.querySelector('.todos-container')
    projectTitleDiv.innerText = project.title
    todosDiv.innerText = ''
    project.todos.forEach((todo) => {
      const todoButton = document.createElement('button')
      const leftPart = document.createElement('div')
      const rightPart = document.createElement('div')
      const todoTitle = document.createElement('h3')
      const todoDueDate = document.createElement('p')
      const xLogo = document.createElement('p')
      xLogo.innerHTML = '<i class="fa-solid fa-xmark"></i>'
      xLogo.classList.add('logo-x')
      todoTitle.innerText = todo.title
      todo.dueDate == ''
        ? (todoDueDate.innerText = 'No Date')
        : (todoDueDate.innerText = todo.dueDate)
      xLogo.onclick = () => {
        todoList.deleteTodo(project.id, todo.id)
        this.showProjectContent(todoList, projectTitle)
      }
      todoButton.classList.add('todo-button')
      leftPart.classList.add('left-part-todo')
      rightPart.classList.add('right-part-todo')
      leftPart.appendChild(todoTitle)
      rightPart.appendChild(todoDueDate)
      rightPart.appendChild(xLogo)
      todoButton.appendChild(leftPart)
      todoButton.appendChild(rightPart)
      todoButton.dataset.id = todo.id
      todosDiv.appendChild(todoButton)
      todoTitle.onclick = () => {
        this.displayTitleChangeInput(todoList, leftPart)
        todoTitle.onclick = () => null
      }
      todoDueDate.onclick = () => {
        this.displayDateChangeInput(todoList, todoDueDate, todo.id)
        todoDueDate.onclick = () => null
      }
    })
    this.addTodoOption(todoList)
    Storage.saveTodoList(todoList)
  }

  static addProjectOption(todoList) {
    const nav = document.querySelector('nav')
    const addProjectDiv = document.querySelector('.add-project-container')
    addProjectDiv.innerText = ''
    const addProjectButton = document.createElement('button')
    addProjectButton.classList.add('add-project-button')
    addProjectButton.innerHTML = `<i class="fa-solid fa-plus"></i> Add Project`
    addProjectDiv.appendChild(addProjectButton)
    nav.appendChild(addProjectDiv)
    addProjectButton.onclick = () => {
      switcher = 1
      Dom.displayInputOption(todoList, addProjectDiv)
    }
  }

  static addTodoOption(todoList) {
    const content = document.getElementById('content')
    const addTodoDiv = document.querySelector('.add-todo-container')
    addTodoDiv.innerText = ''
    const addTodoButton = document.createElement('button')
    addTodoButton.classList.add('add-todo-button')
    addTodoButton.innerHTML = `<i class="fa-solid fa-plus"></i> Add Todo`
    addTodoDiv.appendChild(addTodoButton)
    addTodoButton.onclick = () => {
      switcher = 0
      Dom.displayInputOption(todoList, addTodoDiv)
    }
    Storage.saveTodoList(todoList)
  }

  static displayInputOption(todoList, element) {
    const input = document.createElement('input')
    input.type = 'text'
    input.id = 'add'
    const addButton = document.createElement('button')
    const cancelButton = document.createElement('button')
    addButton.innerText = 'Add'
    cancelButton.innerText = 'Cancel'
    addButton.classList.add('add-button')
    cancelButton.classList.add('cancel-button')
    const buttonsContainer = document.createElement('div')
    buttonsContainer.classList.add('buttons-container')
    buttonsContainer.appendChild(addButton)
    buttonsContainer.appendChild(cancelButton)
    cancelButton.onclick = () => {
      if (switcher == 1) {
        Dom.addProjectOption(todoList)
      } else {
        Dom.addTodoOption(todoList)
      }
    }
    addButton.onclick = () => {
      if (switcher == 1) {
        todoList.addProject(input.value)
        Dom.showProjects(todoList)
      } else {
        todoList.addTodo(todoList.getProject(currentProject).id, input.value)
        Dom.showProjectContent(todoList, currentProject)
      }
    }
    element.innerText = ''
    element.appendChild(input)
    element.appendChild(buttonsContainer)
    Storage.saveTodoList(todoList)
  }

  static displayTitleChangeInput(todoList, element) {
    const title = element.querySelector('h3')
    const titleValue = title.innerText
    const project = todoList.getProject(currentProject)
    const todo = project.getTodo(titleValue)
    const input = document.createElement('input')
    input.type = 'text'
    input.id = 'title-change'
    input.value = titleValue
    title.innerText = ''
    title.appendChild(input)
    document.onkeydown = (e) => {
      if (e.key == 'Enter') {
        title.innerText = input.value
        todo.title = title.innerText
        input.remove()
        this.showProjectContent(todoList, currentProject)
      }
    }

    input.onblur = () => {
      title.innerText = input.value
      todo.title = title.innerText
      input.remove()
      this.showProjectContent(todoList, currentProject)
    }
    Storage.saveTodoList(todoList)
  }

  static displayDateChangeInput(todoList, element, todoId) {
    const project = todoList.getProject(currentProject)
    const todo = project.getTodo(todoId)
    const input = document.createElement('input')
    input.type = 'date'
    input.id = 'due-date'
    element.innerText = ''
    element.appendChild(input)
    document.onkeydown = (e) => {
      if (e.key == 'Enter') {
        if (currentProject !== 'Today' && currentProject !== 'This Week') {
          todo.dueDate = input.value
          todoList.addToToday(todo)
          todoList.addToThisWeek(todo)
          this.showProjectContent(todoList, currentProject)
        } else {
          todo.dueDate = input.value
          this.showProjectContent(todoList, currentProject)
        }
      }
    }
    input.onblur = () => {
      todo.dueDate = input.value
      todoList.addToToday(todo)
      todoList.addToThisWeek(todo)
      this.showProjectContent(todoList, currentProject)
    }
    Storage.saveTodoList(todoList)
  }

  static isToday(date) {
    return date == format(new Date(), 'yyyy-MM-dd')
  }

  static isDateInThisWeek(date) {
    const todayObj = new Date()
    const todayDate = todayObj.getDate()
    const todayDay = todayObj.getDay()

    // get first date of week
    const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay))

    // get last date of week
    const lastDayOfWeek = new Date(firstDayOfWeek)
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6)

    // if date is equal or within the first and last dates of the week
    return (
      date >= format(firstDayOfWeek, 'yyyy-MM-dd') &&
      date <= format(lastDayOfWeek, 'yyyy-MM-dd')
    )
  }

  static showNavBar() {
    const nav = document.querySelector('nav')
    nav.classList.toggle('show')
  }
}

export default Dom
