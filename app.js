const  express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const {PythonShell} = require('python-shell');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs'); 
app.use(express.static(path.join(__dirname, 'static')));

let allStudent = [] // { studentID: '123', lastName: 'Kien', firstName: 'Ta', status: true/false}
let pythonArgs = [] //

app.get('/', function (req, res) {
   res.render('home');
})

app.get('/add_student', (req, res) => {
    res.render('add_student');
})

app.post('/add_student', (req, res) => {
    req.body.status = false;
    allStudent.push(req.body);
    pythonArgs.push(req.body.studentID);
    pythonArgs.push(req.body.firstName);
    PythonShell.run('Face_recog.py', {args: [req.body.studentID]}, (err, result) =>{
        PythonShell.run('Face_part2.py', null, (err, result) =>{
            console.log(result)
            res.redirect('/take_attendant');
        });
    });
})

app.get('/take_attendant', (req, res) => {
    res.render('take_attendant', {allStudent: allStudent});
})

app.post('/take_attendant', (req, res) => {
    PythonShell.run('Face_part3.py', {args: pythonArgs}, (err, result) =>{
        if(result == null || result[0] == null){
            res.redirect('/take_attendant');    
        }
        else{
            result.forEach(studentID => {
                let index = allStudent.findIndex(element => element.studentID == studentID)
                console.log(index)
                if(index != null && allStudent[index] != null){
                    allStudent[index].status = true
                }
            })
            res.redirect('/take_attendant');
        }
    });
})

app.post('/reset', (req, res) => {
    for(let i = 0; i < allStudent.length; i++){
        allStudent[i].status = false
    }
    res.redirect('/take_attendant');
})

app.listen(3000, () => {
    console.log('Application running at port 3000');
})