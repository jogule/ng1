import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from './todo';

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
      <button (click)="deleteTodos()">Delete All</button>
    </section>

    <section>
      <input type="text" placeholder="Search todo" [(ngModel)]="filter" (input)="filterTodos()" />
    </section>

    <ul>
      <li *ngFor="let todo of filteredTodos">
        <a routerLink="details/{{todo.id}}" routerLinkActive="active" ariaCurrentWhenActive="page">
          {{todo.title}}
        </a>
        <input type="checkbox" [checked]="todo.completed" />
        <button (click)="delete(todo.id)">Delete</button>
      </li>
    </ul>

    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'PritiX';
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];

  newTodoTitle = ``;
  filter = ``;

  constructor() {
    this.fetchTodos();
  }

  filterTodos() {
    this.filteredTodos = this.todos.filter((todo) => 
      todo.title.toLowerCase().includes(this.filter.toLowerCase())
    );
  }

  addTodo() {
    this.todos.push({
      id: `${this.todos.length + 1}`,
      title: this.newTodoTitle || `Todo ${this.todos.length + 1}`,
      completed: false,
    });
    this.filteredTodos = this.todos;
  }

  fetchTodos() {
    this.todos = this.generateRandomTodos();
    this.filteredTodos = this.todos;
  }

  deleteTodos() {
    this.todos = [];
    this.filteredTodos = this.todos;
  }

  delete(id: string) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.filteredTodos = this.todos;
  }

  generateRandomTodos() {
    return Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Todo ${i + 1}`,
      completed: Math.random() < 0.5,
    }));
  }
}