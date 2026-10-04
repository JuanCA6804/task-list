import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonButton,
  IonIcon,
  IonInput,
  IonList,
  IonLabel,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonItem,
    IonButton,
    IonIcon,
    IonInput,
    IonList,
    IonLabel,
  ],
})
export class TaskListPage {
  public tasks: string[] = [];
  public task = '';

  constructor() {
    addIcons({ addOutline });
  }

  addTask(): void {
    const newTask = this.task.trim();
    if (!newTask) {
      return;
    }

    this.tasks.push(newTask);
    this.task = '';
  }
}
