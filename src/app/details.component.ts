import { Component, Input, inject } from '@angular/core';
import { Todo } from './todo';
import { TodoService } from './todo.service';

@Component({
  selector: 'ng1-details',
  imports: [],
  template: `
    <h2>Details</h2>
    <section>
      <label>Id:</label>
      <span>{{todo.id}}</span>
    </section>
    <section>
      <label>Title:</label>
      <span>{{todo.title}}</span>
    </section>
    <section>
      <label>Completed:</label>
      <span>{{todo.completed}}</span>
    </section>
  `,
  styles: ``
})
export class DetailsComponent {
  todoService: TodoService = inject(TodoService);

  todo: Todo = {
    id: `1`,
    title: 'Todo 1',
    completed: false
  };

  ngOnInit() {
    console.log('DetailsComponent initialized');
  }

  @Input()
  set id(id: string) {
    this.todo = this.todoService.getTodoById(id) || this.todo;
  }
}
