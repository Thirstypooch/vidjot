const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

//Map global promise - getting rid of warning on Traversy version
//mongoose.Promise = global.Promise;
//Connection to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    //useMongoClient: true
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

//Load idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');

//Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Index route
app.get('/', (req, res) => {
    const title = 'Welcome Nito';
    res.render('index', {
        title: title
    });
});

//About Route
app.get('/about', (req, res) => {
    res.render('about');
});

//Add idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});