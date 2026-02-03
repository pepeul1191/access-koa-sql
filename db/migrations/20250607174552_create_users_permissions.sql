-- migrate:up

CREATE TABLE users_permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  permission_id INTEGER NOT NULL,
  created DATETIME NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(permission_id) REFERENCES permissions(id)
);

-- migrate:down

DROP TABLE users_permissions;