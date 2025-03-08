import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
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
      <button (click)="mock()">Mock</button>
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

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.fetchTodos();
      }
    });
  }

  async filterTodos() {
    this.filteredTodos = await this.todoService.getFilteredTodos(this.filter);
  }

  async addTodo() {
    const newTodo = await this.todoService.createTodo(
      this.newTodoTitle || `Todo ${Math.floor(Math.random() * 1000)}`,
      false
    );

    this.filteredTodos = [...this.filteredTodos, newTodo];
  }

  async fetchTodos() {
    this.filteredTodos = await this.todoService.getAllTodos();
  }

  async clearFilter() {
    this.filter = '';
    await this.filterTodos();
  }

  async deleteAllTodos() {
    await this.todoService.deleteAllTodos(this.filteredTodos);
    this.filteredTodos = [];
    this.router.navigate(['/']);
  }

  async deleteTodoById(id: string) {
    await this.todoService.deleteTodo(id);
    this.filteredTodos = this.filteredTodos.filter(todo => todo.id !== id); 
    this.router.navigate(['/']);
  }

  async updateTodo(todo: Todo) {
    todo.completed = !todo.completed;
    const updatedTodo = await this.todoService.updateTodo(todo);
  }

  async mock() {
    await this.todoService.mock();
    await this.fetchTodos();
  }
}