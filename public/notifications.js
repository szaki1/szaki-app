// notifications.js - Értesítési rendszer (JAVÍTOTT - MOBIL HANG)

import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, updateDoc, onSnapshot, collection, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let notificationPermission = false;
let serviceWorkerRegistration = null;
let notificationAudio = null; // ÚJ: Audio elem

// Notification hang betöltése
function initNotificationAudio() {
  if (notificationAudio) return;
  
  try {
    notificationAudio = new Audio();
    // Egyszerű csipogó hang data URL-ként
    notificationAudio.src = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADhAC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAA4SxPM6UAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
    notificationAudio.volume = 1.0;
    notificationAudio.load();
  } catch (error) {
    console.warn('⚠️ Audio init hiba:', error);
  }
}

// Service Worker regisztrálása
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
      return serviceWorkerRegistration;
    } catch (error) {
      console.error('❌ Service Worker regisztráció hiba:', error);
      return null;
    }
  } else {
    console.warn('⚠️ Service Worker nem támogatott');
    return null;
  }
}

// Értesítési engedély kérése
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.error("❌ Ez a böngésző nem támogatja az értesítéseket");
    alert("A böngésző nem támogatja az értesítéseket!");
    return false;
  }

  if (Notification.permission === "granted") {
    notificationPermission = true;
    await registerServiceWorker();
    initNotificationAudio();
    return true;
  }

  if (Notification.permission !== "denied") {
    // Javítás: helyes zárójelek és vesszők
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        notificationPermission = true;
        await registerServiceWorker();
        initNotificationAudio();
        playNotificationSound();
        showNotification('✅ Értesítések bekapcsolva!', {
          body: 'Mostantól értesítést kapsz minden új üzenetről.',
          tag: 'test-notification'
        });
        return true;
      } else {
        console.error('❌ Engedély megtagadva');
        alert("Az értesítések engedélyezése szükséges!");
      }
    } catch (error) {
      console.error("❌ Hiba történt az értesítési engedély kérés során:", error);
    }
  } else {
    console.error('❌ Engedély véglegesen megtagadva');
    alert("Az értesítések le vannak tiltva. Engedélyezd a böngésző beállításaiban!");
  }

  // Ellenőrzés privát böngészési módra
  if (navigator.storage && navigator.storage.estimate) {
    const { quota } = await navigator.storage.estimate();
    if (quota === 0) {
      alert("Privát böngészési mód korlátozhatja az értesítéseket. Kérjük, használj normál böngészési módot!");
      return false;
    }
  }

  return false;
}

// Böngésző értesítés küldése (mindig működik ha van engedély)
export function showNotification(title, options = {}) {
  console.log('📣 Értesítés küldése:', title, options);
  
  if (Notification.permission !== "granted") {
    console.warn('⚠️ Nincs értesítési engedély!');
    return;
  }

  const defaultOptions = {
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    ...options
  };

  try {
    // Service Worker értesítés (háttérben is működik)
    if (serviceWorkerRegistration) {
      serviceWorkerRegistration.showNotification(title, defaultOptions);
    } else {
      // Fallback: sima böngésző értesítés
      const notification = new Notification(title, defaultOptions);
      
      notification.onclick = function(event) {
        event.preventDefault();
        window.focus();
        notification.close();
      };
    }
    
    // CSIPOGÓ HANG LEJÁTSZÁSA (ha engedélyezve van)
    playNotificationSound();
    
  } catch (error) {
    console.error('❌ Értesítés hiba:', error);
  }
}

// Csipogó hang lejátszása (localStorage alapján)
function playNotificationSound() {
  const soundEnabled = localStorage.getItem('notificationSound') !== 'false'; // alapból BE
  
  if (!soundEnabled) {
    console.log('🔇 Hang kikapcsolva');
    return;
  }
  
  try {
    // Audio elem használata (mobil-barát!)
    if (!notificationAudio) {
      initNotificationAudio();
    }
    
    if (notificationAudio) {
      // Reset ha már játszott
      notificationAudio.currentTime = 0;
      
      // Lejátszás promise-szal
      const playPromise = notificationAudio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
          })
          .catch(error => {
            console.warn('⚠️ Hang lejátszás hiba:', error.message);
            // Próbáljuk AudioContext-tel
            fallbackBeep();
          });
      }
    } else {
      fallbackBeep();
    }
    
  } catch (error) {
    console.error('❌ Hang lejátszási hiba:', error);
    fallbackBeep();
  }
}

