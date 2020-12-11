var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require('console.table');

// set up connection information
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "employeeTracker"
});

// connect to the database
connection.connect(function(err){
    if (err) throw err;
    //call to start prompt
    runSearch();
});

function runSearch(){
  //initial prompt selection list
    inquirer.prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
            "View Employees",
            "View Departments",
            "View Roles",
            "Update Employee's Role",
            "Add Employee",
            "Add Department",
            "Add Role"
        ]
    })
    //allows to call each function based off user selection
    .then(function(val){
        switch (val.action){
            case "View Employees":
                viewEmployees();
                break;
            case "View Departments":
                viewDepartments();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "Update Employee's Role":
                updateEmployeeRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
        }
    });
}

// View Employees
function viewEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;", 
    function(err, res) {
      if (err) throw err;
      // log all results of the SELECT statement
      console.table(res);
      //shows initial prompt selection list
      runSearch();
  })
}

// View Departments
function viewDepartments() {
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", 
    function(err, res) {
      if (err) throw err;
      console.table(res);
      runSearch();
    })
  }

// View Roles
function viewRoles() {
  connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;", 
  function(err, res) {
  if (err) throw err;
  console.table(res);
  runSearch();
  })
}


// Choose a role for new employee
var roleArr = [];
function chooseRole() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }

  })
  return roleArr;
}

// Choose a manager for new employee
var managersArr = [];
function chooseManager() {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", 
  function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }

    })
    return managersArr;
  }

// Update Employee 
function updateEmployeeRole() {
    connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", 
    function(err, res) {
     if (err) throw err
     console.log(res)
      inquirer.prompt([
          {
            name: "lastName",
            type: "rawlist",
            choices: function() {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "What is the Employee's last name? ",
          },
          {
            name: "role",
            type: "rawlist",
            message: "What is the Employees new title? ",
            choices: chooseRole()
          },
        ]).then(function(val) {
          var roleId = chooseRole().indexOf(val.role) + 1
          connection.query("UPDATE employee SET WHERE ?", 
          {
            last_name: val.lastName,
            role_id: roleId
          }, 
          function(err){
              if (err) throw err;
              console.table(val);
              runSearch();
          })
    });
  });

  }

// Add Employee
function addEmployee() { 
    inquirer.prompt([
        {
          name: "firstname",
          type: "input",
          message: "Enter employee's first name "
        },
        {
          name: "lastname",
          type: "input",
          message: "Enter employee's last name "
        },
        {
          name: "role",
          type: "list",
          message: "What is the employee's role? ",
          //user can select a role from list
          choices: chooseRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Who is the employee's manager?",
            //user can select a manager from list
            choices: chooseManager()
        }
    ]).then(function (res) {
      var roleId = chooseRole().indexOf(res.role) + 1
      var managerId = chooseManager().indexOf(res.choice) + 1
      connection.query("INSERT INTO employee SET ?", 
        {
          first_name: res.firstName,
          last_name: res.lastName,
          manager_id: managerId,
          role_id: roleId
        },
            function(err, res){
                if (err) throw err;
                //prompt user of action completion
                console.table(res + " employee has been added\n");
                runSearch();
            })

  })
}

// Add Employee Role 
function addRole() { 
  connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role",
  function(err, res) {
    inquirer.prompt([
        {
          name: "Title",
          type: "input",
          message: "What is the Title?"
        },
        {
          name: "Salary",
          type: "input",
          message: "Enter Salary?"
        } 
    ]).then(function(res) {
         connection.query(
            "INSERT INTO role SET ?",
            {
              title: res.Title,
              salary: res.Salary,
            },
            function(err, res) {
                if (err) throw err;
                //prompt user of action completion
                console.table(res + " employee role inserted\n");
                runSearch();
            }
        )
    });
  });
  }

// Add Department
function addDepartment() { 

    inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "What Department are you adding?"
        }
    ]).then(function(res) {
        connection.query("INSERT INTO department SET ? ",
            {
              name: res.name
            },
            function(err, res) {
                if (err) throw err
                //prompt user of action completion
                console.table(res + " department added\n");
                runSearch();
            }
        )
    })
}