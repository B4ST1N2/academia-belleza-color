
import { inject, Injectable, signal } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { catchError, Observable, tap, throwError} from 'rxjs';
import { toSignal} from '@angular/core/rxjs-interop';
import { AuthStateService } from '../../shared/data-access/auth-state.service';
import { doc, updateDoc, query, where, getDoc} from 'firebase/firestore';
import { AuthService } from '../../auth/data-access/auth.service';

export interface Task {
  id: string;
  municipio: string;
  curso: string;
}

export type TaskCreate = Omit<Task, 'id'>;


const PATH_MATRICULAS = 'matriculas';
const PATH_USER_PROFILES = 'user_profiles';
const PATH_DATOS_MATRICULAS = 'datos_matriculas';

@Injectable()
export class TaskService {
  private _firestore = inject(Firestore);
  private _authState = inject(AuthStateService);
  private _authService = inject(AuthService);

  private _collectionMatriculas = collection(this._firestore, PATH_MATRICULAS);
  private _collectionDatosMatriculas = collection(this._firestore, PATH_DATOS_MATRICULAS);

  private _datosMatriculasCollection = collection(this._firestore, 'datos_matriculas');


  getDatosMatriculas(): Observable<any[]> {
    return collectionData(this._datosMatriculasCollection, { idField: 'id' });
  }

  private _query = query(
    this._collectionMatriculas,
    where('userId','==', this._authState.currentUser?.uid)
  )

  loading = signal<boolean>(true);

  constructor(){
    this._authState.currentUser;
  }

  getTasks = toSignal(
    (collectionData(query(this._collectionMatriculas, where('userId', '==', this._authService.getUserId())), { idField: 'id' }) as Observable<Task[]>).pipe(
      tap(() => {
        this.loading.set(false);
      }),
      catchError((error) => {
        this.loading.set(false);
        return throwError(() => error);
      })
    ),
    { initialValue: [] }
  );

  getUserProfile(userId: string): Promise<any> {
    const userRef = doc(this._firestore, `user_profiles/${userId}`);
    return getDoc(userRef).then((docSnap) => (docSnap.exists() ? docSnap.data() : null));
  }



  async create(task: { municipio: string; curso: string }) {
    const userId = this._authService.getUserId();
    if (!userId) {
      throw new Error('No hay un usuario autenticado.');
    }

    // Obtener el perfil del usuario desde `user_profiles`
    const userProfileRef = doc(this._firestore, `${PATH_USER_PROFILES}/${userId}`);
    const userProfileDoc = await getDoc(userProfileRef);

    if (!userProfileDoc.exists()) {
      throw new Error('Perfil de usuario no encontrado.');
    }

    const userProfileData = userProfileDoc.data();

    // Datos para la colección `matriculas`
    const matriculaData = {
      municipio: task.municipio,
      curso: task.curso,
      userId,
    };

    // Datos para la colección `datos_matriculas` combinando `user_profiles` y `matriculas`
    const datosMatricula = {
      nombre: userProfileData['name'],
      apellido: userProfileData['lastName'],
      correo: userProfileData['email'],
      celular: userProfileData['phone'],
      curso: task.curso,
      municipio: task.municipio,
      userId,
    };

    // Guardar en ambas colecciones
    await addDoc(this._collectionMatriculas, matriculaData); // Guardar en `matriculas`
    return addDoc(this._collectionDatosMatriculas, datosMatricula); // Guardar en `datos_matriculas`
  }

  getTask(id: string){
    const docRef = doc(this._collectionMatriculas, id);
    return getDoc(docRef);
  }

  update(task: TaskCreate, id: string){
    const docRef = doc(this._collectionMatriculas,id);
    return updateDoc(docRef,{
      ...task,
      userId: this._authState.currentUser?.uid,
    });
  }

}
