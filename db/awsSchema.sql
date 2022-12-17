DROP DATABSE IF EXISTS sdcqa;
CREATE DATABASE sdcqa;

DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
  question_id INT NOT NULL,
  product_id INT NOT NULL,
  asker_name VARCHAR(50) NOT NULL,
  asker_email VARCHAR(100) NOT NULL,
  question_body TEXT NOT NULL,
  question_date bigint not null,
  question_helpfulness INT DEFAULT 0,
  reported boolean DEFAULT '0'
);

CREATE SEQUENCE questions_seq START 1 INCREMENT 1 OWNED BY questions.question_id;

DROP TABLE IF EXISTS answers;

CREATE TABLE answers (
  answer_id INT NOT NULL,
  question_id INT NOT NULL,
  answerer_name VARCHAR(50) NOT NULL,
  answerer_email VARCHAR(100) NOT NULL,
  body TEXT NOT NULL,
  date bigint NOT NULL,
  helpfulness INT DEFAULT 0,
  reported boolean DEFAULT '0'
);

CREATE SEQUENCE answers_seq START 1 INCREMENT 1 OWNED BY answers.answer_id;

DROP TABLE IF EXISTS photos;

CREATE TABLE photos(photo_id INT NOT NULL, url TEXT, answer_id INT NOT NULL);

CREATE SEQUENCE photos_seq START 1 INCREMENT 1 OWNED BY photos.photo_id;


CREATE INDEX product_id_idx ON questions(product_id);
CREATE INDEX question_id_idx ON answers(question_id);
CREATE INDEX answer_id_idx ON photos(answer_id);
CREATE INDEX only_question_idx ON questions(question_id);
CREATE INDEX only_answer_idx ON answers(answer_id);

