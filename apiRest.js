let express = require("express");
let app = express();
let cors = require('cors')
let mysql = require("mysql2");

let connection = mysql.createConnection(
    {
        host         : "localhost",
        user         : "root",
        password     : "21192601",
        database     : "work"
    });

connection.connect(function(error){
    if(error){
       console.log(error);
    }else{
       console.log('Conexion correcta.');
    }
 });

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/student", 
        function(request, response)
        { console.log(request.query.id)
            let sql;
            if (request.query.id == null)
                sql = "SELECT * FROM student";
            else
                sql = "SELECT * FROM student WHERE id_student=" + request.query.id;
                console.log(sql)
    
            connection.query(sql, function (err, result)
            {
                if (err) {
                    console.log(err);
                }
                else {
                    response.send(result);
                }
            })
        }
        );

app.post("/student", 
        function(request, response)
        {
            console.log(request.body);

            let sql = "INSERT INTO student (first_name1, last_name1, id_group, ingreso) " +
            "VALUES ('" + request.body.first_name1 + "', '" + request.body.last_name1 + "', '" +
                    request.body.id_group + "', '" + request.body.ingreso + "')"
                        
            console.log(sql);                      
            connection.query(sql, function (err, result) 
            {
                if (err) 
                    console.log(err);
                else 
                {
                    console.log(result);
                    if (result.insertId)
                        response.send(String(result.insertId));
                    else
                        response.send("-1");
                }
            })
        }
        );

app.put("/student", 
        function(request, response)
        {
            console.log(request.body);

            let sql =  `UPDATE student SET first_name1 = "${request.body.first_name1}",
                        last_name1= "${request.body.last_name1}",
                        id_group= ${request.body.id_group},
                        ingreso= '${request.body.ingreso}'
                         WHERE id_student= ${request.body.id_student}`      

            console.log(sql); 
            connection.query(sql, function (err, result) 
            {
                if (err) 
                    console.log(err);
                else 
                {
                    response.send(result);
                }
            })
        }
        );

app.delete("/student", 
        function(request, response)
        {
            console.log(request.body);
            let sql =  `DELETE FROM student WHERE id_student= ${request.body.id_student}`
            console.log(sql); 
            connection.query(sql, function (err, result) 
            {
                if (err) 
                    console.log(err);
                else 
                {
                    response.send(result);
                }
            })
        }
        );
    
// ENDPOINTS NOTAS

app.get("/mark", 
        function(request, response)
        {
            console.log(request.query.id)
            let sql;
            if (request.query.id == null)
                sql = "SELECT * FROM mark";
            else
                sql = "SELECT id_student, id_subject, mark from mark WHERE id_student=" + request.query.id;
    
            connection.query(sql, function (err, result)
            {
                if (err) {
                    console.log(err);
                }
                else {
                    response.send(result);
                }
            })
        }
        );

app.post("/mark", 
        function(request, response)
        {
            console.log(request.body);

            let sql = "INSERT INTO mark (id_student, id_subject, date, mark) " +
                    "VALUES ('" + request.body.id_student + "', '" + request.body.id_subject + "', '" +
                    request.body.date + "', '" + request.body.mark + "')"
                        
            console.log(sql);                      
            connection.query(sql, function (err, result) 
            {
                if (err) 
                    console.log(err);
                else 
                {
                    console.log(result);
                    if (result.insertId)
                        response.send(String(result.insertId));
                    else
                        response.send("-1");
                }
            })
        }
        );

app.put("/mark", 
        function(request, response)
        {
            console.log(request.body);

            let sql = `UPDATE mark SET id_student= ${request.body.id_student}, 
                    id_subject= ${request.body.id_subject}, 
                    date= "${request.body.date}", 
                    mark= ${request.body.mark} 
                    WHERE id_mark = ${request.body.id_mark}`

            console.log(sql); 
            connection.query(sql, function (err, result) 
            {
                if (err) 
                    console.log(err);
                else 
                {
                    response.send(result);
                }
            })
        }
        );

app.delete("/mark", 
        function(request, response)
        {
            console.log(request.body);
            let sql =  `DELETE FROM mark WHERE id_mark= ${request.body.id_mark}`
            console.log(sql); 
            connection.query(sql, function (err, result) 
            {
                if (err) 
                    console.log(err);
                else 
                {
                    response.send(result);
                }
            })
        }
        );

// ENDPOINTS ADICIONALES

app.get("/media", 
        function(request, response)
        {
            console.log(request.query.id)
            let sql;
            if (request.query.id != "")
                sql = "SELECT id_student, AVG (mark) FROM mark WHERE id_student=" + request.query.id

            connection.query(sql, function (err, result)
            {
                if (err) {
                    console.log(err);
                }
                else {
                    response.send(result);
                }
            })
        }
        );

app.get("/apuntadas", 
        function(request, response)
        {
            console.log(request.query.id)
            let sql;
            if (request.query.id != "")
                sql = "SELECT id_student, id_subject FROM mark WHERE id_student=" + request.query.id
            else 
            {
                sql =  `SELECT first_name1, last_name1, title FROM student JOIN
                        grupo ON (student.id_group = grupo.id_group) JOIN
                        subject_teacher ON (grupo.id_group = subject_teacher.id_group) JOIN
                        subject ON (subject_teacher.id_subject = subject.id_subject)`
            }
                
            connection.query(sql, function (err, result)
            {
                if (err) {
                    console.log(err);
                }
                else {
                    response.send(result);
                }
            })
        }
        );

app.get("/impartidas",
        function(request, response)
        {
            console.log(request.query.id)
            let sql;
            if (request.query.id != "")
                sql = "SELECT id_teacher, id_subject FROM subject_teacher WHERE id_teacher=" + request.query.id
            else 
            {
                sql =  `SELECT first_name, last_name, title FROM teacher JOIN
                        subject_teacher ON (teacher.id_teacher = subject_teacher.id_teacher) JOIN
                        subject ON (subject_teacher.id_subject = subject.id_subject)`
            }
                
            connection.query(sql, function (err, result)
            {
                if (err) {
                    console.log(err);
                }
                else {
                    response.send(result);
                }
            })
        }
        );

app.listen(3000);