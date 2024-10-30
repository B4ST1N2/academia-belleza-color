import { authState } from '@angular/fire/auth';
import { Component, inject, input } from '@angular/core';
import { AuthStateService } from '../../../shared/data-access/auth-state.service';
import { Router, RouterLink } from '@angular/router';
import { TableComponent } from '../../ui/table/table.component';
import { Task, TaskService } from '../../data-access/task.service';

@Component({
  selector: 'app-inscripcion',
  standalone: true,
  imports: [TableComponent,RouterLink],
  templateUrl: './inscripcion.component.html',
  styleUrl: './inscripcion.component.css',
  providers:[TaskService],
})
export default class InscripcionComponent {
  private _aurhState = inject(AuthStateService);
  private _router = inject(Router);

  tasksService = inject(TaskService);

  async logOut(){
    await this._aurhState.logOut();
    this._router.navigateByUrl('/inicio')
  };

  redirectToWhatsApp() {
    const phoneNumber = '573128776356'; // Reemplaza con el número de teléfono de WhatsApp
    const message = 'Hola, Termine mi matricula.'; // Mensaje predeterminado
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }


}
