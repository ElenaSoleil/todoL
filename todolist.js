let mesage = '';
let ind = 0;
let masToDo = document.getElementById("show-list");
show();

function showMas() {
	let result = [];
	ind = localStorage.length;
	for(let i=0; i<ind; i++) {
			//    здесь создается виртуальный DOM для оформления одной записи списка
			// 	с целью последующего его вывода на экран. (Данные выведутся из LocalStorage):		
			//		создается div-обертка, включающая в себя всю строку TODO
			//    все элементы строки (наименование дела, кнопка на удаление, отметка о выполнени)
			//    будут иметь один уникальный класс, который создан из ключа LocalStorage
			//    создаются вложенные в обертку три элемента: 
			//  	DIV, BUTTON, INPUT[checkbox] 
			let key = localStorage.key(i);  //выбираем ключ для объеденения зп
			let wrap = document.createElement('div');
			let doState = key.slice(0,4);
			wrap.className = doState + " item d-flex " + key;
			//		1-й элемент:
			let div = document.createElement('div');
			div.className = "itemList " + key;
			wrap.append(div);
			div.append(localStorage.getItem(key));
			//		2-й элемент:		
			let del = document.createElement('button');
			del.className = "del " + key;
			del.value = key;
			del.append('X');
			wrap.append(del);
			//		3-й элемент:
			let inpDone = document.createElement('input');
			inpDone.type = "checkbox";
			inpDone.id = "" + key;
			inpDone.label = "for=" + key;
			inpDone.className = "inputCheck " + key ;
			if (doState === "done") {
				inpDone.checked = true;
			}
			wrap.append(inpDone);
			//	записываем созданный виртуальный дом в result
			result.push(wrap);  //запись 
}
return result;
}
// показ
function show() {
	reshow();
	addListenerSubmit();
}
// обновление
function reshow() {
	let div = document.createElement('div');
	div.className = "table";
	masToDo.append(div);
	if (localStorage.length>0) {
		div.append(...showMas());
		mesage = "Add todolist:";
		addListenerDel();
		addListenerChecked();
	}
	else {
		mesage = "The list TODO is empty. Input TODO";
		ind = 0;
	}
	document.querySelector("h2").innerHTML = mesage;
}

function initStoreKey () {
	let storeItems = [];
	for(let i=0; i<localStorage.length; i++) {
		let itemList = {};
		let key = localStorage.key(i);
		let doState = key.slice(0,4);
		let storeValue = localStorage.getItem(key);
		let newKey = doState + i;
		itemList = {newKey, storeValue};
		storeItems.push(itemList);
	}
	localStorage.clear();
	
	for(let i=0; i<storeItems.length; i++) {
		keys = Object.keys(storeItems[i]);
		localStorage.setItem(storeItems[i].newKey, storeItems[i].storeValue);
	}
}
// слушает нажатие по клику
function addListenerDel () {
	let buttons = document.querySelectorAll('.del');
	buttons.forEach((btn) => {
		btn.addEventListener('click', (event) => {
			let delValue = event.target.value;  // высвечивает конкретный дим
			delete localStorage[delValue];
			let div = document.querySelector(".table");
			div.remove();
			initStoreKey();
			reshow();
			addListenerDel();
		} );
	})
}
// помечает Check
function addListenerChecked() {
	let valInputCheckeds = document.querySelectorAll(".inputCheck");
	valInputCheckeds.forEach((item) => {
		item.addEventListener('click', (event) => {   // слушаем событие
			let checkDone = event.target;
			let ch = ""+checkDone.id;
			let elems = document.getElementsByClassName(ch);
			if (checkDone.checked) {
				for(let i = 0; i < elems.length; i++ ){
					elems[i].classList.add("done");
					doState="done";
				}
			}
			else {
				for(let i = 0; i < elems.length; i++ ){
					if (elems[i].classList.contains("done")) {
					elems[i].classList.remove("done");
					doState="todo";
					}
				}
			} 
		
			let storeValue = localStorage.getItem(ch);
			delete localStorage[ch];
			let key=doState+ch.slice(4);
			localStorage.setItem(key, storeValue);
		})
	})
} 

function addListenerSubmit() {
	document.querySelector("form").addEventListener("submit", (event) => {
		event.preventDefault();
		let value = document.querySelector(".name").value;
		ind = localStorage.length;
		localStorage.setItem("todo"+ind,value);
		document.querySelector(".name").value = "";
		let div = document.querySelector(".table");
		div.remove();
		reshow();
		// addListenerDel();
	})
}
