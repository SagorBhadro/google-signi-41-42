import React, { useState } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';


firebase.initializeApp(firebaseConfig);



function App() {
   
  const [user,setUser] = useState({
    isSignedin: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  })
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const handleSineIn =() =>{
    firebase.auth()
    .signInWithPopup( googleProvider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      const credential = result.credential;
  
      const {displayName, photoUrl, email} = result.user;
      const signedInUser =  {
        isSignedin: true,
        name:displayName,
        email:email,
        photo:photoUrl
      }
        setUser(signedInUser);

      const token = credential.accessToken;
      const user = result.user;

    }).catch((error) => {
      console.log(error);
      console.log(error.massage);


      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
    });
  }
  const handleSineOut = () =>{
    firebase.auth().signOut()
    .then( res =>{
      const signOutUser = {
        isSignedin: false,
    name: '',
    email: '',
    photo: ''
      }
      setUser(signOutUser);
    })
    .catch( error => {

    });
  }

  const handleBlur = (e) => {
    let isFirldValid = true;
    if(e.target.name === 'email') {
      isFirldValid = /\S+@\S+\.\S+/.test(e.target.value);
     
    }
    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length > 8;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFirldValid = isPasswordValid && passwordHasNumber
    }
    if(isFirldValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.value] = e.target.value;
      setUser(newUserInfo);
    }
  }
  const handelSubmit = (e) =>{
    console.log(user.Email,user.password)
    if(user.name && user.password){
      firebase.auth().signInWithEmailAndPassword( user.email, user.password)
      .then((userCredential) => {
        var user = userCredential.user;
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
    }
    e.preventDefault();
  }
  return (
    <div className="App">

     {
     user.isSignedin ?<button onClick={handleSineOut} > Sing out </button> :
     <button onClick={handleSineIn} > Sing in </button>
     }
      {
        user.isSignedin && <div>
          <p>welcom. {user.name}</p>
          <p>your email: {user.email}</p>
          <img src={user.photo} alt=""></img>
        </div>                                                                                                                                                                                                                                                                                             
      }
      <h1> Our own Authentication</h1>
    <p>Name:{user.name}</p>
    <p>Email:{user.email}</p>
    <p>Password:{user.password}</p>
      <form onSubmit={handelSubmit}> 
      <input type="name" name="text" onBlur={handleBlur} placeholder="Your Name"/>
      <br/>
      <input type="text" name="email" onBlur={handleBlur} placeholder="Email / Phone Number" require />
      <br/>
      <input type="password"name="password" onBlur={handleBlur} placeholder ="Your Password"require />
      <br/>
      <input type="submit" value="submit"/>
      </form>
    </div>
  );
}

export default App;
