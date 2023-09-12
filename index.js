// import express
const express = require('express')
const cors = require('cors')
//create server by calling express
const app = express()
//above 1024
const port = 3000

const fruits = require('./fruits.json')
// // cresting route - GET route
// //[server].[method]('<path', callback)
// app.get('/home', (req, res) => {
//     // with message
//   res.send('Hello Weird!')
//   // without message
//   res.sendStatus(200);
// })
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Hello, Fruity!')
})

app.get('/fruits',(req, res) => {
    res.send(fruits)
   
})
// :<property> -> dynamic parameter
app.get('/fruits/:name', (req, res) => {
    const name = req.params.name.toLowerCase();
    const fruit = fruits.find((fruit) => fruit.name.toLowerCase() == name)    
    if (fruit == undefined) {
        res.sendStatus(404);
    }
    else {
        res.send(fruit);}
})

const ids = fruits.map((fruit) => fruit.id);
let maxId = Math.max(...ids);

app.post("/fruits", (req, res) => {
    // first check if a fruit with the name specified by the user already exists
    const fruit = fruits.find((fruit) => fruit.name.toLowerCase() == req.body.name.toLowerCase());

    if (fruit != undefined) {
        // fruit already exists -> conflict response code returned
        res.status(409).send("The fruit already exists.");
    } else {
        // fruit does not already exist. Increment the maxId and add it to
        // the data sent to the server by the user
        maxId += 1;
        req.body.id = maxId;

        // add the fruit to the list of fruits
        fruits.push(req.body);

        // Return successfully created status code
        res.status(201).send(req.body);
    }
});

app.delete("/fruits/:name", (req, res) => {
    // First check if fruit exists
    const name = req.params.name.toLowerCase();
    const fruitIndex = fruits.findIndex((fruit) => fruit.name.toLowerCase() == name);

    if (fruitIndex == -1) {
        // Fruit cannot be found, return 404
        res.status(404).send("The fruit doesn't exist.");
    } else {
        // Fruit found. Use the array index found to remove it from the array
        fruits.splice(fruitIndex, 1);

        // Return no content status code
        res.sendStatus(204);
    }
});

app.patch("/fruits/:name", (req, res) => {
    // first check if the fruit exists
    const fruit = fruits.find(fruit => fruit.name.toLowerCase() == req.params.name.toLowerCase());
    const newFruitName = req.body.name

    // If fruit doesn't exist, we send a Not found status code
    if (fruit == undefined) {
        res.status(404).send("The fruit doesn't exist.");
    } else {
        // If fruit exists, we update its name with the new data passed from the client (req.body)
        fruit.name = newFruitName
        res.status(200).send(fruit)
    }
})

module.exports = app;

//  bind a server to a port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
//localhost:3000