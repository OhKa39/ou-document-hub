insert INTO
    roles (role_id, role_name)
VALUES (
        'aac945b3-8d51-4f4e-8e6c-44f3e6aef6d4',
        'ROLE_USER'
    );

insert INTO
    roles (role_id, role_name)
VALUES (
        '0f11b6e4-8071-443d-8080-20115674cbcc',
        'ROLE_GODADMIN'
    );

insert INTO
    roles (role_id, role_name)
VALUES (
        '8fe542ea-0dba-4b36-8501-6ef0a2982df1',
        'ROLE_ADMIN'
    );

insert INTO
    users (
        user_id,
        email,
        password,
        first_name,
        last_name,
        gender,
        date_of_birth,
        is_banned,
        is_enable,
        provider
    )
VALUES (
        '4ec8a330-50d9-4cd7-9cfd-dd85b00e2ed8',
        'lythanhkhoa360@gmail.com',
        '$2a$10$ztsscbRcpDxUsTNNvy2BV.LeI1KPUatn.8Sgxz/3P5kDdTgTUd00u',
        'Khoa',
        'Ly',
        'Male',
        '2003-09-03',
        false,
        true,
        'APP'
    );

INSERT INTO
    user_role (user_id, role_id)
VALUES (
        '4ec8a330-50d9-4cd7-9cfd-dd85b00e2ed8',
        '0f11b6e4-8071-443d-8080-20115674cbcc'
    );

INSERT INTO
    user_role (user_id, role_id)
VALUES (
        '4ec8a330-50d9-4cd7-9cfd-dd85b00e2ed8',
        'aac945b3-8d51-4f4e-8e6c-44f3e6aef6d4'
    )