# Retail Q&A | Back-end services for e-commerce web app

Our 3 software engineers rebuilt back-end API service for a monolithic to service-oriented micorservices to support our existing e-commerce site in this project. The service I built was scaled to meet the demands of production traffic with 8000RPS with < 40ms response time with 0% error rate.

## Techonologies Used

Backend Development: Node.js | Express | Postgres | NGINX
</br>
Deployement: Docker | AWS EC2
</br>
Testing: Jest | SuperTest | K6 | Loader.io

---
## Table of Contents
  - <a href='#system-design'>System Design</a>
  - <a href='#usage'>Usage</a>
  - <a href='#db-initialization-and-etl-quaries-in-postgres'>DB Initialization and ETL Quaries in Postgres</a>
  - <a href='#installation'>Installation</a>
  - <a href='#other-services'>Other Services</a>
 
---
## System Design
  ### Database Design
  ![overview_schema_design](https://user-images.githubusercontent.com/86500068/206362908-cb498145-7795-4460-b35a-c44a25169bd2.png)
  
  ### Architecture
  ![Architecture](https://user-images.githubusercontent.com/84343573/184517126-bd7eb432-7719-462c-a325-9b558d8b4039.png)
  
   ### Stress Test Results via Loader.io
   <img width="1100" alt="load tests 1" src="https://user-images.githubusercontent.com/86500068/211911479-5581195f-2e1d-4ad4-a6af-cea76f725dd1.png">
   <img width="1100" alt="load tests 2" src="https://user-images.githubusercontent.com/86500068/211912469-5c6f8bb9-72b8-43f9-a938-c9270d6f67aa.png">
   <img width="1100" alt="load tests 3" src="https://user-images.githubusercontent.com/86500068/211911384-9d892f9f-5956-478e-83eb-7ec22597391f.png">
   
   ---
## Usage
  ### List questions
  Retrieves a list of questions for a particular product. This list does not include any reported questions

  `GET /qa/questions`
  
  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | product_id |  integer  | Required ID of the question for which data should be returned |
  | page |  integer  | Selects the page of results to return. Default 1. |
  | count |  integer  | Specifies how many results per page to return. Default 5 |

  Response: `Status: 200 OK`
  
  <img alt="GET /qa/questions" src="https://user-images.githubusercontent.com/86500068/212131181-19cc8137-84c1-4a7c-8478-72b9c9046252.png">

  
  ### Answers List
  Returns answers for a given question. This list does not include any reported answers

  `GET /qa/questions/:question_id/answers`

  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | question_id |  integer  | Required ID of the question for which answers are needed |

  Response: `Status: 200 OK`
  
  <img alt="GET /qa/questions/:question_id/answers" src="https://user-images.githubusercontent.com/86500068/212131227-f4a5a3a7-56a5-4ec8-96e1-00f6bdfd0b72.png">
 
  
  ### Add a Question
  Adds a question for the given product

  `POST /qa/questions`

  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | body |  text  | Text of question being asked |
  | name |  text  | Username for question asker |
  | email |  text  | Email address for question asker |
  | product_id |  integer  | Required ID of the Product for which the question is posted |

  Response: `Status: 201 Created`

  
  ### Mark Question as Helpful
  Updates a question to show it was found helpful

  `PUT /qa/questions/:question_id/helpful`

  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | question_id |  integer  | Required ID of the question to update |

  Response: `Status: 204 NO CONTENT`
  
  
  ### Report Question
  Updates a question to show it was reported. Note, this action does not delete the question, but the question will not be returned in the above GET request

  `PUT /qa/questions/:question_id/report`

  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | question_id |  integer  | Required ID of the question to update |

  Response: `Status: 204 NO CONTENT`
  
  
  ### Mark Answer as Helpful
  Updates an answer to show it was found helpful

  `PUT /qa/answers/:answer_id/helpful`

  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | answer_id |  integer  | Required ID of the answer to update |

  Response: `Status: 204 NO CONTENT`
  
  
  ### Report Answer
  Updates an answer to show it has been reported. Note, this action does not delete the answer, but the answer will not be returned in the above GET request

  `PUT /qa/answers/:answer_id/helpful`

  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | answer_id |  integer  | Required ID of the answer to update |

  Response: `Status: 204 NO CONTENT`

---
## DB Initialization and ETL Quaries in Postgres
### Local
  1. Run `node db/schema.js` to create tables
  2. Run `node db/importData.js` to import data from csv files (if deployed to cloud, run copyData-AWS-EC2.sql instead)
  3. Run `node db/addIndex.js` to create indexes 
  4. After load testing APIs using K6, run `node db/deleteTestData.js` to delete load test data.

### Deploy to cloud
  1. Create database
  2. Create file named `schema.sql` copy codes from `db/awsSchema.sql`
  3. Create file name `importData.sql` copy codes from `db/awsImportData.sql` 
  3. Run `psql -h localhost -U your-user-name -d your-cloud-database-name -f \schema.sql`
  4. Transfer the CSV files from loacal to cloud server
  5. Run `psql -h localhost -U your-user-name -d your-cloud-database-name` -f \importData.sql`
  
---
## Installation
  1. In the terminal inside, run `npm run server` to start server
  2. Test by typing `http://localhost:8000/qa/questions?product_id=1` in the Postman to see the response.
  
---
## Other Services
Please reference other API Services that make up the other part of the e-commerce app API:
  
  - <a href='https://github.com/rpp2205-sdc-atacama/rpp2205-yui-overview'>Product Overviews</a> by Yui Murayama
  
  - <a href='https://github.com/rpp2205-sdc-atacama/rpp2205-huan-reviews'>Reviews</a> by Huan Tran

