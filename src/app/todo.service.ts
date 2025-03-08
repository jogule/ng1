import { Injectable } from '@angular/core';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  async mock() {
    const todos = await this.getAllTodos();

    if (todos.length === 0) {
      for (let i = 0; i < 10; i++) {
        const todo = this.generateRandomTodo();
        await this.createTodo(todo.title, todo.completed);
      }
    }
  }

  async getTodoById(id: string): Promise<Todo | undefined> {
    const gql = `
    query getById($id: ID!) {
      todo_by_pk(id: $id) {
        id
        title
        completed
      }
    }`;

    const query = {
      query: gql,
      variables: {
        id: id,
      },
    };

    const endpoint = "/data-api/graphql";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });
    const result = await response.json();
    console.table(result.data.todo_by_pk);

    return result.data.todo_by_pk;
  }

  async getFilteredTodos(filter: string): Promise<Todo[]> {

    const gql = `
    query FilteredItems($filter: String) {
      todos(filter: { title: { contains: $filter } }) {
        items {
          id
          title
          completed
        }
      }
    }`;

    const query = {
      query: gql,
      variables: {
        filter: filter
      }
    };
    
    const endpoint = "/data-api/graphql";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query)
    });
    const result = await response.json();
    console.table(result.data.todos.items);

    return result.data.todos.items;  
  }

  async getAllTodos(): Promise<Todo[]> {
    const query = `
    {
      todos {
        items {
          id
          title
          completed
        }
      }
    }`;
    
    const endpoint = "/data-api/graphql";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query })
    });
    const result = await response.json();
    console.table(result.data.todos.items);

    return result.data.todos.items;  
  }

  async createTodo(name: string, completed: boolean): Promise<Todo> {
    const id = crypto.randomUUID();

    const data: Todo = {
      id: `${id}`,
      title: name,
      completed: completed,
    };

    const gql = `
      mutation create($item: CreateTodoInput!) {
        createTodo(item: $item) {
          id
          title
          completed
        }
      }`;
    
    const query = {
      query: gql,
      variables: {
        item: data
      } 
    };
    
    const endpoint = "/data-api/graphql";
    const result = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query)
    });
  
    const response = await result.json();
    console.table(response.data.createTodo);

    return response.data.createTodo;
  }

  async deleteAllTodos(todos:Todo[]): Promise<void> {
    for (const todo of todos) {
      await this.deleteTodo(todo.id);
    }
  }

  async deleteTodo(id: string): Promise<void> {
    const gql = `
      mutation del($id: ID!, $_partitionKeyValue: String!) {
        deleteTodo(id: $id, _partitionKeyValue: $_partitionKeyValue) {
          id
        }
      }`;

    const query = {
      query: gql,
      variables: {
        id: id,
        _partitionKeyValue: id
      }
    };

    const endpoint = "/data-api/graphql";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query)
    });

    const result = await response.json();
    console.log(`Record deleted: ${ JSON.stringify(result.data) }`);
  }

  async updateTodo(updatedTodo: Todo): Promise<Todo> {
    const data = {
      id: updatedTodo.id,
      title: updatedTodo.title,
      completed: updatedTodo.completed
    };
  
    const gql = `
      mutation update($id: ID!, $_partitionKeyValue: String!, $item: UpdateTodoInput!) {
        updateTodo(id: $id, _partitionKeyValue: $_partitionKeyValue, item: $item) {
          id
          title
          completed
        }
      }`;
  
    const query = {
      query: gql,
      variables: {
        id: updatedTodo.id,
        _partitionKeyValue: updatedTodo.id,
        item: data
      } 
    };
  
    const endpoint = "/data-api/graphql";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query)
    });
  
    const result = await res.json();
    console.table(result.data.updateTodo);

    return result.data.updateTodo;
  }

  generateRandomTodo() {
    return {
      id: `${crypto.randomUUID()}`,
      title: `Todo ${Math.floor(Math.random() * 1000)}`,
      completed: Math.random() < 0.5,
    };
  }
}
