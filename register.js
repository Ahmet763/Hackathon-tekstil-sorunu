import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

document.getElementById('registerButton').addEventListener('click', async ()=>{
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth,email,password);
    await updateProfile(auth.currentUser,{displayName:username});
    // Firestore’da kullanıcı puanı oluştur
    await setDoc(doc(db,"users",auth.currentUser.uid), {username, points:0});
    alert("Kayıt başarılı");
    window.location.href = 'login.html';
  } catch(e){
    alert(e.message);
  }
});
// register.js

import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app } from "./firebase-config.js";

const auth = getAuth(app);
const registerButton = document.getElementById('registerButton');

registerButton.addEventListener('click', () => {
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Kullanıcı başarıyla oluşturuldu
            const user = userCredential.user;
            console.log("Kayıt başarılı, kullanıcı:", user.email);

            // Kullanıcı adını Firebase profiline kaydetme
            return updateProfile(user, {
                displayName: username
            });
        })
        .then(() => {
            // Profil güncellemesi başarılı
            console.log("Kullanıcı adı kaydedildi:", username);
            
            // Kullanıcı adını localStorage'a kaydetme
            localStorage.setItem('loggedInUsername', username);

            // Başarılı kayıt sonrası ana sayfaya yönlendirme
            window.location.href = "index.html"; // veya harita sayfanızın adresi
        })
        .catch((error) => {
            // Kayıt sırasında hata oluşursa
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Kayıt hatası:", errorCode, errorMessage);
            alert("Kayıt başarısız: " + errorMessage);
        });
});