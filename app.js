const mysql = require('mysql')
const inquirer = require('inquirer')
const cTable = require('console.table')

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employee_db',
})

connection.connect((err) => {
    if (err) throw err
    console.log("Connected as Id" + connection.threadId)
    launchApp()
})

// Initial Question //
const launchApp = () => {
    console.log("Welcome to Employee Manager!")
    inquirer
        .prompt({
            name: "question1",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add a department",
                "Add a role",
                "Add an employee",
                "View employees by departments",
                "View employees by roles",
                "View all employees",
                "Update an employee's role",
                "Quit"
            ]
        }).then((answer) => {
            switch (answer.question1) {
                case "Add a department":
                    addDepartment()
                    break

                case "Add a role":
                    addRole()
                    break

                case "Add an employee":
                    addEmployee()
                    break

                case "View employees by departments":
                    viewDepartments()
                    break

                case "View employees by roles":
                    viewRoles()
                    break

                case "View all employees":
                    viewEmployees()
                    break

                case "Update an employee's role":
                    updateEmployeeRole()
                    break

                case "Quit":
                    quit()
                    break

                default:
                    console.log(`Invalid action: ${answer.question1}`)
                    break
            }
        })
}

// Add Department //
const addDepartment = () => {
    inquirer
        .prompt({
            name: 'departmentQ',
            type: 'input',
            message: 'What Department would you like to add?',
        })
        .then((answer) => {
            let query = "INSERT INTO department (name) VALUES (?)"
            connection.query(query, [answer.departmentQ], (err, res) => {
                if (err) throw err;
                console.table(res)
                launchApp()
            }
            )

        })
}

// Add Role //
const addRole = () => {
    connection.query("SELECT role.title AS title, role.salary AS salary FROM role", (err, res) => {
        if (err) throw err
        console.log(res)
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "What is the roles title?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary?"
            }
        ]).then((answer) => {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                },
                (err, res) => {
                    if (err) throw err
                    console.table(res);
                    launchApp();
                }
            )

        });
    });
}

// Make sure all roles and managers are up to date when choices are displayed, when adding an employee //
let roleArr = [];
const roleOptions = () => {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }

    })
    return roleArr;
}

let managersArr = [];
const managerOptions = () => {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", (err, res) => {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            managersArr.push(res[i].first_name);
        }

    })
    return managersArr;
}

// Add Employee //
const addEmployee = () => {
    inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "Enter their first name."
        },
        {
            name: "lastname",
            type: "input",
            message: "Enter their last name."
        },
        {
            name: "role",
            type: "list",
            message: "What is their role? ",
            choices: roleOptions()
        },
        {
            name: "choice",
            type: "list",
            message: "Whats their managers name?",
            choices: managerOptions()
        }
    ]).then((answer) => {
        var roleId = roleOptions().indexOf(answer.role) + 1
        var managerId = managerOptions().indexOf(answer.choice) + 1
        connection.query("INSERT INTO employee SET ?",
            {
                first_name: answer.firstName,
                last_name: answer.lastName,
                manager_id: managerId,
                role_id: roleId

            }, (err, res) => {
                if (err) throw err
                console.table(res)
                launchApp()
            })

    })
}

// View Employees by Department //
const viewDepartments = () => {
    let query = "SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;"
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        launchApp();
    })
}

// View Employees by Role //
const viewRoles = () => {
    let query = "SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id"
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        launchApp();
    })
}

// View All Employees //
const viewEmployees = () => {
    let query = "SELECT * FROM employee"
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        launchApp();
    })
}

// Update Employee //
const updateEmployeeRole = () => {
    connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", (err, res) => {
        inquirer.prompt([
            {
                name: "lastName",
                type: "list",
                choices: () => {
                    var lastName = [];
                    for (var i = 0; i < res.length; i++) {
                        lastName.push(res[i].last_name);
                    }
                    return lastName;
                },
                message: "What is the Employee's last name?",
            },
            {
                name: "role",
                type: "list",
                message: "What is the Employees new title?",
                choices: roleOptions()
            },
        ]).then((answer) => {
            let roleId = roleOptions().indexOf(answer.role) + 1
            connection.query("UPDATE employee SET WHERE ?",
                {
                    last_name: answer.lastName
                },
                {
                    role_id: roleId
                },
                (err) => {
                    if (err) throw err
                    console.table(answer)
                    launchApp()
                })
        })
    })

}

const quit = () => {
    console.log("Goodbye!")
}