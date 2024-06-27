console.log(firebase);
const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInButton = document.getElementById('signInButton');
const signOutButton = document.getElementById('signOutButton');

const userDetails = document.getElementById('userDetails');

const provider = new firebase.auth.GoogleAuthProvider();

signInButton.onclick = () => auth.signInWithPopup(provider);

signOutButton.onclick = () => auth.signOut();

auth.onAuthStateChanged( user => {
  if(user){
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    userDetails.innerHTML = `<h3>Hi ${user.displayName}</h3>`
  }else{
    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
    userDetails.innerHTML = 'You are logged out.'
  }
});

const db = firebase.firestore();
const createThing = document.getElementById("createThing");
const thingsList = document.getElementById("thingsList");

let thingsref;
let unsubscribe;


auth.onAuthStateChanged( user => {
  if(user){
    thingsref = db.collection('things');
    createThing.onclick = () => {
      const {serverTimestamp} = firebase.firestore.FieldValue;
      thingsref.add({
        uid: user.uid,
        name: faker.commerce.productName(),
        createdAt: serverTimestamp()
      });
    }
    unsubscribe = thingsref.where('uid', '==', user.uid).orderBy('createdAt').onSnapshot(querySnapShot => {
      const items = querySnapShot.docs.map( doc => {
        return `<li>${doc.data().name}</li>`
      })
      thingsList.innerHTML = items.join('');
    });
  }else{
    unsubscribe && unsubscribe();
  }
});
