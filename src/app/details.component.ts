import { Component, Input } from '@angular/core';
import { Todo } from './todo';

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
    this.todo.id = id;
  }
}
