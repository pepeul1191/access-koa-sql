-- migrate:up

UPDATE users SET password = '$2b$10$vovWBBgdVkzx/jRsleOvyO1VcR.oW5XACDfruwIppgvw0PA/dehUK';

-- migrate:down

UPDATE users SET password = '123';