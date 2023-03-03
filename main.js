// наша API для запросов
const API = "http://localhost:8000/emotions";

// для добавдение карточек
const list = document.querySelector("#emotions-list");

const addForm = document.querySelector("#add-form");
const titleInp = document.querySelector("#title");
const descriptionInp = document.querySelector("#description");
const ImageInp = document.querySelector("#image");
const priceInp = document.querySelector("#price");

// для инпутов из модалки
const editTitleInp = document.querySelector("#edit-title");
const editDescriptionInp = document.querySelector("#edit-descr");
const editImageInp = document.querySelector("#edit-image");
const editPriceInp = document.querySelector("#edit-price");
const editSaveBtn = document.querySelector("#btn-save-edit");

// инпут для поиска
const searchInput = document.querySelector("#search");
// для запроса на поиск
let searchVal = "";

// пагинация
const pagination = document.querySelector(".pagina");
const pred = document.querySelector(".pred");
const sled = document.querySelector(".sled");

const minimmum = 3;

let nowPage = 1;

let maxPage = 1;

// первоначальное отображение данных
getEmotion();

// Для стягивание данные с db.json
async function getEmotion() {
  // Для стягивание данные с db.json
  // _page получить данные на определенной странице
  const res = await fetch(
    `${API}?title_like=${searchVal}&_limit=${minimmum}&_page=${nowPage}`
  );
  // x-total-count общее количество продуктов
  const count = res.headers.get("x-total-count");
  // формула чтобы высчитать максимальное количество страниц
  maxPage = Math.ceil(count / minimmum);
  const data = await res.json(); //расшифровка данных
  render(data);
}

// функция для удаление
async function deleteEmotions(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  getEmotion();
}

// функция для получение одного продукта
async function getOneEmotion(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();
  return data;
}

// для добавление
async function addEmotion(emotion) {
  await fetch(API, {
    method: "POST",
    body: JSON.stringify(emotion),
    headers: {
      "Content-Type": "application/json",
    },
  });
  getEmotion();
}

// функция для измененения
async function editEmotions(id, editedEmotion) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editedEmotion),
    headers: {
      "Content-Type": "application/json",
    },
  });
  getEmotion();
}

// функция для отображение данных из db.json на странице
function render(arr) {
  list.innerHTML = "";
  arr.forEach((item) => {
    list.innerHTML += `
        <div class='card m-5 ' style='width: 18rem'>
        <img src=${item.image}class="card-img-top" alt='...'
        />
        <div class='card-body'>
        <h5 class = "card-title">${item.title}</h5>
        <p class='card-text'>${item.description.slice(0, 70)}...</p>
        <p class='card-price'>$ ${item.price}</p>
        <button id='${
          item.id
        }' class='btn btn-primary btn-delete'>DELETE</button>
        <button data-bs-toggle='modal' data-bs-target='#exampleModal' id='${
          item.id
        }' class='btn btn-primary btn-edit'>EDIT</button>
        </div>
        </div>`;
  });
  //   функция пагинации
  renderPaginatia();
}

// для удаление
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    deleteEmotions(e.target.id);
  }
});
let id = null;

//  для добавлеине
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-edit")) {
    id = e.target.id;
    const emotion = await getOneEmotion(e.target.id);
    editTitleInp.value = emotion.title;
    editDescriptionInp.value = emotion.description;
    editImageInp.value = emotion.image;
    editPriceInp.value = emotion.price;
  }
});

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    !titleInp.value.trim() ||
    !descriptionInp.value.trim() ||
    !ImageInp.value.trim()
  ) {
    alert("Заполните поля");
    return;
  }
  const emotion = {
    title: titleInp.value,
    description: descriptionInp.value,
    price: priceInp.value,
    image: ImageInp.value,
  };
  addEmotion(emotion);
  titleInp.value = "";
  descriptionInp.value = "";
  priceInp.value = "";
  ImageInp.value = "";
});

// для сохранение данных
editSaveBtn.addEventListener("click", (e) => {
  if (
    !editTitleInp.value.trim() ||
    !editDescriptionInp.value.trim() ||
    !editPriceInp.value.trim() ||
    !editImageInp.value.trim()
  ) {
    alert("Заполните поле ");
    return;
  }

  const editedEmotion = {
    title: editTitleInp.value,
    description: editDescriptionInp.value,
    price: editPriceInp.value,
    image: editImageInp.value,
  };
  editEmotions(id, editedEmotion);
});

searchInput.addEventListener("input", () => {
  searchVal = searchInput.value;
  nowPage = 1;
  getEmotion();
});

//? функция для отображения кнопок для пагинации
function renderPaginatia() {
  pagination.innerHTML = "";
  for (let i = 1; i <= maxPage; i++) {
    pagination.innerHTML += `<li class="page-item ${
      nowPage == i ? "active" : ""
    }">
          <button class="page-link page_number">${i}</button>
      </li>`;
    //? чтобы кнопка pred была неактивна на первой странице
    if (nowPage == 1) {
      pred.classList.add("disabled");
    } else {
      pred.classList.remove("disabled");
    }
    //? чтобы кныопка pred была неактивна на последней странице
    if (nowPage == maxPage) {
      sled.classList.add("disabled");
    } else {
      sled.classList.remove("disabled");
    }
  }
}
// обработчик события чтобы перейти на определенную страницу
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("page_number")) {
    nowPage = e.target.innerText;
    getEmotion();
  }
});
// обработчик события чтобы перейти на следующую страницу
sled.addEventListener("click", () => {
  if (nowPage == maxPage) {
    return;
  }
  nowPage++;
  getEmotion();
});
// обработчик события чтобы перейти на предыдущую страницу
pred.addEventListener("click", () => {
  if (nowPage == 1) {
    return;
  }
  nowPage--;
  getEmotion();
});
