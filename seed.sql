-- Department Seed --
INSERT INTO department (name)
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Legal');

-- Roles Seed --
INSERT INTO roles (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1), ('Salesperson', 80000, 1), ('Lead Engineer', 150000, 2), ('Software Engineer', 120000, 2), ('Accountant', 125000, 3), ('Legal Team Lead', 250000, 4), ('Lawyer', 190000, 4);


-- Employee Seed --
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, null), ('Mike', 'Chan', 4, 2), ('Ashley', 'Rodriguez', 2, 1), ('Kevin', 'Tupik', 2, 1), ('Malia', 'Brown', 6, null), ('Sarah', 'Lourd', 2, 1), ('Tom', 'Allen', 3, null);