const board = document.getElementById('board');
const listCountLabel = document.getElementById('listCount');
const cardCountLabel = document.getElementById('cardCount');
const addListForm = document.getElementById('addListForm');
let draggedCard = null;

function refreshBoardMetrics() {
  const lists = board.querySelectorAll('.list');
  const cards = board.querySelectorAll('.card');
  listCountLabel.textContent = lists.length;
  cardCountLabel.textContent = cards.length;
  lists.forEach(updateListMeta);
}

function updateListMeta(list) {
  const count = list.querySelectorAll('.card').length;
  const meta = list.querySelector('.list-meta');
  if (meta) {
    meta.textContent = `${count} card${count === 1 ? '' : 's'}`;
  }
}

function makeCardDraggable(card) {
  card.addEventListener('dragstart', () => {
    draggedCard = card;
    card.classList.add('dragging');
  });

  card.addEventListener('dragend', () => {
    draggedCard = null;
    card.classList.remove('dragging');
    refreshBoardMetrics();
  });
}

function attachCardDetailLink(card) {
  const link = card.querySelector('.card-link');
  if (!link) {
    return;
  }

  link.addEventListener('click', () => {
    const cardData = {
      title: card.dataset.title || card.querySelector('h3')?.textContent || 'Task',
      description: card.dataset.description || card.querySelector('p')?.textContent || '',
      priority: card.dataset.priority || 'Normal',
      tag: card.dataset.tag || 'Task',
    };
    localStorage.setItem('selectedCard', JSON.stringify(cardData));
  });
}

function setUpListDrag(list) {
  const cardContainer = list.querySelector('.cards');

  cardContainer.addEventListener('dragover', (event) => {
    event.preventDefault();
    list.classList.add('drag-over');
  });

  cardContainer.addEventListener('dragleave', () => {
    list.classList.remove('drag-over');
  });

  cardContainer.addEventListener('drop', (event) => {
    event.preventDefault();
    list.classList.remove('drag-over');
    if (draggedCard && cardContainer !== draggedCard.parentElement) {
      cardContainer.appendChild(draggedCard);
    }
  });
}

function createCard(titleText) {
  const card = document.createElement('article');
  card.className = 'card';
  card.draggable = true;
  card.dataset.title = titleText;
  card.dataset.priority = 'Low';
  card.dataset.tag = 'Task';
  card.dataset.description = 'Move this card between lists to keep your workflow sharp.';
  card.innerHTML = `
    <div class="card-top">
      <span class="pill pill-soft">Task</span>
      <span class="priority low">Low</span>
    </div>
    <h3><a class="card-link" href="card-details.html">${titleText}</a></h3>
    <p>Move this card between lists to keep your workflow sharp.</p>
  `;
  makeCardDraggable(card);
  attachCardDetailLink(card);
  return card;
}

function initializeCardForms() {
  board.querySelectorAll('.card-form').forEach((form) => {
    const textarea = form.querySelector('textarea');
    const addButton = form.querySelector('.add-card-button');
    if (!addButton) {
      return;
    }

    addButton.addEventListener('click', () => {
      const value = textarea.value.trim();
      if (!value) {
        textarea.focus();
        return;
      }

      const card = createCard(value);
      form.closest('.list').querySelector('.cards').appendChild(card);
      textarea.value = '';
      refreshBoardMetrics();
    });
  });
}

function setUpLists() {
  board.querySelectorAll('.list').forEach((list) => {
    setUpListDrag(list);
    list.querySelectorAll('.card').forEach((card) => {
      makeCardDraggable(card);
      attachCardDetailLink(card);
    });
    updateListMeta(list);
  });
}

addListForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = addListForm.querySelector('input[name="title"]');
  const title = input.value.trim();
  if (!title) {
    input.focus();
    return;
  }

  const list = document.createElement('section');
  list.className = 'list';
  list.dataset.list = title.toLowerCase().replace(/\s+/g, '-');
  list.innerHTML = `
    <div class="list-header">
      <div>
        <h2>${title}</h2>
        <p class="list-meta">0 cards</p>
      </div>
      <span class="pill pill-quiet">New</span>
    </div>
    <div class="cards" aria-label="${title} cards"></div>
    <form class="card-form">
      <textarea placeholder="New task title" rows="2" required></textarea>
      <button type="button" class="add-card-button">Add task</button>
    </form>
  `;

  board.appendChild(list);
  setUpListDrag(list);
  initializeCardForms();
  refreshBoardMetrics();
  input.value = '';
});

window.addEventListener('DOMContentLoaded', () => {
  setUpLists();
  initializeCardForms();
  refreshBoardMetrics();
});
