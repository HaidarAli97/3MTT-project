const launchButton = document.getElementById('launchBoard');

if (launchButton) {
  launchButton.addEventListener('click', () => {
    window.location.href = 'board.html';
  });
}
