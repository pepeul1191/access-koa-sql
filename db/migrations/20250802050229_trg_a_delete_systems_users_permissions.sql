-- migrate:up

CREATE TRIGGER trg_a_delete_users_permissions
AFTER DELETE ON users_permissions
BEGIN
  DELETE FROM users_roles
  WHERE user_id = OLD.user_id
    AND role_id = (
      SELECT role_id
      FROM permissions
      WHERE id = OLD.permission_id
    )
    AND NOT EXISTS (
      SELECT 1
      FROM users_permissions up
      JOIN permissions p ON up.permission_id = p.id
      WHERE up.user_id = OLD.user_id
        AND p.role_id = (
          SELECT role_id
          FROM permissions
          WHERE id = OLD.permission_id
        )
    );
END;


-- migrate:down

DROP TRIGGER IF EXISTS trg_a_delete_users_permissions;
