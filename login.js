import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

document.getElementById('loginButton').addEventListener('click', ()=>{
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth,email,password)
    .then(()=>{ 
      alert("Giriş başarılı"); 
      window.location.href = 'index.html'; 
    })
    .catch(e=>alert(e.message));
});
