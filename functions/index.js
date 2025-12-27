const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// When a review is created, update user's reviewsCount, reviewsSum and rating atomically
exports.onReviewCreate = functions.firestore
  .document('reviews/{reviewId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (!data || !data.toUid || typeof data.rating !== 'number') return null;
    const userRef = db.collection('users').doc(data.toUid);

    await db.runTransaction(async (tx) => {
      const userDoc = await tx.get(userRef);
      const cur = userDoc.exists ? userDoc.data() : {};
      const prevCount = Number(cur.reviewsCount || 0);
      const prevSum = Number(cur.reviewsSum || 0);
      const newCount = prevCount + 1;
      const newSum = prevSum + Number(data.rating || 0);
      const newAvg = newCount ? (newSum / newCount) : 0;

      tx.set(userRef, {
        reviewsCount: newCount,
        reviewsSum: newSum,
        rating: Math.round(newAvg * 10) / 10
      }, { merge: true });
    });

    return null;
  });

// When a recommendation is created, increment recommendations counter
exports.onRecommendationCreate = functions.firestore
  .document('recommendations/{recId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (!data || !data.toUid) return null;
    const userRef = db.collection('users').doc(data.toUid);
    await userRef.update({ recommendations: admin.firestore.FieldValue.increment(1) }).catch(() => {
      // If update fails (e.g. doc missing), set initial value
      return userRef.set({ recommendations: 1 }, { merge: true });
    });
    return null;
  });
