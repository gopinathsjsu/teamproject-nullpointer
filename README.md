# NullPointer
Movie theater website prototype application that emulates movie websites such as AMC Theatres. This includes being able to register/sign in, buy/refund tickets, view account information, and view ticket history.
## Team Members
1. Dimitar Dimitrov (014698892)
2. Subramanya Jagadeesh (016218293)
3. Connor Pietrasik (015126007)
4. Rajath Rajaram (017426097)

## Summary of Areas of Contribution
### Dimitar Dimitrov
* Login/Registration early API development + integration and front end UI implementation
* Account page UI implementation and API integration
* Admin page UI implementation and API integration
* Figma UI wireframe design
* Class UML diagram, component diagram, and README.md file
### Subramanya Jagadeesh
* Initial Frontend Repo setup
* UI for  - Home, Checkout, Payment, Ticket
* API Integration - Home, Checkout, Payment, Ticket
* Redux for frontend
* Checkout Figma Design
* EC2, ELB, S3 creation, configuration and deployments for each build
* Class UML diagram, component diagram, deployment diagram and README.md file
### Connor Pietrasik
* Some authentication improvements
* Hashing passwords
* The user backend stuff
* Refactored db schema to remove duplicate data
* Added discount API based on date, day, and time
* Class UML diagram, component diagram, and README.md file
### Rajath Rajaram
* Initialized MongoDB on cloud
* Initialized Flask and repo
* Admin API development
* Added logging and authentication
* Bash scripts
* Class UML diagram, component diagram, and README.md file


## Feature Set
* Home Page
  * Choose locations
  * Choose theaters
  * Check currently showing movies
  * Check upcoming movies

* Checkout Page
  * Check showtimes for each movie
  * Book ticket for a specific showtime

* Payments Page
  * Specify number of tickets
  * Buy tickets
  * Buy membership
* Payment Successful Page
  * Shows ticket details
  * Shows membership details
  
* Accounts Page
  * View user information (name, rewards points, membership status)
  * View previously seen movies, upcoming movies, and movies seen in the last 30 days
  * Ability to refund tickets bought for upcoming movies
  
* Login/Register Page
  * Ability to create an account, or log into an existing account
 
* Admin Page
  * Add/Update/Remove different Movies/Theaters/Showtimes
  * Configure seating capacity for each theater in a multiplex
  * View analytics dashboard showing Theater occupancy for the last 30/60/90 days
    * Summarized by location
    * Summarized by movies
  * Configure discount prices for shows before 6pm and for Tuesday shows
  
## Tools Used
Languages: JavaScript, Python
<br>
Tools: React.jsx, Redux, Flask API
<br>
DB: MongoDB
<br>
Deployment: EC2, S3

## Design Decisions

### Design choices for using MongoDB, Flask API, and Python for the backend
We chose to use this tool stack since we wanted to learn noSQL databases and implementing API using Flask framework.
Additionally, Flask API is light-weight and starting an application is fairly quickly compared to SpringBoot, where the initialization process takes longer.

### Design choices for using React.jsx and Redux
React.jsx has large community support and it is used by large corporations to make the frontend run quicker (courtesy of virtual DOM).
Redux was chosen since it gives us centralized state management throughout the application.

## Diagrams

Component Diagram
![image](https://github.com/gopinathsjsu/teamproject-nullpointer/assets/73325837/f894bd67-0d42-4d29-98fb-892fedee13f8)

Deployment Diagram
![image](https://github.com/gopinathsjsu/teamproject-nullpointer/assets/73325837/7a13ce55-29ba-4d74-a409-f2a08c91d986)

(Initial) Class Diagram
<br>
![image](https://github.com/gopinathsjsu/teamproject-nullpointer/assets/73325837/8a9f6c09-fc0f-4bcf-9d10-778709d9b4b8)

## Project Journal
### Weekly Scrum Report (Includes backlog and burndown charts)
[Sprints(1-5) Folder](https://drive.google.com/drive/folders/1Mn1kzlfYmrABU5Cru8pbD2Y9ljJ0Hg4A?usp=sharing)
### Sprint Taskboard:  
[Trello Invite Link](https://trello.com/invite/workspace74518349/ATTI3f2948a0cbf3d49151f5aab334111c6a0EE9ED79)
### XP Values Used
Simplicity - Team started with what was needed for each sprint and delivered the same (nothing more or nothing less).
<br>
Feedback - Constant feedback from sprints, where each member provided and received feedback and worked on it.

### UI Wireframes
[Figma UI Wireframe](https://www.figma.com/file/NP4QOUjWc36orySRsXGN5q/CMPE202-UI-Framework?type=design&node-id=0%3A1&mode=design&t=DzoyWfBm2xQZ2hQF-1)
