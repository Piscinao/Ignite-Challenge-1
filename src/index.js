const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // complete aqui
  const { username } = request.headers;

  // procura por username
  const user = users.find((user) => user.username === username);
  
  //Não deve ser possivel buscar com username inexistente
  if(!user){
    return response.status(400).json({error: "User not found"});
  }

  request.user = user;

  return next();

}

app.post('/users', (request, response) => {
  // Complete aqui

  const { name, username } = request.body;
  

  const userAlreadyExistis = users.some(
    (user) => user.username === username
  );

  if(userAlreadyExistis){
    return response.status(400).json({error: "User already exists!"});
  }

  //chamada de função uuidv4
  // const id = uuidv4();

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };

  users.push(user)


  return response.status(201).send(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;

  const { user } = request;

  const userTodo = {
    id: uuidv4(), 
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(userTodo);

  return response.status(201).send(userTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;
  // faz a busca pelo array todos com o id 
  const todo = user.todos.find(todo => todo.id === id);

  //não pode atualizar um que não exista
  if(!todo) {
    return response.status(404).json({ error: 'Todo not found'});
  }

  todo.title = title;
  todo.deadline = new Date(deadline);
  

  return response.json(todo);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { user } = request;
  const { id } = request.params;

  // faz a busca pelo array todos com o id 
  const todo = user.todos.find(todo => todo.id === id);

  if(!todo) {
    return response.status(404).json({ error: 'Todo not found'});
  }

  todo.done = true;

  return response.json(todo);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  // retorna a posição do array que o objeto existe
  const todoIndex = user.todos.findIndex(todo => todo.id === id);

  // se tiver -1 significa que não foi encontrado
  if(todoIndex === -1) {
    return response.status(404).json({ error: 'Todo not found'});
  }

  user.todos.splice(todoIndex, 1);

  return response.status(204).json();


});

module.exports = app;