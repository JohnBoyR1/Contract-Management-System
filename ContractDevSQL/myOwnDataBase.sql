-- ============================================
-- DATABASE SCHEMA: contractdev_db
-- ============================================

-- ================
-- USER ACCOUNTS
-- ================
CREATE TABLE user_accounts (
    user_account_id SERIAL PRIMARY KEY,
    user_signup_email VARCHAR(255) UNIQUE NOT NULL,
    security_question TEXT NOT NULL,
    security_answer TEXT NOT NULL,
    hashed_password TEXT NOT NULL
);

-- Allowed email provider constraint
ALTER TABLE user_accounts
ADD CONSTRAINT allowed_email_providers CHECK (
    user_signup_email ILIKE '%@gmail.com' OR
    user_signup_email ILIKE '%@outlook.com' OR
    user_signup_email ILIKE '%@icloud.com' OR
    user_signup_email ILIKE '%@yahoo.com' OR
    user_signup_email ILIKE '%@hotmail.com' OR
    user_signup_email ILIKE '%@proton.me' OR
    user_signup_email ILIKE '%@protonmail.com' OR
    user_signup_email ILIKE '%@pm.me'
);

-- ==========================
-- SOCIAL CONNECTIONS (1:1)
-- ==========================
CREATE TABLE social_connections (
    user_account_id INTEGER PRIMARY KEY,
    facebook_link TEXT DEFAULT '',
    user_social_email_link TEXT DEFAULT '',
    x_link TEXT DEFAULT '',
    github_link TEXT DEFAULT '',
    linkedin_link TEXT DEFAULT '',

    CONSTRAINT fk_account_social
        FOREIGN KEY (user_account_id)
        REFERENCES user_accounts(user_account_id)
        ON DELETE CASCADE
);

ALTER TABLE social_connections
ADD CONSTRAINT check_facebook_link CHECK (facebook_link = '' OR facebook_link ILIKE '%facebook.com/%'),
ADD CONSTRAINT check_x_link CHECK (x_link = '' OR x_link ILIKE '%x.com/%'),
ADD CONSTRAINT check_github_link CHECK (github_link = '' OR github_link ILIKE '%github.com/%'),
ADD CONSTRAINT check_linkedin_link CHECK (linkedin_link = '' OR linkedin_link ILIKE '%linkedin.com/in/%');

-- ==========================
-- USER REVIEWS (AGGREGATED)
-- ==========================
CREATE TABLE user_reviews (
    user_account_id INTEGER PRIMARY KEY,
    number_of_reviews INTEGER NOT NULL DEFAULT 0,
    total_review_points FLOAT NOT NULL DEFAULT 0,
    average_review_score FLOAT NOT NULL DEFAULT 0,

    CONSTRAINT fk_account_reviews
        FOREIGN KEY (user_account_id)
        REFERENCES user_accounts(user_account_id)
        ON DELETE CASCADE
);

-- ==========================
-- USER PROFILES (1:1)
-- ==========================
CREATE TABLE user_profiles (
    user_profile_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    country VARCHAR(2) NOT NULL,
    bio VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    description VARCHAR(20),
    user_title VARCHAR(50),
    last_login TIMESTAMPTZ,
    available_for_work BOOLEAN DEFAULT FALSE,
    offering_work BOOLEAN DEFAULT FALSE,
    username_display BOOLEAN DEFAULT FALSE,
    hide_phone_number BOOLEAN DEFAULT FALSE,
    profile_picture_filepath VARCHAR(512) NOT NULL,
    profile_picture_extension VARCHAR(5) NOT NULL,
    user_account_id INTEGER NOT NULL,

    CONSTRAINT fk_account_profile
        FOREIGN KEY (user_account_id)
        REFERENCES user_accounts(user_account_id)
        ON DELETE CASCADE
);

-- ==========================
-- SKILLS DICTIONARY
-- ==========================
CREATE TABLE skills (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO skills (skill_name) VALUES
('HTML'), ('CSS'), ('JavaScript'), ('Angular'), ('React'), ('Bootstrap'),
('PostgreSQL'), ('MySQL'), ('MongoDB'), ('AWS'), ('Docker'), ('Java'),
('Python'), ('C#'), ('C++'), ('C'), ('Rust'), ('Go'), ('TypeScript'),
('Frontend'), ('Backend'), ('Cloud Developer'), ('Full Stack'),
('Mobile Developer'), ('Database Developer'), ('Web Developer');

-- ==========================
-- USER SKILLS (MANY-TO-MANY)
-- ==========================
CREATE TABLE user_skills (
    user_account_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    PRIMARY KEY (user_account_id, skill_id),

    CONSTRAINT fk_account_skill
        FOREIGN KEY (user_account_id)
        REFERENCES user_accounts(user_account_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_skill
        FOREIGN KEY (skill_id)
        REFERENCES skills(skill_id)
        ON DELETE CASCADE
);

-- ============================================
-- INDIVIDUAL USER RATINGS (NEW TABLE)
-- ============================================
CREATE TABLE user_individual_ratings (
    rating_id SERIAL PRIMARY KEY,

    reviewer_id INTEGER NOT NULL,
    user_account_id INTEGER NOT NULL,

    -- Category scores (1–5)
    time_management_score INTEGER NOT NULL CHECK (time_management_score BETWEEN 1 AND 5),
    payment_reliability_score INTEGER NOT NULL CHECK (payment_reliability_score BETWEEN 1 AND 5),
    communication_score INTEGER NOT NULL CHECK (communication_score BETWEEN 1 AND 5),
    collaboration_score INTEGER NOT NULL CHECK (collaboration_score BETWEEN 1 AND 5),
    recommendation_score INTEGER NOT NULL CHECK (recommendation_score BETWEEN 1 AND 5),

    -- Foreign keys
    CONSTRAINT fk_reviewer
        FOREIGN KEY (reviewer_id)
        REFERENCES user_accounts(user_account_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_target_account
        FOREIGN KEY (user_account_id)
        REFERENCES user_accounts(user_account_id)
        ON DELETE CASCADE,

    -- Prevent self-rating
    CONSTRAINT no_self_rating CHECK (reviewer_id <> user_account_id),

    -- Prevent duplicate ratings
    CONSTRAINT unique_rating_pair UNIQUE (reviewer_id, user_account_id)
);