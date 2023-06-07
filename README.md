# Typing_trainer
Coursework for software development methodologies course. 

## Team IM-13
- [Dubchak Alina](https://github.com/AlinaDubchak)
- [Martyniuk Mariia](https://github.com/mmarty12)

## Description
> This project is designed to improve blind and fast character typing skills.<br>
> Target audience is everyone who wants to improve the above mentioned skills.

## Technology stack
- JavaScript, Node JS
- MongoDB
- Express JS
- bcrypt
- JWT
- Jest та Jestdom

## Goals
- Implementation of the full functionality of several pages of the application:
    - registration/authentication pages
    - the main one, where the user gets to first of all
    - per page for each type of training (2 pcs.)
- implementation of a set of the corresponding proposed order of symbols
- output statistics (characters/min, words/min, number of errors)
- writing and providing interaction with the user database
- implementation of the user registration/authentication process, encryption of passwords using special functions (bcrypt)

## How to use
There are two options to use the application. The first one is direct usage via  `gh-pages`. It is intended for users who don't want to register/log in and download the whole project locally. 
You just need to go to the [gh-pages](https://github.com/mmarty12/typing_trainer/deployments/activity_log?environment=github-pages) section and open an active deployment.

In order to use the project with authorization/registration, it is necessary to do the following:
 
### Dowload the project locally

### Install dependencies
```
npm install express nodemon
```
### Run server 
```
npm start
```
### To run tests you need to haveto have npm and Jest library  installed:
 ```
npm install jest jestdom
```
### Run tests
```
npm test
```
