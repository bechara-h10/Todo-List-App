import style from './style.css'
import Todo from './todo'
import TodoList from './todolist'
import Project from './project'
import Dom from './dom'
import Storage from './storage'

const navBarShow = document.querySelector('.nav-bar-show')
navBarShow.addEventListener('click', Dom.showNavBar)
const todoList = Storage.getTodoList()
todoList.checkToday()
todoList.checkThisWeek()
Dom.showProjects(todoList)
const clearButton = document.querySelector('.clear-button')
clearButton.addEventListener('click', () => {
  let deleteTodoList = confirm('Are you sure you want to clear your todo list')
  if (deleteTodoList) {
    Storage.deleteTodoList()
    location.reload()
  }
})
