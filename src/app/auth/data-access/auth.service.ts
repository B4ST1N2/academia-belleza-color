import { inject, Injectable } from '@angular/core';
import { Auth , User as FirebaseUser} from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,signInWithPopup, GoogleAuthProvider, onAuthStateChanged  } from 'firebase/auth';
import { Firestore, doc, setDoc, collection } from '@angular/fire/firestore';




export interface User{
  email:string;
  password:string;
  name?: string;
  lastName?: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  logout() {
    throw new Error('Method not implemented.');
  }

  private _auth = inject(Auth);
  private currentUser: FirebaseUser | null = null;

  private firestore = inject(Firestore)


  constructor() {
    onAuthStateChanged(this._auth, (user) => {
      if (user) {
        this.currentUser = user; // Usamos el objeto FirebaseUser, que no tiene password
      } else {
        this.currentUser = null;
      }
    });
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  // Obtener el UID del usuario autenticado
  getUserId(): string | null {
    return this.currentUser ? this.currentUser.uid : null;
  }

  async signUp(user: User) {
    // Crear el usuario con email y contraseña en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      this._auth,
      user.email,
      user.password
    );

    // Guardar los datos adicionales en Firestore en la colección "user_profiles"
    const userProfilesCollection = collection(this.firestore, 'user_profiles');
    const userRef = doc(userProfilesCollection, userCredential.user.uid);

    await setDoc(userRef, {
      name: user.name,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      uid: userCredential.user.uid, // Guardar el UID del usuario
    });

    return userCredential;
  }

  signIn(user: User){
    return signInWithEmailAndPassword(this._auth, user.email, user.password)
  }

  signInWithGoogle(){
    const provider = new GoogleAuthProvider;

    provider.setCustomParameters({prompt:'select_account'});
    return signInWithPopup(this._auth,provider);
  }
}
