import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../data-access/task.service';
import { Observable, combineLatest, map, startWith } from 'rxjs';

@Component({
  selector: 'app-admin-matriculas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-matriculas.component.html',
  styleUrls: ['./admin-matriculas.component.css'],
})
export class AdminMatriculasComponent implements OnInit {
  tasksService = inject(TaskService);
  datosMatriculas$: Observable<any[]>;

  // Filtros
  municipioFilter = '';
  cursoFilter = '';

  municipios = ['Jardin', 'Don Matias', 'Bogotá'];
  cursos = ['Curso 1', 'Curso 2', 'Curso 3', 'Curso 4'];

  constructor() {
    // Inicializamos `datosMatriculas$` con los datos filtrados
    this.datosMatriculas$ = combineLatest([
      this.tasksService.getDatosMatriculas(),
      this.municipioFilter$(),
      this.cursoFilter$()
    ]).pipe(
      map(([datos, municipio, curso]) =>
        datos.filter(dato =>
          (!municipio || dato.municipio === municipio) &&
          (!curso || dato.curso === curso)
        )
      )
    );
  }

  private municipioFilter$() {
    return new Observable<string>(observer => {
      observer.next(this.municipioFilter);
    }).pipe(startWith(''));
  }

  private cursoFilter$() {
    return new Observable<string>(observer => {
      observer.next(this.cursoFilter);
    }).pipe(startWith(''));
  }

  ngOnInit() {}

  applyFilters() {
    this.datosMatriculas$ = combineLatest([
      this.tasksService.getDatosMatriculas(),
      this.municipioFilter$(),
      this.cursoFilter$()
    ]).pipe(
      map(([datos, municipio, curso]) =>
        datos.filter(dato =>
          (!municipio || dato.municipio === municipio) &&
          (!curso || dato.curso === curso)
        )
      )
    );
  }

}
