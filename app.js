const  express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const {PythonShell} = require('python-shell');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs'); 
app.use(express.static(path.join(__dirname, 'static')));

let allStudent = [] // { studentID: '123', lastName: 'Kien', firstName: 'Ta'}
let checkedStudent = [] // 123

app.get('/', function (req, res) {
   res.render('trang_chu');
   
   PythonShell.run('test.py', {args: [20]}, function (err, res) {
    if (err) throw err;
    console.log(res);
  });

})

app.get('/them_hs', (req, res) => {
    res.render('them_hs');
})

app.post('/them_hs', (req, res) => {
    allStudent.push(req.body);
    res.redirect('/them_hs');
})

app.get('/diem_danh', (req, res) => {
    res.render('diem_danh', {allStudent: allStudent, checkedStudent: checkedStudent});
})

app.listen(3000, () => {
    console.log('Application running at port 3000');
})