// Fallback: AudioContext csipogás (ha Audio elem nem működik)
function fallbackBeep() {
  try {
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.value = 1000;
    osc.type = 'square';
    
    gain.gain.setValueAtTime(0.5, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.2);
    
  } catch (err) {
    console.error('❌ Fallback is sikertelen:', err);
  }
}

// Új üzenetek figyelEse (JAVÍTOTT - hangos értesítés)
export function watchNewMessages(userId, role) {
  
  const chatsRef = collection(db, "chats");
  const field = role === "szaki" ? "szakiId" : "megrId";
  
  const q = query(
    chatsRef,
    where(field, "==", userId),
    orderBy("lastAt", "desc")
  );

  let initialized = false;

  // Add error handling for Firestore query
  return onSnapshot(q, (snapshot) => {
    try {
      snapshot.docChanges().forEach((change) => {
        const chat = change.doc.data();
        
        if (!initialized) {
          return;
        }
        
        if ((change.type === "modified" || change.type === "added") && chat.lastSender !== userId) {
          showNotification('💬 Új üzenet érkezett!', {
            body: chat.lastMessage || 'Új üzeneted van',
            tag: 'new-message-' + change.doc.id,
            requireInteraction: true,
            vibrate: [300, 100, 300, 100, 300],
            data: { 
              url: role === "szaki" ? '/szaki-inbox.html' : '/megrendelo-inbox.html' 
            }
          });
          
          try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBz2Z3vPMfC0FKHzM8+GVSQwYbsHy3ZNEDRVktuXqqlYRDU+n5fK6ayQIO5ja8s19MAUshM70340+CxFbsefor1oSEVSr5vK9cCkISqPl87Z2KQU6ktzy0IU3CRtxwvPknU0PGnC75+m1ZhgQVq3l8bllHAU3jdXyzoEuBSuBzvPWiTYIGGe56+OdTQ0OUKXh8bllHAY4lNn0zX4vBSp+zfPglEYLF2u6a+adUBEPVK7m87dmGQZApuXyvHIpBTyT2PLNfS8FLIHPMy31JTJzuO/qsWYdEFex5u++eC0GPovc8tGAPQggdML15p5QERM+obm6bSAHN47X88l+LgUugM/z2Ik3CRpmue3ln1INDlKo5PG5Zh0FN47Y8s1/MAUZW6znqVQTDk6k5PG4ZhsFOZLY8sx8LgYqgM301oY2CRpqvO/poVUSEE+m5PK8byoHPJXb8s5+LwUsgc700og1CRtnuevlnk4NDlCl4/K4ZRsFOJDX8smALgUrf9Dz1IU1CRlmue3koVMQDk+l5PKzcCcFOJHY8syAMAUqfsz0z4A0CRhnuuvjnFAODVGm5fO3bCMGOZDZ8s5/LwUthM700IQzCRdltOrioVMRD1Oo5fK4aCAHOpHY8s1+LwUshM700Yg2CRpovO/poVQSEE6m5fO4ayIGO5LZ8sx8LwUsgc7zzn8wBSh+zPPehzUIGGS45ei1bCMHO5HY8suCMQUnfcz0z4EzCBhouuzkoVMQDk+l5POycCcFOJHY8syAMAUqgM7z1IY3CRlmue3loVQSEE6m5fK6byoHPJPY8s19LgUsgc700Yc2CRlnu+3mn1INDlGl5PO4ZhwFN47Y8s1+LgUthM700IY2CRlnuuvjnk8ODlCl5fK4ZRsFOJHY8suBLwUpf8300IQzCRdltOrhoVMRD06l5PK5aCAGOZDZ8s1+LwUshM700IY3CRpovO/qoVMRD0+m5fO3bCMGOZDY8s5+LwUthM701Ik3CRtnuuvjnU4ODlCl5PK4aCAFN4/Y8s1/MAUpgM7zzn4wBSiAzvPRiDYJGWa56+adTg4OUqXk8rhnHQU3jdXzzn8wBSuBz/PWiDUIGGa56+SdUA4OUqXk8rhlHQU4kNjyz4AxBSp/zfPgiTcJGWi76+OdTg4OUqXl8rhlHAU3j9Xyz4EvBSuAz/PXiDUIGGe56+OdTw4OUaXk8rhlHAU4j9jyz4ExBSl/zPPfiDUJGWi76+SdTw4OUaXj8rhlHAU4kNjy0IEvBSuAzvPWiTUIGWW56+WeTw4PUaXk8rhlHAU3j9jyz4AxBSp/zfPeh/b/');
            audio.volume = 0.5;
            audio.play().catch(e => {});
          } catch (e) {
            console.error("❌ Error playing notification sound:", e);
          }
        }
      }
    } catch (error) {
      console.error("❌ Error in watchNewMessages snapshot:", error);
    }

    initialized = true;
  }, (error) => {
    console.error('❌ Üzenetfigyelés hiba:', error);
  });
}

