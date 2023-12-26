'use strict';

const server = "http://tasks-api.std-900.ist.mospolytech.ru/";
const api = "50d2199a-42dc-447d-81ed-d68a443b697e";

function genURL(path) {
    let url = new URL(`${server}/api/${path}`);
    url.searchParams.set("api_key", api);
    return url;
}

function Task(id, name, desc, status) {

    this.id = id;
    this.name = name;
    this.desc = desc;
    this.status = status;

    this.save = async function (update = false) {
        let path = "tasks" + (update ? `/${this.id}` : "");
        let url = genURL(path);
        let form = new FormData();
        form.append("name", this.name);
        form.append("desc", this.desc);
        form.append("status", this.status);

        let reqMethod = update ? "PUT" : "POST"

        let response = await fetch(url, {
            method: reqMethod,
            body: form
        });
        if (response.ok) {
            if (!this.element.isConnected) {
                let json = await response.json();
                this.id = json.id;
                this.name = json.name;
                this.desc = json.desc;
                this.status = json.status;
                this.addElementToDocument();
            } else {
                this.updateTaskElement();
            }
            return this;
        } else {
            showAlert("Ошибка " + response.status);
        }
    };

    this.remove = async function () {
        let url = genURL(`tasks/${this.id}`);
        let response = await fetch(url, {
            method: "DELETE"
        }).then(() => {
            this.element.remove();
        });

        if (this.element) {
            this.element.remove();
        }
    };

    this.createTaskElement = function () {
        let template = document.getElementById('task-template');
        let newTaskElement = template.content.firstElementChild.cloneNode(true);
        newTaskElement.id = this.id;
        newTaskElement.querySelector('.task-name').innerHTML = this.name;
        for (let btn of newTaskElement.querySelectorAll('.move-btn')) {
            btn.onclick = moveBtnHandler;
        }
        return newTaskElement;
    };

    this.element = document.getElementById(id) || this.createTaskElement();

    this.updateTaskElement = function () {
        this.element.querySelector('.task-name').textContent = this.name;
        this.element.querySelector('.task-description').textContent = this.desc;
    };

    this.addElementToDocument = function () {
        let listElement = document.getElementById(`${this.status}-list`);
        listElement.append(this.element);
        this.element.setAttribute("id", this.id);
    };

}

function TaskManager() {
    this.taskCounter = 0;

    this.createTask = function (name, desc, status) {
        let task = new Task(this.taskCounter++, name, desc, status);
        task.save().then(data => { });
        return task;
    };

    this.findTaskById = async function (id) {
        let url = genURL(`tasks/${id}`);
        let res = await fetch(url);
        if (res.ok) {
            let json = await res.json();
            return new Task(json.id, json.name, json.desc, json.status);
        }
    };

    this.getAllTasks = async function () {
        let res = await fetch(genURL("tasks"));
        let tasksList = [];

        if (res.ok) {
            let json = await res.json();
            for (let task of json.tasks) {
                tasksList.push(new Task(task.id, task.name, task.desc, task.status));
            }
            return tasksList;
        } else {
            showAlert("Ошибка обращения к серверу: " + res.status, "error");
        }

    };
}

async function moveBtnHandler(event) {
    let taskElement = event.target.closest('.task');

    let task = await taskManager.findTaskById(taskElement.id);
    task.status = task.status == 'to-do' ? 'done' : 'to-do';
    task.save(true);

    let targetContainer = document.getElementById(`${task.status}-list`);
    targetContainer.append(taskElement);
}

async function deleteTaskBtnHandler(event) {
    let form = event.target.closest('.modal').querySelector('form');
    let task = await taskManager.findTaskById(form.elements['task-id'].value);
    task.remove();
}

function resetForm(form) {
    form.reset();
    form.querySelector('select').closest('.mb-3').classList.remove('d-none');
    form.elements['name'].classList.remove('form-control-plaintext');
    form.elements['description'].classList.remove('form-control-plaintext');
}

function setFormValues(form, task) {
    form.elements['name'].value = task.name
    form.elements['description'].value = task.desc;
    form.elements['task-id'].value = task.id;
}

function showAlert(msg, category = 'success') {
    let alerts = document.querySelector('.alerts');
    let template = document.getElementById('alert-template');
    let newAlert = template.content.firstElementChild.cloneNode(true);
    newAlert.querySelector('.msg').innerHTML = msg;
    alerts.append(newAlert);
    setTimeout(() => newAlert.remove(), 3000);
}

function updateTasksCounters(event) {
    let columnElement = event.target.closest('.card');
    let tasksCounterElement = columnElement.querySelector('.tasks-counter');

    tasksCounterElement.innerHTML = columnElement.querySelector('ul').children.length;
}

async function actionTaskBtnHandler(event) {
    let alertMsg, form, action, name, desc, status, task, taskId;

    form = this.closest('.modal').querySelector('form');
    action = form.elements['action'].value;
    name = form.elements['name'].value;
    desc = form.elements['description'].value;
    status = form.elements['column'].value;
    taskId = form.elements['task-id'].value;

    if (action == 'create') {
        task = taskManager.createTask(name, desc, status);
        alertMsg = `Задача ${task.name} была успешно создана!`;
    } else if (action == 'edit') {
        task = await taskManager.findTaskById(taskId);
        task.name = name;
        task.desc = desc;
        task.save(true);
        alertMsg = `Задача ${name} была успешно обновлена!`;
    }

    if (alertMsg) {
        showAlert(alertMsg, 'success');
    }

    form.reset();
    form.elements['column'].classList.remove('d-none');
}

let titles = {
    'create': 'Создание новой задачи',
    'edit': 'Редактирование задачи',
    'show': 'Просмотр задачи'
};

let actionBtnText = {
    'create': 'Создать',
    'edit': 'Сохранить',
    'show': 'Ок'
};

let taskManager = new TaskManager();

window.onload = function () {
    for (let list of document.querySelectorAll('#done-list, #to-do-list')) {
        list.addEventListener('DOMSubtreeModified', updateTasksCounters);
    }

    taskManager.getAllTasks().then(data => {
        for (let task of data) {
            task.addElementToDocument();
        }
    }, () => {
        console.log("ERROR");
    });

    document.querySelector('.action-task-btn').onclick = actionTaskBtnHandler;

    for (let btn of document.querySelectorAll('.move-btn')) {
        btn.onclick = moveBtnHandler;
    }

    document.getElementById('task-modal').addEventListener('show.bs.modal', async function (event) {
        let form = this.querySelector('form');
        resetForm(form);

        let action = event.relatedTarget.dataset.action || 'create';

        form.elements['action'].value = action;
        this.querySelector('.modal-title').textContent = titles[action];
        this.querySelector('.action-task-btn').textContent = actionBtnText[action];

        if (action == 'edit' || action == 'show') {
            let task = await taskManager.findTaskById(event.relatedTarget.closest('.task').id);
            setFormValues(form, task);
            this.querySelector('select').closest('.mb-3').classList.add('d-none');
        }

        if (action == 'show') {
            form.elements['name'].classList.add('form-control-plaintext');
            form.elements['description'].classList.add('form-control-plaintext');
        }

    });

    document.getElementById('remove-task-modal').addEventListener('show.bs.modal', async function (event) {
        let task = await taskManager.findTaskById(event.relatedTarget.closest('.task').id);
        let form = this.querySelector('form');
        form.elements['task-id'].value = task.id;
        this.querySelector('.task-name').textContent = task.name;
    });

    document.querySelector('.delete-task-btn').onclick = deleteTaskBtnHandler;

};