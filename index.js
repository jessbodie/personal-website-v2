const express = require('express');
const hbs = require('hbs');

const port = process.env.PORT || 3000; // For running on Heroku
const app = express();

// Configure for templatizing
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('lowerCase', (text) => {
    return text.toLowerCase();
});

hbs.registerHelper('getEmail', () => {
    const email = 'jessbodie@gmail.com'; 
    return email;
});


app.get('/', (req, res) => {
    // res.send([{name: "Jess", last: "Richards"}]);
    res.render('home.hbs', {
        pageTitle: 'Web Developer'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About'
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects'
    });
});

app.get('/captions', (req, res) => {
    res.render('captions.hbs', {
        pageTitle: 'Captions Demo'
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

