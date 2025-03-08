import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Todo } from './todo';
import { TodoService } from './todo.service';

@Component({
  selector: 'ng1-details',
  imports: [FormsModule],
  template: `
    <section>
      <h2>Details</h2>
      <section>
        <button (click)="save()">Save</button>
      </section>
      <section>
        <label>Id:</label>
        <span>{{todo.id}}</span>
      </section>
      <section>
        <label>Title:</label>
        <input type="text" [(ngModel)]="todo.title" />
      </section>
      <section>
        <label>Completed:</label>
        <input type="checkbox" [(ngModel)]="todo.completed" />
      </section>
    </section>
  `,
  styles: ``
})
export class DetailsComponent {
  todoService: TodoService = inject(TodoService);
  router: Router = inject(Router);

  todo: Todo = {
    id: `1`,
    title: 'Todo 1',
    completed: false
  };

  ngOnInit() {
  }

  @Input()
  set id(id: string) {
    this.todo = this.todoService.getTodoById(id) || this.todo;
  }

  save() {
    this.router.navigate(['/']);
  }
}
