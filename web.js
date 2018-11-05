var express = require("express");
var mysql = require('mysql');
var app = express();
app.use(express.static('public'));
//app.use(express.logger());
var sql, reply;

var db_config = {
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'bf3c82b107eebd',
    password: '7c8be2db',
    database: 'heroku_52e91f225d931d5'
}
var connection;


function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
    // the old one cannot be reused.

    connection.connect(function (err) { // The server is either down
        if (err) { // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        } // to avoid a hot loop, and to allow our node script to
    }); // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect(); // lost due to either server restart, or a
        } else {
            console.log('error is err:', err); // connnection idle timeout (the wait_timeout
            // throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();
module.exports = connection;

/* app.get('/', function (request, response) {
    response.send('Hello World!');
}); */

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on " + port);
});

// -------------- DISCIPLINA --------------

app.get('/api/disciplina/nome/all', function (request, response) {
    sql = "SELECT nome FROM disciplina";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            reply = {
                content: result,
                status: "success"
            }
        }
        response.send(reply);
    });
});

app.get('/api/disciplina/codigo/all', function (request, response) {
    sql = "SELECT codigo FROM disciplina";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            reply = {
                content: result,
                status: "success"
            }
        }
        response.send(reply);
    });
});

app.get('/api/disciplina/codigo/:nome', function (request, response) {
    var data = request.params;
    var nome = data.nome;
    sql = "SELECT codigo FROM disciplina WHERE nome = '" + nome + "'";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            reply = {
                content: result,
                status: "success"
            }
        }
        response.send(reply);
    });
});

app.get('/api/disciplina/nome/:codigo', function (request, response) {
    var data = request.params;
    var codigo = data.codigo;
    sql = "SELECT nome FROM disciplina WHERE codigo = " + codigo;
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            reply = {
                content: result,
                status: "success"
            }
        }
        response.send(reply);
    });
});

app.get('/api/disciplina/nome/:ano/:semestre', function (request, response) {
    var data = request.params;
    var ano = data.ano;
    var periodo = data.semestre;
    sql = "SELECT nome FROM disciplina WHERE codigo IN (SELECT codigo FROM desempenho WHERE id = (SELECT id FROM semestre WHERE ano = " + ano + " and periodo = " + periodo + "))";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            reply = {
                content: result,
                status: "success"
            }
        }
        response.send(reply);
    });
});

app.get('/api/disciplina/codigo/:ano/:semestre', function (request, response) {
    var data = request.params;
    var ano = data.ano;
    var periodo = data.semestre;
    sql = "SELECT codigo FROM disciplina WHERE codigo IN (SELECT codigo FROM desempenho WHERE id = (SELECT id FROM semestre WHERE ano = " + ano + " and periodo = " + periodo + "))";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            reply = {
                content: result,
                status: "success"
            }
        }
        response.send(reply);
    });
});

// -------------- SEMESTRE --------------

app.get('/api/semestre/all', function (request, response) {
    sql = "SELECT * FROM semestre";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            reply = {
                content: result,
                status: "success"
            }
        }
        response.send(reply);
    });
});

app.get('/api/semestre/id/:ano/:periodo', function (request, response) {
    var data = request.params;
    var ano = data.ano;
    var periodo = data.periodo;
    sql = "SELECT id FROM semestre WHERE ano = " + ano + " and periodo = " + periodo;
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            reply = {
                content: result,
                status: "success"
            }
        }
        response.send(result);
    });
});

// -------------- ALUNO/CURSANDO --------------

