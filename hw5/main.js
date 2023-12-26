'use strict';

function Task(id, name, desc, status) {

    this.id = id;
    this.name = name;
    this.desc = desc;
    this.status = status;

    this.save = function () {
        localStorage.setItem(`task-${this.id}`, JSON.stringify(this));
        if (!this.element.isConnected) {
            this.addElementToDocument();
        } else {
            this.updateTaskElement()
        }
        return this;
    }

    this.remove = function () {
        localStorage.removeItem(`task-${this.id}`);
        if (this.element) {
            this.element.remove();
        }
    }

    this.createTaskElement = function () {
        let template = document.getElementById('task-template');
        let newTaskElement = template.content.firstElementChild.cloneNode(true);
        newTaskElement.id = this.id;
        newTaskElement.querySelector('.task-name').innerHTML = this.name;
        for (let btn of newTaskElement.querySelectorAll('.move-btn')) {
            btn.onclick = moveBtnHandler;
        }
        return newTaskElement;
    }

    this.element = document.getElementById(id) || this.createTaskElement();

    this.updateTaskElement = function () {
        this.element.querySelector('.task-name').textContent = this.name;
        this.element.querySelector('.task-description').textContent = this.desc;
    }

    this.addElementToDocument = function () {
        let listElement = document.getElementById(`${this.status}-list`);
        listElement.append(this.element);
    }

}

function TaskManager() {
    this.taskCounter = 0;

    this.createTask = function (name, desc, status) {
        let task = new Task(this.taskCounter++, name, desc, status);
        return task.save();
    }

    this.findTaskById = function (id) {
        let data = JSON.parse(localStorage.getItem(`task-${id}`));
        return new Task(data.id, data.name, data.desc, data.status);
    }

    this.getAllTasks = function () {
        let res = [];
        let maxId = 0;
        for (let key in {...localStorage}) {
            res.push(this.findTaskById(key.slice(5)));
            maxId = Math.max(maxId, res.at(-1).id);
        }
        this.taskCounter = maxId + 1;
        return res;
    }
}

function moveBtnHandler(event) {
    let taskElement = event.target.closest('.task');

    let task = taskManager.findTaskById(taskElement.id);
    task.status = task.status == 'to-do' ? 'done' : 'to-do';
    task.save();

    let targetContainer = document.getElementById(`${task.status}-list`);
    targetContainer.append(taskElement);
}

function deleteTaskBtnHandler(event) {
    let form = event.target.closest('.modal').querySelector('form');
    let task = taskManager.findTaskById(form.elements['task-id'].value);
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

function showAlert(msg, category='success') {
    let alerts = document.querySelector('.alerts');
    let template = document.getElementById('alert-template');
    let newAlert = template.content.firstElementChild.cloneNode(true);
    newAlert.querySelector('.msg').innerHTML = msg;
    alerts.append(newAlert);
}

function updateTasksCounters(event) {
    let columnElement = event.target.closest('.card');
    let tasksCounterElement = columnElement.querySelector('.tasks-counter');

    tasksCounterElement.innerHTML = columnElement.querySelector('ul').children.length;
}

function actionTaskBtnHandler(event) {
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
        task = taskManager.findTaskById(taskId);
        task.name = name;
        task.desc = desc;
        task.save();
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

    for (let task of taskManager.getAllTasks()) {
        task.addElementToDocument();
    };

    document.querySelector('.action-task-btn').onclick = actionTaskBtnHandler;

    for (let btn of document.querySelectorAll('.move-btn')) {
        btn.onclick =  moveBtnHandler;
    }

    document.getElementById('task-modal').addEventListener('show.bs.modal', function (event) {
        let form = this.querySelector('form');
        resetForm(form)

        let action = event.relatedTarget.dataset.action || 'create';

        form.elements['action'].value = action;
        this.querySelector('.modal-title').textContent = titles[action];
        this.querySelector('.action-task-btn').textContent = actionBtnText[action];

        if (action == 'edit' || action == 'show') {
            let task = taskManager.findTaskById(event.relatedTarget.closest('.task').id);
            setFormValues(form, task);
            this.querySelector('select').closest('.mb-3').classList.add('d-none');
        }

        if (action == 'show') {
            form.elements['name'].classList.add('form-control-plaintext');
            form.elements['description'].classList.add('form-control-plaintext');
        }

    });

    document.getElementById('remove-task-modal').addEventListener('show.bs.modal', function (event) {
        let task = taskManager.findTaskById(event.relatedTarget.closest('.task').id);
        let form = this.querySelector('form');
        form.elements['task-id'].value = task.id;
        this.querySelector('.task-name').textContent = task.name;
    });

    document.querySelector('.delete-task-btn').onclick = deleteTaskBtnHandler;

}