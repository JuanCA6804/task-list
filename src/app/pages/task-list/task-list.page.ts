import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonList,
  IonLabel,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonReorder,
  IonReorderGroup,
  ReorderEndCustomEvent
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { addOutline, trash } from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';
import { Alert } from '../../services/alert';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    FormsModule,
    CommonModule,
    IonList,
    IonLabel,
    IonItemSliding,
    IonItemOption,
    IonItemOptions,
    IonReorder,
    IonReorderGroup
  ],
})
export class TaskListPage {

  // Inyectamos el servicio Alert para poder utilizarlo en la clase HomePage
  private alertService: Alert = inject(Alert);
  private cdr = inject(ChangeDetectorRef);

  public tasks: string[] = [];
  public task = 'Comprar leche'; // Variable para almacenar la tarea que se va a agregar a la lista

  private readonly STORAGE_KEY = 'mis_tareas';

  constructor() {
    addIcons({ addOutline, trash });
  }

  // Carga las tareas guardadas al entrar a la página
  async ionViewWillEnter() {
    console.log('ionViewWillEnter');

    const savedTasks = await Preferences.get({
      key: this.STORAGE_KEY
    });

    if (savedTasks.value) {
      try {
        const tasks = JSON.parse(savedTasks.value);

        if (
          Array.isArray(tasks) &&
          tasks.every((item: unknown) => typeof item === 'string')
        ) {
          this.tasks = tasks;
        } else {
          this.tasks = [];
        }
      } catch (error) {
        console.error('Error al cargar las tareas:', error);
        this.tasks = [];
      }

      console.log('[HISTORIAL CARGADO AL INICIAR]:');
      console.table(this.tasks);
    } else {
      console.log('[HISTORIAL]: No hay tareas previas en memoria.');
    }

    this.cdr.detectChanges();
  }

  // Guarda las tareas utilizando Preferences
  saveTasks() {
     Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(this.tasks)
    });

    console.log('[HISTORIAL GUARDADO]:');
    console.table(this.tasks);
  }

  addTask() {
    console.log('Variable: ', this.task);

    if (!this.ifExistisTask(this.task)) {
      this.tasks.push(this.task);
      this.saveTasks(); // Guardamos las tareas

      this.task = '';

      this.alertService.alertMessage(
        'Tarea agregada',
        'La tarea se ha agregado correctamente a la lista'
      );
    } else {
      console.log('La tarea ya existe en la lista');

      this.alertService.alertMessage(
        'Tarea ya existe',
        'La tarea que intenta agregar ya existe en la lista'
      );
    }
  }

  private ifExistisTask(task: string) {
    // Utilizamos el método find para
    // buscar la tarea en el array de tareas.
    // Si existe, devuelve la tarea; de lo contrario, devuelve undefined.
    return this.tasks.find(
      (item: string) =>
        task.toUpperCase().trim() === item.toUpperCase().trim()
    );
  }

  confirmDeleteTask(task: string) {
    this.alertService.alertConfirm(
      'Eliminar tarea',
      'Confirmación',
      '¿Está seguro de que desea eliminar esta tarea?',
      () => this.deleteTask(task),
      'Cancelar',
      'Eliminar'
    );
  }

  private deleteTask(task: string) {
    console.log('La tarea a eliminar es: ', task);

    // Buscamos el índice de la tarea a eliminar
    const index = this.tasks.findIndex(
      (item: string) =>
        item.toLowerCase().trim() === task.toLowerCase().trim()
    );

    console.log('La tarea a eliminar está en el índice: ', index);

    // Verificamos si el índice es válido antes de eliminar la tarea
    if (index != -1) {
      // Eliminamos un elemento del array utilizando splice
      this.tasks.splice(index, 1);

      this.saveTasks(); // Guardamos las tareas

      this.cdr.markForCheck();
    }
  }

  handleReorderEnd(event: ReorderEndCustomEvent) {
    console.log(
      'Dragged from index',
      event.detail.from,
      'to',
      event.detail.to
    );

    // Reordenamos el arreglo tasks en memoria usando el método de Ionic
    this.tasks = event.detail.complete(this.tasks);

    this.saveTasks(); // Guardamos el nuevo orden
  } 
}