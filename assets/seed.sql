DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

--- Department Table ---
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);
--- Role Table ---
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);
--- Employee Table ---
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT NULL,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

--- Department Seeds ---
INSERT INTO department (name)
VALUES ("Management"),
("Sales"),
("Human Resouces"),
("Operations");

--- Role Seeds ---
INSERT INTO role (title, salary, department_id)
VALUES ("President", 200000.00, 1),
("Store Manager", 65000.00, 1),
("Assistant Store Manager", 50000.00, 1),
("Sales Representative", 65000.00, 2),
("Sales Associate", 40000.00, 2),
("Operations Associate", 40000.00, 4),
("Operations Lead", 50000.00, 4),
("Director of Human Resources", 100000.00, 3),
("Recruiter", 50000.00, 3);

--- Employee Seeds ---
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Annie", "McFarland", 1, null),
("Susanna", "McFarland", 7, 1),
("Curtis", "Correll", 4, 1),
("Alex", "Correll", 8, 1),
("Lucas", "Correll", 3, 6),
("Declan", "Correll", 2, 1),
("Alaina", "Correll", 9, 4),
("Caiden", "Correll", 4, 1),
("Etta", "James", 5, 3),
("Ella", "Fitzgerald", 6, 2);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;