app.get('/api/stats/aluno/cursando/all', function (request, response) {
    var alunos = 0;
    sql = "SELECT numeroAlunos FROM desempenho";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].numeroAlunos;
            }
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/cursando/disciplina/:codigo', function (request, response) {
    var data = request.params;
    var codigo = data.codigo;
    var alunos = 0;
    sql = "SELECT numeroAlunos FROM desempenho WHERE codigo = '" + codigo + "'";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].numeroAlunos;
            }
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/cursando/disciplina/all/:anoIni/:semIni/:anoFim/:semFim', function (request, response) {
    var data = request.params;
    var anoIni = data.anoIni;
    var anoFim = data.anoFim;
    var semIni = data.semIni;
    var semFim = data.semFim;
    var alunos = 0;
    sql = "SELECT numeroAlunos FROM desempenho WHERE id BETWEEN (SELECT id FROM semestre WHERE ano = " + anoIni + " AND periodo = " + semIni + ") AND (SELECT id FROM semestre WHERE ano = " + anoFim + " AND periodo = " + semFim + ")";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].numeroAlunos;
            }
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/cursando/disciplina/:codigo/:anoIni/:semIni/:anoFim/:semFim', function (request, response) {
    var data = request.params;
    var codigo = data.codigo;
    var anoIni = data.anoIni;
    var anoFim = data.anoFim;
    var semIni = data.semIni;
    var semFim = data.semFim;
    var alunos = 0;
    sql = "SELECT numeroAlunos FROM desempenho WHERE (id BETWEEN (SELECT id FROM semestre WHERE ano = " + anoIni + " AND periodo = " + semIni + ") AND (SELECT id FROM semestre WHERE ano = " + anoFim + " AND periodo = " + semFim + ")) AND (codigo = '" + codigo + "')";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].numeroAlunos;
            }
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

// -------------- ALUNO/APROVADOS --------------

app.get('/api/stats/aluno/aprovados/all', function (request, response) {
    var alunos = 0;
    sql = "SELECT alunosAprovados FROM desempenho";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].alunosAprovados;
            }
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/aprovados/disciplina/:codigo', function (request, response) {
    var data = request.params;
    var codigo = data.codigo;
    var alunos = 0;
    sql = "SELECT alunosAprovados FROM desempenho WHERE codigo = '" + codigo + "'";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].alunosAprovados;
            }
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/aprovados/disciplina/all/:anoIni/:semIni/:anoFim/:semFim', function (request, response) {
    var data = request.params;
    var anoIni = data.anoIni;
    var anoFim = data.anoFim;
    var semIni = data.semIni;
    var semFim = data.semFim;
    var alunos = 0;
    sql = "SELECT alunosAprovados FROM desempenho WHERE id BETWEEN (SELECT id FROM semestre WHERE ano = " + anoIni + " AND periodo = " + semIni + ") AND (SELECT id FROM semestre WHERE ano = " + anoFim + " AND periodo = " + semFim + ")";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].alunosAprovados;
            }
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/aprovados/disciplina/:codigo/:anoIni/:semIni/:anoFim/:semFim', function (request, response) {
    var data = request.params;
    var codigo = data.codigo;
    var anoIni = data.anoIni;
    var anoFim = data.anoFim;
    var semIni = data.semIni;
    var semFim = data.semFim;
    var alunos = 0;
    sql = "SELECT alunosAprovados FROM desempenho WHERE (id BETWEEN (SELECT id FROM semestre WHERE ano = " + anoIni + " AND periodo = " + semIni + ") AND (SELECT id FROM semestre WHERE ano = " + anoFim + " AND periodo = " + semFim + ")) AND (codigo = '" + codigo + "')";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].alunosAprovados;
            }
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

// -------------- ALUNO/REPROVADOS/NOTA --------------

app.get('/api/stats/aluno/reprovados/nota/all', function (request, response) {
    var alunos = 0;
    sql = "SELECT reprovadosNota FROM desempenho";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].reprovadosNota;
            }
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/reprovados/nota/disciplina/:codigo', function (request, response) {
    var data = request.params;
    var codigo = data.codigo;
    var alunos = 0;
    sql = "SELECT reprovadosNota FROM desempenho WHERE codigo = '" + codigo + "'";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].reprovadosNota;
            }
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/reprovados/nota/disciplina/all/:anoIni/:semIni/:anoFim/:semFim', function (request, response) {
    var data = request.params;
    var anoIni = data.anoIni;
    var anoFim = data.anoFim;
    var semIni = data.semIni;
    var semFim = data.semFim;
    var alunos = 0;
    sql = "SELECT reprovadosNota FROM desempenho WHERE id BETWEEN (SELECT id FROM semestre WHERE ano = " + anoIni + " AND periodo = " + semIni + ") AND (SELECT id FROM semestre WHERE ano = " + anoFim + " AND periodo = " + semFim + ")";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].reprovadosNota;
            }
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/reprovados/nota/disciplina/:codigo/:anoIni/:semIni/:anoFim/:semFim', function (request, response) {
    var data = request.params;
    var codigo = data.codigo;
    var anoIni = data.anoIni;
    var anoFim = data.anoFim;
    var semIni = data.semIni;
    var semFim = data.semFim;
    var alunos = 0;
    sql = "SELECT reprovadosNota FROM desempenho WHERE (id BETWEEN (SELECT id FROM semestre WHERE ano = " + anoIni + " AND periodo = " + semIni + ") AND (SELECT id FROM semestre WHERE ano = " + anoFim + " AND periodo = " + semFim + ")) AND (codigo = '" + codigo + "')";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].reprovadosNota;
            }
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

