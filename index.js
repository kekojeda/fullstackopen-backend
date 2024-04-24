require('dotenv').config()

const Person = require('./models/person')


const express = require("express");
const morgan = require("morgan")
const cors = require('cors')

const app = express();

app.use(cors())
app.use(express.json());
app.use(morgan('tiny'))

app.use(express.static('dist'))

// app.use((req, res, next) => {
//     if (req.method === "POST") {
//       console.log("Data sent in POST request:", req.body);
//     }
//     next();
//   });


let persons = [
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  const totalPersons = `
    <p>Phonebook has info for ${persons.length} people </p>
    <p>${new Date()}</p>`;
  response.send(totalPersons);
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});




app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

/*
POST to DB Mongo Atlas
*/
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }
  // if (persons.some((person) => person.name === body.name)) {
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   });
  // }


  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})
/*
END POST to DB Mongo Atlas
*/


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
