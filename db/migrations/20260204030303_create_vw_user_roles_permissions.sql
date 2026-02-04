-- migrate:up

CREATE VIEW vw_user_roles_permissions AS
SELECT
    U.id AS user_id,
    U.username,
    SU.system_id,
    R.id AS role_id,
    R.name AS role_name,
    P.id AS permission_id,
    P.name AS permission_name
FROM users U
INNER JOIN systems_users SU 
    ON SU.user_id = U.id
INNER JOIN users_roles UR
    ON UR.user_id = U.id
INNER JOIN roles R
    ON R.id = UR.role_id
    AND R.system_id = SU.system_id
INNER JOIN permissions P
    ON P.role_id = R.id;

-- migrate:down

DROP VIEW vw_user_roles_permissions;