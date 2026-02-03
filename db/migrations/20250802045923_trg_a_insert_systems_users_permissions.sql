-- migrate:up

CREATE TRIGGER trg_a_insert_users_permissions
AFTER INSERT ON users_permissions
BEGIN
  INSERT INTO users_roles (user_id, role_id, created)
  SELECT
    NEW.user_id,
    p.role_id,
    NEW.created
  FROM permissions p
  WHERE p.id = NEW.permission_id
    AND NOT EXISTS (
      SELECT 1
      FROM users_roles ur
      WHERE ur.user_id = NEW.user_id
        AND ur.role_id = p.role_id
    );
END;


-- migrate:down

DROP TRIGGER IF EXISTS trg_a_insert_users_permissions;
