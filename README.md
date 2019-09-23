# Travel Note

## Description

App created to show the user a possible destination for the next holidays. It selects randomly a trip for the user and gives the possibility of store it.


## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
- **sign up** - As a user I want to sign up on the webpage so that I can start to use the app
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- **trip** - As a user I want to get a random suggestion about the destination for the next trip
- **save trip** - As a user I want to save a trip
- **reject trip** - As a user I want to reject a trip and get another trip
- **my trips** - As a user I want to see a list of trips
- **single trip** - As a user I want to see a detail of the trip
- **update** - As a user I want to be able to update my profile
- **delete** - As a user I want to be able to delete my profile

## Backlog

API:
- Connect to a flights API in order to get information about destinations, prices...
- Connect to an accommodation API in order to get information about accommodation, prices...
- Connect to a activities API in order to get information about things to do, prices...

Extra feature:
- Set up a budget feature
- Set up the trip dates
- Choose the departure city

Manage your trips:
- Change your flight
- Change your accommodation
- Make check box for your trip
- Create your trip reviews
- Add your favourite country

Delete my account:
- Delete the user from users collection. Delete the all the trips of the user. Redirect the logout.


## ROUTES:

|Method|URL|Description|
|------|---|-----------|
|GET|/|Renders the homepage.|
|GET|/auth/signup|Renders the signup page.|
|POST|/auth/signup|Add info from users to a data base and redirect to homepage.|
|GET|/auth/login|Renders the login page.|
|POST|/auth/login|Check if the user is in the data base and give it access. Redirect to homepage.|
|GET|/auth/logout|End user session. Redirect to the homepage.|
|GET|/profile|Renders the edit page.|
|POST|/profile|Update the user info. Redirect the homepage.|
|GET|/trip/|Renders the random trip page.|
|POST|/trip/|Save the trip. Redirect my trips.|
|GET|/my-trips/|List my trips. Renders the my trips page.|
|GET|/my-trips/:id/|Renders the one trip page.|
|POST|/my-trips/:id/delete|Delete one of your trip. Redirect to the my trips page.|

## Design framework
- Home page
- Login page
- Signup page
- Edit page
- Trip page
- Your trips page


## Models

User model

```
username: String
password: String
```

Trip model

```
city: String
ownerId: ObjectId ref User

```


## Links

### Kanban board

picture of your physical board

### Git

The url to your repository and to your deployed project

[Repository Link](https://github.com/YoshitsuguNagao/Travel-Note)

[Deploy Link](https://travel-note-app.herokuapp.com/)

### Slides

The url to your presentation slides

[Slides Link](http://slides.com)