// -------------- ALUNO/REPROVADOS/FALTAS --------------

app.get('/api/stats/aluno/reprovados/faltas/all', function (request, response) {
    var alunos = 0;
    sql = "SELECT reprovadosFalta FROM desempenho";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].reprovadosFalta;
            }
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/reprovados/faltas/disciplina/:codigo', function (request, response) {
    var data = request.params;
    var codigo = data.codigo;
    var alunos = 0;
    sql = "SELECT reprovadosFalta FROM desempenho WHERE codigo = '" + codigo + "'";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].reprovadosFalta;
            }
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/reprovados/faltas/disciplina/all/:anoIni/:semIni/:anoFim/:semFim', function (request, response) {
    var data = request.params;
    var anoIni = data.anoIni;
    var anoFim = data.anoFim;
    var semIni = data.semIni;
    var semFim = data.semFim;
    var alunos = 0;
    sql = "SELECT reprovadosFalta FROM desempenho WHERE id BETWEEN (SELECT id FROM semestre WHERE ano = " + anoIni + " AND periodo = " + semIni + ") AND (SELECT id FROM semestre WHERE ano = " + anoFim + " AND periodo = " + semFim + ")";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].reprovadosFalta;
            }
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/reprovados/faltas/disciplina/:codigo/:anoIni/:semIni/:anoFim/:semFim', function (request, response) {
    var data = request.params;
    var codigo = data.codigo;
    var anoIni = data.anoIni;
    var anoFim = data.anoFim;
    var semIni = data.semIni;
    var semFim = data.semFim;
    var alunos = 0;
    sql = "SELECT reprovadosFalta FROM desempenho WHERE (id BETWEEN (SELECT id FROM semestre WHERE ano = " + anoIni + " AND periodo = " + semIni + ") AND (SELECT id FROM semestre WHERE ano = " + anoFim + " AND periodo = " + semFim + ")) AND (codigo = '" + codigo + "')";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].reprovadosFalta;
            }
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

// -------------- ALUNO/REPROVADOS/ALL --------------

app.get('/api/stats/aluno/reprovados/all', function (request, response) {
    var alunos = 0;
    sql = "SELECT totalReprovados FROM desempenho";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].totalReprovados;
            }
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/reprovados/disciplina/:codigo', function (request, response) {
    var data = request.params;
    var codigo = data.codigo;
    var alunos = 0;
    sql = "SELECT totalReprovados FROM desempenho WHERE codigo = '" + codigo + "'";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].totalReprovados;
            }
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/reprovados/disciplina/all/:anoIni/:semIni/:anoFim/:semFim', function (request, response) {
    var data = request.params;
    var anoIni = data.anoIni;
    var anoFim = data.anoFim;
    var semIni = data.semIni;
    var semFim = data.semFim;
    var alunos = 0;
    sql = "SELECT totalReprovados FROM desempenho WHERE id BETWEEN (SELECT id FROM semestre WHERE ano = " + anoIni + " AND periodo = " + semIni + ") AND (SELECT id FROM semestre WHERE ano = " + anoFim + " AND periodo = " + semFim + ")";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].totalReprovados;
            }
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/reprovados/disciplina/:codigo/:anoIni/:semIni/:anoFim/:semFim', function (request, response) {
    var data = request.params;
    var codigo = data.codigo;
    var anoIni = data.anoIni;
    var anoFim = data.anoFim;
    var semIni = data.semIni;
    var semFim = data.semFim;
    var alunos = 0;
    sql = "SELECT totalReprovados FROM desempenho WHERE (id BETWEEN (SELECT id FROM semestre WHERE ano = " + anoIni + " AND periodo = " + semIni + ") AND (SELECT id FROM semestre WHERE ano = " + anoFim + " AND periodo = " + semFim + ")) AND (codigo = '" + codigo + "')";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].totalReprovados;
            }
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

// -------------- ALUNO/PORCENTAGEM/ --------------

