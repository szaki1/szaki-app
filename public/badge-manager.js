// badge-manager.js - PWA Badge kezelés új üzeneteknél

let unreadCount = 0;

// Badge frissítése
export function updateBadge(count) {
  unreadCount = count;
  
  console.log('🔔 Badge frissítés:', count);
  
  if ('setAppBadge' in navigator) {
    if (count > 0) {
      navigator.setAppBadge(count).then(() => {
        console.log('✅ Badge beállítva:', count);
      }).catch((err) => {
        console.warn('⚠️ Badge hiba:', err);
      });
    } else {
      navigator.clearAppBadge().then(() => {
        console.log('✅ Badge törölve');
      });
    }
  } else {
    console.warn('⚠️ setAppBadge nem támogatott ebben a böngészőben');
  }
}

// Badge törlése
export function clearBadge() {
  updateBadge(0);
}

// Új üzenet badge növelés
export function incrementBadge() {
  updateBadge(unreadCount + 1);
}

// Badge csökkentés (üzenet elolvasva)
export function decrementBadge() {
  if (unreadCount > 0) {
    updateBadge(unreadCount - 1);
  }
}
