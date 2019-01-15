const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
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

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method override middleware
app.use(methodOverride('_method'));

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

//Idea index page
app.get('/ideas', (req, res) => {
    Idea.find({})
    .sort({date: 'desc'})
    .then(ideas => {
        res.render('ideas/index', {
            ideas: ideas
        });
    });
});

//Add idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

//Edit idea form
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea:idea
        });
    });
});

//Process form
app.post('/ideas', (req, res) => {
    //console.log(req.title, req.body);
    //res.send('ok');
    let errors = [];

    if(!req.body.title) {
        errors.push({text: 'Please add a title'});
    }
    if(!req.body.details) {
        errors.push({text: 'Please add some details'});
    }
    if(errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
        .save()
        .then(idea => {
            res.redirect('/ideas');
        })
    }
});

//Edit form process
app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id 
    })
    .then(idea => {
        //new values
        idea.title = req.body.title,
        idea.details = req.body.details;

        idea.save()
        .then(idea => {
            res.redirect('/ideas');
        })
    });
});

//Delete idea
app.delete('/ideas/:id', (req, res) => {
    Idea.remove({_id: req.params.id})
    .then(() => {
        res.redirect('/ideas');
    });
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});