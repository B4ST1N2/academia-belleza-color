import { authState } from '@angular/fire/auth';
import { Component, inject, input ,OnInit} from '@angular/core';
import { AuthStateService } from '../../../shared/data-access/auth-state.service';
import { Router, RouterLink } from '@angular/router';
import { TableComponent } from '../../ui/table/table.component';
import { Task, TaskService } from '../../data-access/task.service';
import { AdminMatriculasComponent } from '../admin-matriculas/admin-matriculas.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inscripcion',
  standalone: true,
  imports: [TableComponent,RouterLink,AdminMatriculasComponent, CommonModule],
  templateUrl: './inscripcion.component.html',
  styleUrl: './inscripcion.component.css',
  providers:[TaskService],
})
export default class InscripcionComponent implements OnInit{
  private _authState = inject(AuthStateService);
  private _router = inject(Router);

  tasksService = inject(TaskService);

  isAdmin = false;

  ngOnInit(): void {
    this.checkAdminRole();
  }

  private async checkAdminRole() {
    const userId = this._authState.currentUser?.uid;
    if (userId) {
      const userDoc = await this.tasksService.getUserProfile(userId);
      this.isAdmin = userDoc?.role === 'admin';
    }
  }

  async logOut(){
    await this._authState.logOut();
    this._router.navigateByUrl('/inicio')
  };

  redirectToWhatsApp() {
    const phoneNumber = '573128776356'; // Reemplaza con el número de teléfono de WhatsApp
    const message = 'Hola, Termine mi matricula.'; // Mensaje predeterminado
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }


}
