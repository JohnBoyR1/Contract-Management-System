--Chatroom table will be developed when a discussion is had about what exactly is required for a chatroom to function
--create database contractdev_db;

--User accounts creation statement
create table user_accounts(
user_account_id SERIAL not null primary key,--SERIAL will automatically incrament 
user_signup_email varchar(255) unique not null,--Constraint below for our allowed email providers
security_question text not null,--An ENUM was implemented here but it made no sense as the security questions are pre selected and are NOT inputted by the user
security_answer text not null,
hashed_password text not null--Of type text as the hashed password will vary in length between user
);

--Allowed email provider check
alter table user_accounts
add constraint allowed_email_providers

CHECK(
--ILIKE the case sensitive version of LIKE. It is used to prevent an error from occuring if a user were to input for example email@Gmail.com https://www.datacamp.com/doc/postgresql/like
user_signup_email ilike '%@gmail.com' or
user_signup_email ilike '%@outlook.com' or
user_signup_email ilike '%@icloud.com' or
user_signup_email ilike '%@yahoo.com' or
user_signup_email ilike '%@hotmail.com' or
user_signup_email ilike '%@proton.me' or
user_signup_email ilike '%@protonmail.com' or
user_signup_email ilike '%@pm.me'
);

--Relational table for displaying the socials on the users profile
create table social_connections(
user_account_id integer not null primary key,
facebook_link text default '' ,
user_social_email_link text default '' ,
x_link text default '' ,
github_link text default '' ,
linkedin_link text default '',

constraint fk_account foreign key(user_account_id)--Foreign Key constraint
references user_accounts(user_account_id)
on delete cascade--When the user account gets deleted, every data entry associated with that user_account_id will get deleted
);

alter table social_connections--Constraints to check if the social media links are empty or are the valid social media links 
add constraint check_facebook_link check (facebook_link = '' or facebook_link ilike 'facebook.com/%'),
add constraint check_x_link check (x_link = '' or x_link ilike 'x.com/%'),
add constraint check_github_link check (github_link = '' or github_link ilike 'github.com/%'),
add constraint check_linkedin_link check (linkedin_link = '' or linkedin_link ilike 'linkedin.com/in/%');

--User review creation statement
create table user_reviews(
user_account_id integer not null primary key,
number_of_reviews integer not null default 0,
total_review_points float not null default 0,
average_review_score float not null default 0,

constraint fk_account foreign key(user_account_id)
references user_accounts(user_account_id)
on delete cascade
);

--User profile creation statement
create table user_profiles(
user_profile_id SERIAL not null primary key,
username varchar(50) unique not null,
first_name varchar (30) not null,
last_name varchar (30) not null,
country varchar (2) not null,-- ISO 3166-1 alpha-2 is in use for the country codes
bio varchar (255) not null,
phone_number varchar(15) not null,
description varchar(20),--Describes whether a user is a developer, client or both
user_title varchar(50),--This is the title the user would provide themselves e.g. Senior Developer, Graduate etc...
last_login timestamptz,--Displays the time and date that the user logged in last in the UTC timezone, which is the default timezeone for timestamptz https://www.datacamp.com/doc/postgresql/timestamptz 
available_for_work boolean default false,
offering_work boolean default false,
username_display boolean default false,
hide_phone_number boolean default false ,
profile_picture_filepath varchar(512) not null,--Stores the filepath of the users profile picture
profile_picture_extension varchar(5) not null,
user_account_id integer not null,

constraint fk_account foreign key(user_account_id)
references user_accounts(user_account_id)
on delete cascade
);

--Skills table creation statement, needed to associate each skill with an ID so that each user can be associated with a skill
create table skills(
skill_id SERIAL primary key,
skill_name VARCHAR(50) unique not null
);

--Insert skills into skills table
insert into skills (skill_name) values
('HTML'), ('CSS'), ('JavaScript'), ('Angular'), ('React'), ('Bootstrap'), 
('PostgreSQL'), ('MySQL'), ('MongoDB'), ('AWS'), ('Docker'), ('Java'), 
('Python'), ('C#'), ('C++'), ('C'), ('Rust'), ('Go'), ('TypeScript'), ('Frontend'), ('Backend'), ('Cloud Developer'), ('Full Stack'), ('Mobile Developer'), ('Database Developer'), ('Web Developer');

--User skils creation statement, this table will act as the bridge between a user having skills
create table user_skills(
user_account_id integer not null,
skill_id integer not null,
primary key(user_account_id, skill_id),

constraint fk_account foreign key(user_account_id)
references user_accounts(user_account_id)
on delete cascade,

constraint fk_skill foreign key(skill_id)
references skills(skill_id)
on delete cascade
);
