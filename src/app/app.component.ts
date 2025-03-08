import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ng1-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  template: `
    <h1>Welcome to {{title}}!</h1>
    <h2>Learn and Fun!</h2>
    <section>
      <input type="text" placeholder="Enter new todo" [(ngModel)]="newTodoTitle" />
      <button (click)="addTodo()">Add</button>
      <button (click)="newTodoTitle = ''">Clear</button>
    </section>

    <section>
      <button (click)="listTodos()">Refresh</button>
      <button (click)="deleteTodos()">Delete All</button>
    </section>

    <section>
      <input type="text" placeholder="Search todo" [(ngModel)]="filter" (input)="filterTodos()" />
    </section>

    <ul>
      <li *ngFor="let todo of filteredTodos" (click)="todo.completed = !todo.completed">
        {{todo.title}} - {{todo.completed ? 'Completed' : 'Not Completed'}}
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
    this.listTodos();
  }

  filterTodos() {
    this.filteredTodos = this.todos.filter((todo) => 
      todo.title.toLowerCase().includes(this.filter.toLowerCase())
    );
  }

  addTodo() {
    this.todos.push({
      id: this.todos.length + 1,
      title: this.newTodoTitle || `Todo ${this.todos.length + 1}`,
      completed: false,
    });
  }

  listTodos() {
    this.todos = this.generateRandomTodos();
    this.filteredTodos = this.todos;
  }

  deleteTodos() {
    this.todos = [];
  }

  delete(id: number) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  generateRandomTodos() {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Todo ${i + 1}`,
      completed: Math.random() < 0.5,
    }));
  }
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
