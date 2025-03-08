import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from './todo';
import { TodoService } from './todo.service';

@Component({
  selector: 'ng1-root',
  imports: [RouterOutlet, CommonModule, FormsModule, RouterLink, RouterLinkActive],
  template: `
    <h1>Welcome to <a routerLink="/" >{{title}}</a>!</h1>
    <h2>Learn and Fun!</h2>
    <section>
      <input type="text" placeholder="Enter new todo" [(ngModel)]="newTodoTitle" />
      <button (click)="addTodo()">Add</button>
      <button (click)="newTodoTitle = ''">Clear</button>
    </section>

    <section>
      <button (click)="fetchTodos()">Refresh</button>
      <button (click)="deleteAllTodos()">Delete All</button>
    </section>

    <section>
      <input type="text" placeholder="Search todo" [(ngModel)]="filter" (input)="filterTodos()" />
      <button (click)="clearFilter()">Clear</button>
    </section>

    <ul>
      <li *ngFor="let todo of filteredTodos">
        <a routerLink="details/{{todo.id}}" routerLinkActive="active" ariaCurrentWhenActive="page">
          {{todo.title}}
        </a>
        <input type="checkbox" [checked]="todo.completed" (change)="updateTodo(todo)" />
        <button (click)="deleteTodoById(todo.id)">Delete</button>
      </li>
    </ul>

    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'PritiX';
  filteredTodos: Todo[] = [];
  router: Router = inject(Router);
  todoService: TodoService = inject(TodoService);

  newTodoTitle = ``;
  filter = ``;

  constructor() {
    this.fetchTodos();
  }

  filterTodos() {
    this.filteredTodos = this.todoService.getFilteredTodos(this.filter);
  }

  addTodo() {
    this.todoService.createTodo(
      this.newTodoTitle || `Todo ${Math.floor(Math.random() * 1000)}`,
      false
    );

    this.fetchTodos();
  }

  fetchTodos() {
    this.filteredTodos = this.todoService.getAllTodos();
  }

  clearFilter() {
    this.filter = '';
    this.filterTodos();
  }

  deleteAllTodos() {
    this.todoService.deleteAllTodos();
    this.fetchTodos();
    this.router.navigate(['/']);
  }

  deleteTodoById(id: string) {
    this.todoService.deleteTodo(id);
    this.fetchTodos();
    this.router.navigate(['/']);
  }

  updateTodo(todo: Todo) {
    todo.completed = !todo.completed;
    this.todoService.updateTodo(todo);
    this.fetchTodos();
  }
}