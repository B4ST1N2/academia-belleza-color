import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskService } from '../../data-access/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-matriculas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-matriculas.component.html',
  styleUrl: './admin-matriculas.component.css'
})
export class AdminMatriculasComponent implements OnInit {
  datosMatriculas$!: Observable<any[]>;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.datosMatriculas$ = this.taskService.getDatosMatriculas();
  }
}
