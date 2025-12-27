// draggable-buttons.js - Mozgatható gombok (Adomány + Becsület kassza)

function makeDraggable(element, storageKey) {
  if (!element) return;

  let isDragging = false;
  let currentX, currentY, initialX, initialY;
  let xOffset = 0, yOffset = 0;

  // Betöltjük az elmentett pozíciót
  const savedPos = localStorage.getItem(storageKey);
  if (savedPos) {
    const { x, y } = JSON.parse(savedPos);
    element.style.right = 'auto';
    element.style.bottom = 'auto';
    element.style.top = 'auto';
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    xOffset = x;
    yOffset = y;
  }

  // Kurzor változtatás
  element.style.cursor = 'move';

  // Egér események
  element.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  // Touch események (mobil)
  element.addEventListener('touchstart', dragStart);
  document.addEventListener('touchmove', drag);
  document.addEventListener('touchend', dragEnd);

  function dragStart(e) {
    // Ne aktiválódjon ha a gombot kattintjuk (csak ha húzzuk)
    if (e.type === 'touchstart') {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }

    // Csak akkor induljon a drag, ha 5px-nél többet mozdítunk
    element.addEventListener('mousemove', checkDrag);
    element.addEventListener('touchmove', checkDrag);
  }

  function checkDrag(e) {
    if (e.type === 'touchmove') {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }

    // Ha 5px-nél többet mozdul, akkor draggingbe lépünk
    if (Math.abs(currentX) > 5 || Math.abs(currentY) > 5) {
      isDragging = true;
      element.style.position = 'fixed';
      element.style.right = 'auto';
      element.style.bottom = 'auto';
      element.removeEventListener('mousemove', checkDrag);
      element.removeEventListener('touchmove', checkDrag);
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();

      if (e.type === 'touchmove') {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
      } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
      }

      xOffset = currentX;
      yOffset = currentY;

      // Határokon belül tartás
      const rect = element.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;

      xOffset = Math.max(0, Math.min(xOffset, maxX));
      yOffset = Math.max(0, Math.min(yOffset, maxY));

      setTranslate(xOffset, yOffset, element);
    }
  }

  function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;

    if (isDragging) {
      // Pozíció mentése
      localStorage.setItem(storageKey, JSON.stringify({ x: xOffset, y: yOffset }));
      isDragging = false;
    }

    element.removeEventListener('mousemove', checkDrag);
    element.removeEventListener('touchmove', checkDrag);
  }

  function setTranslate(xPos, yPos, el) {
    el.style.left = xPos + 'px';
    el.style.top = yPos + 'px';
  }
}

// Inicializálás
document.addEventListener('DOMContentLoaded', () => {
  const donateBtn = document.getElementById('donateBtn');
  const honestyBox = document.getElementById('honestyBox');

  if (donateBtn) makeDraggable(donateBtn, 'donateBtn_position');
  if (honestyBox) makeDraggable(honestyBox, 'honestyBox_position');
});
