-- migrate:up

INSERT INTO systems (id, name, description, repository, created, updated) VALUES (1, 'Servicio de Archivos', 'Microservicio para subir archivos', 'https://github.com/pepeul1191/file-koa', '2024-05-10 12:41:54', '2024-05-30 12:41:54');
INSERT INTO systems (id, name, description, repository, created, updated) VALUES (2, 'Aula Virtual', 'Prototipo de Aula Virtual', 'https://github.com/pepeul1191/template-node-express-svelte', '2023-05-23 15:37:03', '2023-06-17 15:37:03');

-- migrate:down

DELETE FROM systems;