// Értékelés változás figyelése
export function watchRatingChanges(userId) {
  const userRef = doc(db, "users", userId);
  let lastRating = null;
  let lastRecommendations = null;

  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      const currentRating = data.rating || 0;
      const currentRecs = data.recommendations || 0;

      // Értékelés változott
      if (lastRating !== null && currentRating > lastRating) {
        showNotification('⭐ Új értékelés!', {
          body: `Új értékelésedet kaptál! Jelenlegi: ${currentRating.toFixed(1)} ⭐`,
          tag: 'new-rating'
        });
      }

      // Ajánlás számláló nőtt
      if (lastRecommendations !== null && currentRecs > lastRecommendations) {
        showNotification('👍 Új ajánlás!', {
          body: `Valaki ajánlott téged! Összesen: ${currentRecs} ajánlás`,
          tag: 'new-recommendation'
        });
      }

      lastRating = currentRating;
      lastRecommendations = currentRecs;
    }
  });
}

// Kiemelés lejárat figyelmezetés (24 óra előtt)
export function watchFeaturedExpiration(userId) {
  const userRef = doc(db, "users", userId);
  let alreadyWarned = false;

  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      if (data.featured && data.featuredUntil?.toDate) {
        const expirationDate = data.featuredUntil.toDate();
        const now = new Date();
        const hoursUntilExpiration = (expirationDate - now) / (1000 * 60 * 60);

        // Ha 24 órán belül lejár és még nem figyelmeztettük
        if (hoursUntilExpiration > 0 && hoursUntilExpiration <= 24 && !alreadyWarned) {
          const daysLeft = Math.ceil(hoursUntilExpiration / 24);
          showNotification('⏰ Kiemelés lejár!', {
            body: `A KIEMELT státuszod ${daysLeft} napon belül lejár. Hosszabbítsd meg a dashboard-on!`,
            tag: 'featured-expiration',
            requireInteraction: true
          });
          alreadyWarned = true;
        }

        // Reset ha lejárt
        if (hoursUntilExpiration <= 0) {
          alreadyWarned = false;
        }
      }
    }
  });
}

// Minden értesítés inicializálása (szakiknak ÉS megrendelőknek)
export async function initNotifications() {
  // Ellenőrizzük van-e már engedély
  if (Notification.permission === "granted") {
    notificationPermission = true;
    await registerServiceWorker();
  }

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      return;
    }

    // Javítás: helyes szintaxis a catch blokkban
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        return;
      }

      const userData = userDoc.data();
      const role = userData.role;

      if (Notification.permission === "granted") {
        watchNewMessages(user.uid, role);

        if (role === "szaki") {
          watchRatingChanges(user.uid);
          watchFeaturedExpiration(user.uid);
        }
      }
    } catch (error) {
      console.error("❌ Hiba történt az értesítések inicializálása során:", error);
    }
  });
}

