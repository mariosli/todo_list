import { v4 as uuidV4 } from "uuid";

type Task = {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}

const list = document.querySelector<HTMLUListElement>("#list");
//const form = document.querySelector<HTMLFormElement>("#new-task-form")
const form = document.getElementById("new-task-form") as HTMLFormElement | null; //Same thing as line above
const input = document.querySelector<HTMLInputElement>("#new-task-title");
const tasks: Task[] = loadTasks() //empty array to store our tasks
tasks.forEach(addListItem)

form?.addEventListener("submit", e => {
  e.preventDefault()

  if (input?.value == "" || input?.value == null) return

  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date()
  }
  tasks.push(newTask) //store new task into array

  addListItem(newTask)
  input.value = " " //remove previous input from the form
})

function addListItem(task: Task) {
  const item = document.createElement("li")
  item.id = `taskItem_${task.id}`
  const label = document.createElement("label")
  
  const remove = document.createElement("button")
  remove.innerHTML = "Remove"
  remove.addEventListener("click", () => {
    removeTask(task.id)
  })

  const checkbox = document.createElement("input")
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked
    console.log(task)
    saveTasks()
  })
  checkbox.type = "checkbox"
  checkbox.checked = task.completed

  label.append(checkbox, task.title, remove)
  item.append(label)
  list?.append(item)

  saveTasks()
}

function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks))
}

function removeTask(taskID: string) {
  const taskIndex = tasks.findIndex(task => task.id === taskID)

  if (taskIndex !== -1){
    // Remove the task from the tasks array
    tasks.splice(taskIndex, 1)

    saveTasks()

    const taskItem = document.getElementById(`taskItem_${taskID}`)
    if (taskItem) {
      taskItem.remove();
    }
  }
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS")
  if (taskJSON == null) return []
  return JSON.parse(taskJSON)
}