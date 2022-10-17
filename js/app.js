"use strict";

// CRUD = Create (POST), Read (GET), Update (PUT), Delete (DELETE)

const root = document.querySelector("#root");

const screenBlock = document.createElement("div");
const screenInput = document.createElement("input");
const screenBtnAdd = document.createElement("button");
const listsBlock = document.createElement("div");

screenBlock.id = "screenBlock"
screenInput.type = "text";
screenInput.placeholder = "Type here...";
screenBtnAdd.textContent = "ADD";
listsBlock.id = "listsBlock";

root.prepend(screenBlock);
root.append(listsBlock);
screenBlock.append(screenInput, screenBtnAdd);

const url = "http://localhost:8888/todo/";

root.addEventListener("submit", function (e) {
	e.preventDefault();
	const val = screenInput.value.trim();

	if (val !== "") {
		fetch(url, {
			method: "POST",
			headers: {
				"content-type":"application/json"
			},
			body: JSON.stringify({title: val})
		});
	}

	this.reset();
});

fetch(url)
.then(data => data.json())
.then(data => {
	data.forEach((todo, id) => {
		listsBlock.innerHTML += `
			<div class="listsBlock__item" id=${todo.id}>
				<p>
					<span>${todo.id}</span>
					${todo.title}
				</p>
				<div>
					<button data-ed>Edit</button>
					<button data-rm>Remove</button>
				</div>
			</div>
		`;
	});

	return data;
})
.then(data => {
	const removeBtns = document.querySelectorAll("[data-rm]");
	removeBtns.forEach(btn => {
		btn.addEventListener("click", function () {
			this.parentElement.remove();

			data.forEach(todo => {
				fetch(url+todo.id, {
					method: "DELETE"
				});
			})
		});
	});
	return data
})
.then(data => {
	const editBtns = document.querySelectorAll("[data-ed]");
	editBtns.forEach((btn, i) => {
		btn.addEventListener("click", () =>
			editTodo(i + 1, data)
		)
	})
});


function editTodo(id, dataId){
	const editDiv = document.getElementById(`${id}`); 
	editDiv.innerHTML = ``
	const form = document.createElement("form");
	form.id = `edit${id}`
	const input = document.createElement("input");
	const inputButton = document.createElement("input");
	input.type = "text";
	input.className = "inputText"
	input.placeholder = "Type here...";
	input.name = "editName";
	inputButton.type = "submit";
	inputButton.className = "button";
	inputButton.value = "Edit";
	form.onsubmit = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const editName = formData.get('editName')
		dataId.forEach(todo => {
				if (id === todo.id) {
					fetch(url+todo.id, {
						method: "PUT",
						headers: {
							"content-type":"application/json"
						},
						body: JSON.stringify({title: editName})
					});
				}
			})
		

	}
	
	form.append(input, inputButton)
	editDiv.append(form)
}