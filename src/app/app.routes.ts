import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    redirectTo: 'task-list',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: 'task-list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    redirectTo: 'task-list',
    pathMatch: 'full',
  },
  {
    path: 'task-list',
    loadComponent: () =>
      import('./pages/task-list/task-list.page').then((m) => m.TaskListPage),
  },
];
