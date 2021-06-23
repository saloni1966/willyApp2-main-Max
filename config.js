import * as firebase from 'firebase'
require('@firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyCICoH1EV3qtAO-TP4xnvpmySmuqNj2kw4",
  authDomain: "wily-2demo.firebaseapp.com",
  databaseURL: "https://wily-2demo.firebaseio.com",
  projectId: "wily-2demo",
  storageBucket: "wily-2demo.appspot.com",
  messagingSenderId: "75715947676",
  appId: "1:75715947676:web:2846f6a436150977e65159"
};
  
 firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();