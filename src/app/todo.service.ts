import { Injectable } from '@angular/core';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  todos: Todo[] = [];

  constructor() {
    this.todos = this.generateRandomTodos();
  }

  getTodoById(id: string): Todo | undefined {
    return this.todos.find((todo) => todo.id === id);
  }

  getFilteredTodos(filter: string): Todo[] {
    return this.todos.filter((todo) => 
      todo.title.toLowerCase().includes(filter.toLowerCase())
    );
  }

  getAllTodos(): Todo[] {
    return this.todos;
  }

  createTodo(name: string, completed: boolean): string {
    const id = this.todos.length + 1

    this.todos.push({
      id: `${id}`,
      title: name,
      completed: completed,
    });

    return `${id}`;
  }

  deleteAllTodos(): void {
    this.todos = [];
  }

  deleteTodo(id: string): void {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  updateTodo(updatedTodo: Todo): void {
    this.todos = this.todos.map((todo) => {
      if (todo.id === updatedTodo.id) {
        return updatedTodo;
      }

      return todo;
    });
  }

  generateRandomTodos() {
    return Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Todo ${i + 1}`,
      completed: Math.random() < 0.5,
    }));
  }
}
