
\COPY questions(question_id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness) FROM 'datafiles/questions.csv' WITH DELIMITER ',' CSV HEADER;

\COPY answers(answer_id, question_id, body, date, answerer_name, answerer_email, reported, helpfulness) FROM 'datafiles/answers.csv' WITH DELIMITER ',' CSV HEADER;

\COPY photos(photo_id, answer_id, url) FROM 'datafiles/answers_photos.csv' WITH DELIMITER ',' CSV HEADER;

SELECT setval('questions_seq', (SELECT max(question_id) FROM questions)+1);

SELECT setval('answers_seq', (SELECT max(answer_id) FROM answers)+1);

SELECT setval('photos_seq', (SELECT max(photo_id) FROM photos)+1);



ALTER TABLE questions ALTER COLUMN question_date SET DATA TYPE timestamp with time zone USING to_timestamp(question_date/1000);
ALTER TABLE answers ALTER COLUMN date SET DATA TYPE timestamp with time zone USING to_timestamp(date/1000);