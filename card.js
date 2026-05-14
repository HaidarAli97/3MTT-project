const cardTitle = document.getElementById('cardTitle');
const cardDescription = document.getElementById('cardDescription');
const cardPriority = document.getElementById('cardPriority');
const cardTag = document.getElementById('cardTag');

const storedCard = localStorage.getItem('selectedCard');
const cardData = storedCard ? JSON.parse(storedCard) : null;

if (cardData) {
  cardTitle.textContent = cardData.title;
  cardDescription.textContent = cardData.description;
  cardPriority.textContent = cardData.priority || 'Unknown';
  cardTag.textContent = cardData.tag || 'General';
} else {
  cardTitle.textContent = 'No card selected';
  cardDescription.textContent = 'Select a card from the board to inspect its details here.';
  cardPriority.textContent = '—';
  cardTag.textContent = '—';
}
