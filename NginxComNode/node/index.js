const http = require('http');
const querystring = require('querystring');

const mysql = require('mysql');
const hostname = '0.0.0.0';
const port = 3000;
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};

const htmlUpResponse = `<h1>Full Cycle Rocks!</h1><br />
                        <p style='margin-left: 15px'>Insira um nome:</p>
                          <form action='insert' method='post'>
                            <input type='text' name='name' style='margin-left: 15px'/>
                            <input type='submit' value='Inserir'/>
                          </form>
                        <h2 style='margin-left: 15px'>Lista de Cadastrados no Banco: </h2><br />`;
var listResponse = '';

listRows();

const server = http.createServer((req, res) => {   
  
  if(req.method == 'POST') 
  {
      let body = '';
        
      req.on('error', (err) => {
          if(err) console.log(err);

          listRows(responseCallback, res);
      });
      
      req.on('data', chunk => {
          body += chunk.toString();
      });
      
      req.on('end', () => {
          body = querystring.parse(body);          

          if (removeStartAndEndSpaces(body.name))
            insertName(body.name, res);
          else
            listRows(responseCallback, res);
      });
  }  
  else
  listRows(responseCallback, res);
  
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


function listRows(callback, response){
  let conn = mysql.createConnection(config);
  const sqlSelect = "SELECT Name FROM People";
  conn.query(sqlSelect, function (err, result) {
    if (err) 
      console.log(err);
    else {
      console.log("Consulta realizada com sucesso");
      
      listResponse = '';
      result.forEach((p) => {
        listResponse += `<p style='margin-left: 15px'>${p.Name}</p>`;
      })
    }

    if(callback)
        callback(response);    

  });
  conn.end();
}

function insertName(name, response){
  let conn = mysql.createConnection(config);
  const sqlInsert = `INSERT INTO People(Name) VALUES('${name}')`;
  conn.query(sqlInsert, function (err, result) {
    if (err) 
        console.log(err);      
    else {      
      console.log("Registro inserido com sucesso");
      listRows(responseCallback, response);
    }
  });
  conn.end();
}

function responseCallback(response){
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.end(htmlUpResponse + listResponse);
}

function removeStartAndEndSpaces(text) {
  return text.replace(/^\s+/g, '').replace(/\s+$/g, '');
}