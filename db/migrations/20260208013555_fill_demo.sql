-- migrate:up

INSERT INTO systems_users (id, system_id, user_id, created) VALUES (1,2,1,'2023-06-17 15:37:03');

INSERT INTO roles (id, name, created, updated, system_id) VALUES (1, 'File Managment', '2023-05-23 15:37:03', '2023-06-17 15:37:03', 2);

INSERT INTO permissions (id, name, created, updated, role_id) VALUES (1, 'file-manager', '2023-05-23 15:37:03', '2023-06-17 15:37:03', 1);

INSERT INTO users_permissions (id, user_id, permission_id, created) VALUES (1,1,1,'2023-06-17 15:37:03');

-- migrate:down

DELETE FROM users_permissions
WHERE id = 1;

DELETE FROM permissions
WHERE id = 1;

DELETE FROM roles
WHERE id = 1;

DELETE FROM systems_users
WHERE id = 1;
