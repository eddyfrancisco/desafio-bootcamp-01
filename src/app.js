const express = require("express");
const cors = require("cors");
const {uuid, isUuid} = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request,response, next){
  const { id} = request.params;

  if(!isUuid(id)){
      return response.status(400).json({error:'Invalid Repository ID'});
  }

  return next();
}

app.use('/repositories/:id', validateRepositoryId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const  { title, url, techs} = request.body;

    const likes = 0;

    const repository = { id: uuid(), title, url, techs, likes};

    repositories.push(repository);

    return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
    const {id} = request.params;
    const {title, url, techs} = request.body;

    const repositorytIndex = repositories.findIndex(repository => repository.id === id);

    if(repositorytIndex<0){
        return response.status(400).json({error:"Repository not found" });
    }

    const {likes} = repositories[repositorytIndex];

    const repository = {
        id,
        title,
        url,
        techs,
        likes
    };

    repositories[repositorytIndex]= repository;


    return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
    const {id} = request.params;

    const repositorytIndex = repositories.findIndex(repository => repository.id === id);

    if(repositorytIndex<0){
        return response.status(400).json({error:"Repository not found" });
    }

    repositories.splice(repositorytIndex, 1);


    return response.status(204).send();
});


app.post("/repositories/:id/like", (request, response) => {
    const {id} = request.params;    

    const repositorytIndex = repositories.findIndex(repository => repository.id === id);

    if(repositorytIndex<0){
        return response.status(400).json({error:"Repository not found" });
    }

    let {title, url, techs, likes} = repositories[repositorytIndex];

    likes++;

    const repository = {id, title, url, techs, likes};  

    repositories[repositorytIndex]= repository;

    return response.json(repository);

});

module.exports = app;