app.get('/api/stats/aluno/porcentagem/aprovados/all', function (request, response) {
    var alunos = 0;
    sql = "SELECT porcentagemAprovacao FROM desempenho";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].porcentagemAprovacao;
            }
            alunos = alunos / result.length;
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/porcentagem/reprovados/all', function (request, response) {
    var alunos = 0;
    sql = "SELECT porcentagemReprovacao FROM desempenho";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].porcentagemReprovacao;
            }
            alunos = alunos / result.length;
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/porcentagem/aprovados/disciplina/:codigo', function (request, response) {
    var data = request.params;
    var codigo = data.codigo;
    var alunos = 0;
    sql = "SELECT porcentagemAprovacao FROM desempenho WHERE codigo = '" + codigo + "'";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].porcentagemAprovacao;
            }
            alunos = alunos / result.length;
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/porcentagem/reprovados/disciplina/:codigo', function (request, response) {
    var data = request.params;
    var codigo = data.codigo;
    var alunos = 0;
    sql = "SELECT porcentagemReprovacao FROM desempenho WHERE codigo = '" + codigo + "'";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].porcentagemReprovacao;
            }
            alunos = alunos / result.length;
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/porcentagem/aprovados/disciplina/all/:anoIni/:semIni/:anoFim/:semFim', function (request, response) {
    var data = request.params;
    var anoIni = data.anoIni;
    var anoFim = data.anoFim;
    var semIni = data.semIni;
    var semFim = data.semFim;
    var alunos = 0;
    sql = "SELECT porcentagemAprovacao FROM desempenho WHERE id BETWEEN (SELECT id FROM semestre WHERE ano = " + anoIni + " AND periodo = " + semIni + ") AND (SELECT id FROM semestre WHERE ano = " + anoFim + " AND periodo = " + semFim + ")";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].porcentagemAprovacao;
            }
            alunos = alunos / result.length;
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/porcentagem/reprovados/disciplina/all/:anoIni/:semIni/:anoFim/:semFim', function (request, response) {
    var data = request.params;
    var anoIni = data.anoIni;
    var anoFim = data.anoFim;
    var semIni = data.semIni;
    var semFim = data.semFim;
    var alunos = 0;
    sql = "SELECT porcentagemReprovacao FROM desempenho WHERE id BETWEEN (SELECT id FROM semestre WHERE ano = " + anoIni + " AND periodo = " + semIni + ") AND (SELECT id FROM semestre WHERE ano = " + anoFim + " AND periodo = " + semFim + ")";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].porcentagemReprovacao;
            }
            alunos = alunos / result.length;
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/porcentagem/aprovados/disciplina/:codigo/:anoIni/:semIni/:anoFim/:semFim', function (request, response) {
    var data = request.params;
    var codigo = data.codigo;
    var anoIni = data.anoIni;
    var anoFim = data.anoFim;
    var semIni = data.semIni;
    var semFim = data.semFim;
    var alunos = 0;
    sql = "SELECT porcentagemAprovacao FROM desempenho WHERE (id BETWEEN (SELECT id FROM semestre WHERE ano = " + anoIni + " AND periodo = " + semIni + ") AND (SELECT id FROM semestre WHERE ano = " + anoFim + " AND periodo = " + semFim + ")) AND (codigo = '" + codigo + "')";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].porcentagemAprovacao;
            }
            alunos = alunos / result.length;
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});

app.get('/api/stats/aluno/porcentagem/reprovados/disciplina/:codigo/:anoIni/:semIni/:anoFim/:semFim', function (request, response) {
    var data = request.params;
    var codigo = data.codigo;
    var anoIni = data.anoIni;
    var anoFim = data.anoFim;
    var semIni = data.semIni;
    var semFim = data.semFim;
    var alunos = 0;
    sql = "SELECT porcentagemReprovacao FROM desempenho WHERE (id BETWEEN (SELECT id FROM semestre WHERE ano = " + anoIni + " AND periodo = " + semIni + ") AND (SELECT id FROM semestre WHERE ano = " + anoFim + " AND periodo = " + semFim + ")) AND (codigo = '" + codigo + "')";
    connection.query(sql, function (err, result) {
        if (err) {
            reply = {
                content: err,
                status: "fail"
            }
        } else {
            for (let i = 0; i < result.length; i++) {
                alunos += result[i].porcentagemReprovacao;
            }
            alunos = alunos / result.length;
            reply = {
                content: alunos,
                status: "sucess"
            }
        }
        response.send(reply);
    });
});