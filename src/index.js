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

  return response.status(201).send();
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;