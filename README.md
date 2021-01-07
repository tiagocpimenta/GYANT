# GYANT Challenge App

## Background

To obtain training data for a ML-based diagnosis engine, Gyant asks doctors to label medical cases by reading the EHR (electronic health record) of a patient encounter and labeling it with a diagnosis (condition).

An EHR is a text file that may look something like this: The patient is a 32 year old female who presents to the Urgent Care complaining of sore throat that started 7 days ago. Developed into post nasal drip and then cough. No measured fevers. Had chills and body aches at the onset that resolved after the first day. A little facial headache with the congestion at times; better today. Some pressure on and off in the ears, no pain, hearing loss or tinnitus. Cough is mostly dry, sometimes productive of clear sputum. Denies shortness of breath. Never smoker. Has never needed inhalers. No history of pneumonia. Currently treating with ibuprofen which helps. Tried some over-the-counter Mucinex ES and vitamin C.

A condition consists of an ICD-10 condition code and description, e.g.: F411 Generalized anxiety disorder J00 Acute nasopharyngitis.

### Feature set
This web application allows a doctor to review a set of EHRs (one after another) and label them with one of a number of conditions. The case id, doctor id, label and time to label the case are recorded for each decision.

### Typical workflow
1. Doctor logs in using email/password.
2. The next case is presented.
3. The doctor labels the case and moves on to the next one.
4. When no more cases are left, a message "You are Done" is displayed.
5. Doctor can log out and re-log at any point.

---

## Tech Summary

This application was developed using [Node.js](https://nodejs.org/) version 13. Its code is split in two different layers (with dedicated folders): a `client` (responsible for the logic of the web interface) and a `server` (with the implementation of all API functions).

### Install/Setup instructions

Clone or download this repository, and then:

#### 1. Setup database connection

This application depends on a MongoDB instance to store cases, conditions and decisions. 

You can connect it to a working cluster by editing the `.env` file with the respective connection string details.

*Note: The configurations in the included `.env` file allow you to connect to a working [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster. Feel free to use it for debugging purposes, but keep in mind it is NOT a stable environment and its contents can change at any time.*

#### 2. Install application dependencies
Navigate to the root of the repository and run the following command:
```sh
$ npm i
``` 
After it is executed, all app-level code dependencies will be installed in the workspace.

#### 3. Start the application
Run the following command:
```sh
$ npm start
```

#### 4. Create sample user

This is a simple demo/example application that does not include any user/identity integration. Since a user is required to perform the typical workflow, you can create a sample user by executing the following request:

* [POST] http://localhost:3000/users/register
  * example request body:
  ```json
  {
    "name": "Doctor Who",
    "email": "who@doctor.com",
    "password": "qwerty"
  }
  ```

#### 5. Create sample cases and conditions

The same is also true for the cases and conditions. Execute both the following requests to populate the database with all the sample content required to demo the application (i.e. cases and conditions): 

* [POST] http://localhost:3000/cases/import
* [POST] http://localhost:3000/conditions/import

Note: after you review every case it might be useful to drop the collection and repopulate, so that you can test the application again with a clean state.
To do so, please complete the following requests:
1. DELETE http://localhost:3000/cases
2. POST http://localhost:3000/cases/import
