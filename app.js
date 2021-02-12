const mysql = require('mysql')
const inquirer = require('inquirer')

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
                "Update an employee's role",
                "View all by departments",
                "View all by roles",
                "View all by employees",
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

                case "Update an employee's role":
                    updateEmployeeRole()
                    break

                case "View all by departments":
                    viewDepartments()
                    break

                case "View all by roles":
                    viewRoles()
                    break

                case "View all by employees":
                    viewEmployees()
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

