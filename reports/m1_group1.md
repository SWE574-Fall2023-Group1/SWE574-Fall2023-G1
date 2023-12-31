## SWE574 Fall 2023 - Milestone 1 Report - Group 1
Due Date: 02 November 2023

[![GitHub G1-milestone1 details](https://img.shields.io/github/milestones/progress/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/2?label=G1-milestone1)](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/milestone/2)
[![GitHub G1-mobile-milestone1 details](https://img.shields.io/github/milestones/progress/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/1?label=G1-mobile-milestone1)](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/milestone/1)

### Deliverables:

* [Project Conventions](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Conventions)
* [Project Plan](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Project-Plan)
* [Communication Plan](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Communication-Plan)
* [Responsibility Assignment Matrix](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Responsibilities)
* [Software Requirements Specification (Includes Glossary)](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Requirements)
* [Mockups](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Mockups-and-Storyboards)
* [User Scenarios](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/User-Scenarios)
* [Diagrams](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Diagrams)

### Progress Tracking:
* [Kanban Board](https://github.com/orgs/SWE574-Fall2023-Group1/projects/1)
* [Issues](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues)
* [Issue Labels](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Issue-Labels)
* [Meeting Notes](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Meeting-Notes)

### Software Release:
* [0.1.0-alpha Release Notes](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/releases/tag/customer-milestone-1) (mobile)
* [0.1.1-alpha Release Notes](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/releases/tag/customer-milestone-1.1) (web)
* The second release includes the new timeline feature for the web application.
* [Android Application APK](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/releases/download/customer-milestone-1/app-release.apk)

### Milestone Review:
* [Milestones](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Milestones)

#### Current Status
The web application is currently deployed online with the following features listed as deliverables for milestone 1:
- [x] Register
- [x] Login
- [x] Logout
- [x] Feed - Homepage
- [x] Profile Page (Web only)
- [x] Memory Creation (Web only)
- [x] Memory Viewing (Web only)
- [x] Timeline v1 (Web only)

It is currently possible to register, login, modify one's profile page, share a new memory, read memories, search memories, like memories, follow other members and leave comments on memories.
We also added a feature to search stories near a specific location directly and see the results visualized as a timeline.
The mobile application has also been developed and published as an APK file, with the planned features present for milestone 1.
We mainly focused on workflow pipelines for backend, web and mobile parts. Understand the code structure we already have. So, we have no significant progress on mobile nevertheless we have initial implementations which connects the mobile with our working backend system.
Besides, it is possible to register, login and logout on the mobile application. The remaining features from the web version will be implemented in mobile for milestone 2.

#### Requirements Addressed
The following requirements have been addressed in the current release. For the ones that are yet to be addressed, consult the full requirements list above.

####  Functional Requirements

| NO | REQUIREMENT                                                                                                                                        | STATE             |
|------|----------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
| **F-1** | **Sign up / Login Requirements**| <ul><li>[x] </li> |
| F-1.1 | New members shall register with a unique username and password.                                                                                          | <ul><li>[x] </li> |
| F-1.2  | Members shall log in with their username and password.                                                                      | <ul><li>[x] </li> |
| **F-2** | **Memory Requirements**| <ul><li>[x] </li> |
| F-2.1  | The system shall allow members to create a memory.                                                                                           | <ul><li>[x] </li> |                                                                                                          | <ul><li>[x] </li> |
| F-2.2 | The system shall require title, text, location and time for each new memory.                                                                                                                        | <ul><li>[x] </li> |
| F-2.3 | The system shall allow time entry in the form of decade, year, season, specific date and interval. Date information can consist of year and season as time info.                                                                                  | <ul><li>[x] </li> |
| F-2.4 | The system shall allow members to add tags to their memories.                                                                                                               | <ul><li>[x] </li> |
| F-2.5 | The system shall allow members to attach photos to their memories.                                                                                                          | <ul><li>[x] </li> |
| F-2.6 | The system shall allow members to remove photos from their memories.                                                                                                          | <ul><li>[x] </li> |
| F-2.7 | The system shall allow members to like a memory.                                                                         | <ul><li>[x] </li> |
| F-2.8 | The system shall allow members to unlike a memory.                                              | <ul><li>[x] </li> |
| F-2.9 | The system shall allow members to edit their memories’ text content.                                                                 | <ul><li>[x] </li> |
| F-2.10  | The system shall allow members to comment on memories.                                                                                        | <ul><li>[x] </li> |
| F-2.11 | The system shall allow members to view memories individually.| <ul><li>[x] </li> |
| F-2.15 | The system shall display memory locations on a map.                                                                                        | <ul><li>[x] </li> |
| **F-3** | **Profile Requirements**| <ul><li>[x] </li> |
| F-3.1 | The system shall allow members to add a profile photo to their profile.                                                                         | <ul><li>[x] </li> |
| F-3.2 | The system shall allow members to add a bio to their profile.                                                                                   | <ul><li>[x] </li> |
| F-3.3 | The system shall allow members to edit their profile photo.                                                                                         | <ul><li>[x] </li> |
| F-3.4 | The system shall allow members to remove their profile photo.                                                                                         | <ul><li>[x] </li> |
| F-3.5 | The system shall allow members to edit their bio.                                                                                                    | <ul><li>[x] </li> |
| F-3.6 | The system shall allow members to see other members' profiles.                                                                                     | <ul><li>[x] </li> |
| **F-4** | **Following Other Members Requirements**| <ul><li>[x] </li> |
| F-4.1 | The system shall allow members to follow other members.| <ul><li>[x] </li> |
| F-4.2 | The system shall allow members to unfollow other members.| <ul><li>[x] </li> |
| **F-5** | **Search Requirements**| <ul><li>[x] </li> |
| F-5.1 | The system shall have a search function that filters memories.| <ul><li>[x] </li> |
| F-5.2 | The search function shall filter memories by title.                                                                                  | <ul><li>[x] </li> |
| F-5.3 | The search function shall filter memories by text content.                                                                           | <ul><li>[x] </li> |
| F-5.4 | The search function shall filter memories by location.                                                                                             | <ul><li>[x] </li> |
| F-5.5 | The search function shall filter memories by location radius.                                                                  | <ul><li>[x] </li> |
| F-5.6 | The search function shall filter memories by specific date.                                                                                     | <ul><li>[x] </li> |
| F-5.7 | The search function shall filter memories by interval date.                                                                                    | <ul><li>[x] </li> |
| F-5.8 | The search function shall filter memories by year.                                                                                              | <ul><li>[x] </li> |
| F-5.9 | The search function shall filter memories by decade.                                                                                                     | <ul><li>[x] </li> |
| F-5.10 | The search function shall filter memories by username.                                                                                           | <ul><li>[x] </li> |
| F-5.11 | The search function shall filter memories by tag.                                                                                                | <ul><li>[x] </li> |
| F-5.12 | The search function shall sort results alphabetically by title. | <ul><li>[x] </li> |
| F-5.13 | The search function shall sort results by memory date. | <ul><li>[x] </li> |
| F-5.14 | The search function shall sort results by creation date. | <ul><li>[x] </li> |
| F-5.15 | The search function shall sort results by location. | <ul><li>[x] </li> |
| F-5.16 | When the user clicks on a map marker, the system shall navigate to a search result page considering the memory time order. | <ul><li>[x] </li> |
| F-5.17 | The search function shall have a toggle which allows users to see search results considering the memory time order. | <ul><li>[x] </li> |


#### Non-Functional Requirements
| NO   | REQUIREMENT                                                                                                                                        | STATE             |
|------|----------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
| NF-1  | The system shall be available as an Android application.                                                                       | <ul><li>[x] </li> |
| NF-2  | The system shall be available as a web application.                                                                          | <ul><li>[x] </li> |
| NF-3 | The system shall support web browsers such as Google Chrome, Microsoft Edge, and Mozilla Firefox.                                                   | <ul><li>[x] </li> |
| NF-4 | The system shall be available in English.                                                                                              | <ul><li>[x] </li> |
| NF-5 | The system shall have at least 99% uptime.                                                                                                         | <ul><li>[x] </li> |
| NF-6 | The system shall respond in under 5 seconds when there is a new request.                                                                       | <ul><li>[x] </li> |
| NF-8 | The system shall perform without failure in 98% of memory entries for three weeks.                                                                | <ul><li>[x] </li> |
| NF-9 | The mean time to restore the system (MTTRS) following a memory entry failure shall not be greater than 5 minutes.                                    | <ul><li>[x] </li> |
| NF-10 | The error rate of creating a new memory shall not exceed 10%.                                                                                        | <ul><li>[x] </li> |


#### Future Plans
For milestone 2, we plan to implement the new recommendation, timeline visualization, notification and activity features to the web application. The mobile application will also be worked upon to catch up with the current features of the web version. The frontend will be rehauled to look better, new unit tests will be implemented, and the backend will be optimized to run more efficiently.

#### Feedback & Reflections

##### Team Feedback & Reflections
We have gone through an iterative process to better shape our requirements, where we had to remove and rewrite several requirements as per the customer's demands, and add a few new ones as well. We have also received feedback on which tools we will be using, and especially how well the wiki and the issues should be handled. We are currently making sure to keep good records of our contributions and progress, paying attention to commit messages, meeting notes, issue labels and deadlines.

##### Customer Feedback & Reflections
* The customer commented on search results. There was a duplicate in the  search results so the customer wants us to resolve it.
* The customer wants us to remove the "Remove profile photo" button if there is no added profile photo yet.
* The customer wants us to focus on the mobile app more and wants to see some new features like "activity report" or "recommendation system" on both web and mobile.
* The customer wants us to add "season" resolution while selecting memory time as "decade".

##### Other Teams' Feedback & Reflections
* Gökalp mentioned how clicking a marker to search a memory near that location may not be clear for a user. Adding an instruction about it should be good.
* Erhan asked about separating tags while entering them in a new memory. We mentioned that we already have an indicator inside the "tag box". But for clarity we might change the user experience while adding tags.
* Ali Hakan asked about search radius when clicking on map marker. We answered that it has a default 5 km radius range.
* Hasan Deniz asked about searching with tags and location at the same time. We demonstrated that the system allows searching with both tag and location info at the same time.



#### Tools & Platforms Used:

| **Tool** | **Purpose** |
| -------- | ----------- |
| Android Studio | Development suite for building Android application |
| Discord | Sharing resources and holding online meetings |
| Django | Python-based backend framework for web development |
| Docker | Virtualization for deployment across devices |
| Figma | Designing mockup and web frontend |
| Flutter | SDK for cross-platform development |
| GCP | Cloud service to deploy application online |
| Git | Version control system to track changes |
| GitHub | Online repository for code, packages and documentation |
| GitHub Desktop | Desktop application to sync local repo with GitHub |
| HackMD | Online platform to write markdown collaboratively |
| Kanban Board | Visual management system to track progress |
| Notion | Productivity and note-taking web application |
| Postman | API platform for building and using APIs |
| PostgreSQL | Database for persistent storage |
| pre-commit | Framework for managing multi-language pre-commit hooks |
| Swagger | Suite of tools for API developers |
| VS Code | IDE for developing application |
| WhatsApp | Immediate communication among group members |

We have been using git and GitHub to their full extent, having established our conventions at the beginning of the project. We have seen that WhatsApp and Discord are effective tools for communication, and GitHub issues along with the Kanban board serve as useful tools for progress tracking. Our current setup for the web application (Django - Swagger - PostgreSQL) is working well, and we intend to keep using Flutter for mobile development. Our application is Dockerized and deployed on GCP which facilitates online and cross-platform development, and VS Code along with Android Studio serve as our development suite. This report was written online on HackMD, and we intend to do the same for future reports. We are currently satisfied with our tools and workflow, but changes may be made if the need arises in the future.


### Individual Contributions:

* [Members and Team Distributions](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Team-Members)

#### **Ayhan**
 * **Responsibilities:**
    1. Developing the architecture of the mobile app
    2. Developing the mobile designs in Flutter
    3. Writing unit tests for the mobile app
    4. Developing the mobile pipeline

 * **Main contributions:**
    1. Flutter project is created
    2. Network manager added for the mobile app
    3. Base request and response models are created
    4. Workflow file created for CI/CD for the mobile app
    5. BLoC architecture is added for mobile
    6. Routing class between pages is added
    7. Popup dialog class is added
    8. Offline state handling logic is added

     * **Code-related significant issues:** (Mobile Repo)
        1. Add initial flutter project for the mobile app [**#2**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/2)
        2. Add bloc architecture for login [**#3**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/3)
        3. Create network manager class [**#4**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/4)
        4. Add repository pattern for network calls for login page [**#8**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/8)
        6. Add login page design [**#14**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/14)
        7. Add router class [**#15**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/15)
        8. Handle offline state in network calls [**#16**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/16)
        9. Add popup dialog class [**#17**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/17)
        10. Create APK file using GitHub Actions [**#18**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/18)
        11. Add new response format for network calls [**#19**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/19)
        12. Add bloc test package [**#6**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/6)
        13. Add golden test package [**#7**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/7)
        14. Add splash screen [**#22**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/22)

     * **Management-related significant issues:**

        1. Add workflow file for CI/CD [**#12**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/12)
        2. Set up lint rules [**#5**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/15)

 * **Pull requests:**
    1. Feature/login [**#9**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/9)
    2. [network_refinement] Refactor network calls with headers [**#24**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/24)
    3. [Linter] Add lint rules and make fixes related to linting #5 [**#25**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/25)
    4. [LoginBlocTest] Add login bloc tests #6 [**#26**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/26)
    5. [LoginGoldenTest] Add login golden test #7 [**#27**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/27)
    6. [BottomBar] Add bottom navigation bar and landing logic #28 [**#29**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/29)
    7. [NavBar] Make bottom nav bar persistent across pages #33 [**#34**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/34)
    8. Feature/23 register [**#36**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/36)
    9. [Register] Improve register appbar design #39 [**#40**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/40)
    10. [Network] Allow insecure calls for http requests #41 [**#42**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/42)
    11. Feature/30 CI/CD for dev [**#31**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/31)
    12. Separate CI and CD mobile pipelines #35 [**#37**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/37)
    13. Feature/21 feed screen [**#38**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/38)
    14. Dev-> Main [**#43**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/43)


#### **Aykut**

 * **Responsibilities:**
    1. Designing web mock-ups
    2. Requirements specification
    3. Editing wiki pages
    4. Frontend code refinement
    5. Creating project plan
    6. Testing and creating unit tests

 * **Main contributions:**
    1. Requirements have been specified according to comments of professor
    2. Web mock-ups have been designed in figma and shared
    3. Frontend codes such as unnecessary console log have been refined by removing and editing
    4. Project plan has been created according to deliverables plan of team
     * **Code-related significant issues:**

        1. Frontend Refinements issue, non unique ids problem has been fixed. Unnecessary console logs have been removed or edited. [**#75**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/75)
        2. Unit test execution and User Acceptance Tests User issues, test scenarios have been planned to creation and execution then according to results codes will be refined. [**#79**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/79) [**#80**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/80)
     * **Management-related significant issues:**

        1. Project Plan for Milestone 1 Report issue, project plan has been created according to deliverables plan of team. [**#74**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/74)
        2. Create Web Application Mockups issue, web application mockups have been designed. [**#31**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/31)
        3. Hold first frontend meeting issue, we orginized and met as frontend team for frontend related works. [**#47**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/47)
        4. Create Scenarios for Milestone 1 Report issue, memories, profiles have been formed. [**#38**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/38)
        5. Organize and revise requirements issue, requirements have been specified and organized. [**#29**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/29)
 * **Pull requests:**
    1. Feature/75 frontend refinements pull request, non unique ids problem has been fixed and unnecessary console logs have been removed and edited. [**#76**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/76)
 * **Additional information:**
    1. Each week classes, notes relating to professor's comments and team's reviews have been taken and shared with team.
    2. Some informative sources and useful drafts have been found and shared with team.


#### **Caner**
 * **Responsibilities:**

    1. Creating discord channel and configuring it with GitHub
    2. Transfering details of existing project to the team [SWE573 Project Link](https://github.com/ckertam/SWE573_SPRING_2023)
    3. Improvement on backend for initializing the mobile part
    4. Improvement on frontend for better optimization
    5. Explaining frontend components to the frontend team
    6. Deployment on GCP
* **Main contributions:**

    1. Main and Dev branches created and both branches deployed on GCP VM.
    2. Changing API request responses for Mobile Development.
    3. Adding delete story API request so that we can delete stories while developing the project.
    4. Swagger added to the project for everyone to see API requests easily.
    5. Changing profile photo store type as URL in the project so that we can get photo faster.
    6. Changing story photo store type as URL and file size decreased on frontend so that rendering become faster.
    7. Mobile authentication test for JWT is available to use in flutter easily.
    8. Timeline system backend & frontend implementation.

     * **Code-related significant issues:**

        1. Main and Dev branch deployment [**#24**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/24)
        2. Changing API request responses for mobile development [**#50**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/50) [**#77**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/77)
        3. Delete story API View [**#62**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/62)
        4. Swagger related [**#14**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/14) [**#37**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/37)
        5. Profile photo related [**#56**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/56)
        6. Story photo related [**#28**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/28)
        7. Mobile auth related [**#27**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/27)
        8. Timeline system backend [**#45**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/45)
        9. Timeline system frontend [**#46**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/46) [**#49**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/49) [**#97**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/97)
        10. Story like counter bug [**#85**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/85)

     * **Management-related significant issues:**

        1. Discord related [**#4**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/4)
        2. Git workflow and Deployment [**#24**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/24)

 * **Pull requests:**

    1. Transferring old codes to new repository and Deployment [**#19**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/19)
    2. Dev to Main PRs [**#34**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/34) [**#65**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/65) [**#102**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/102)
    3. Change request response for mobile development [**#51**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/51) [**#52**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/52) [**#53**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/53) [**#54**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/54)
    4. Delete story related [**#61**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/61)
    5. Swagger [**#43**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/43)
    6. Profile Photo and Story Photo related [**#30**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/30) [**#33**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/33) [**#57**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/57)
    7. Timeline system related [**#98**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/98)
    8. Fix for backend responses [**#82**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/82)
    9. Story like problem resolved [**#95**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/95)
    10. Reviewed pull requests [**#26**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/26) [**#33**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/33) [**#35**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/35)  [**#43**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/43) [**#55**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/55) [**#76**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/76)

#### **Deniz**

 * **Responsibilities:**

    1. Member of frontend team: work on mockups, design, frontend code implementation
    2. Create new pages and maintain wiki
    3. Moderate and take notes during weekly and regular meetings
    4. Proofread everything on GitHub to fix mistakes
 * **Main contributions:**
    * **Code-related significant issues:**
       1. Frontend Code Refinement [**#42**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/42)
       1. Create needed compenent on frontend for Timeline Feature [**#46**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/46)
       1. Improve frontend design [**#68**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/68)
     * **Management-related significant issues:**
       1. Create custom sidebar [**#1**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/1)
       3. Write down meeting notes [**#15**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/15)
       3. Create Scenarios for Milestone 1 [**#38**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/38)
       3. Get on the same page [**#44**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/44)
       3. Hold first frontend meeting [**#47**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/47)
       3. Write milestone 1 report [**#64**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/64)
       3. Create additional design documents and plans [**#71**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/71)
       3. Create communication plan [**#72**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/72)
       3. Create responsibility assignment matrix [**#73**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/73)
       3. Add UML diagrams [**#84**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/84)
       3. Prepare pre-release for milestone 1 [**#92**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/92)

    * **Pull requests:**
       1. Reviewed pull request [**#93**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/93)
 * **Additional information:**
    1. Moderated regular meetings on Discord
    2. Communicated with the customer for feedback on requirements and workflow
    3. Wrote milestone review and tool analysis with input from teammates
    5. Presented milestone 1 progress with teammates

#### **Mert**

 * **Responsibilities:**
    1. Developing the mobile app in Flutter
    2. Developing the mobile designs in Flutter
    3. Writing unit tests for the mobile app
    4. Making UI/UX decisions for the mobile app

 * **Main contributions:**
    1. Registration page developed
    2. Feed page developed

     * **Code-related significant issues:** (Mobile Repo)

        1. Allow cleartext traffic for release variant [**#41**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/41)
        2. Registration page [**#23**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/23)
        3. Home page [**#21**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/21)
        4. Network manager improvements [**#20**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/20)

     * **Management-related significant issues:**
        1. Custom issue labels [**#1**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/1)

 * **Pull requests:**
    1. An issue related to network connectivity [**#42**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/42)
    2. Development of feed screen [**#38**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/38)
    3. Development of register screen [**#36**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/36)
    4. Improvements for NetworkManager class [**#24**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/24)
    5. Development of Login screen [**#9**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/9)

 * **Additional information:**
    1. Hold separate meetings with all and mobile-only team members.
    2. Shared experiences on mobile app development.

#### **Oğuz**
 *  **Responsibilities:**
    1. Making mobile mock-ups
    2. Web frontend code refinement
    3. Requirement specification
    4. Wiki page edit
    5. Help to define milestone feature determination
    6. Taking team meeting notes

 * **Main contributions:**
    1. Frontend code refinement for website and improve website functionality
    2. Website and mobile mockup designs.
    3. Timeline feature frontend implementation.

     * **Code-related significant issues:**

        1. Frontend Code Refinement [**#42**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/42)
        2. Create mobile app mockups [**#22**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/22)
        3. Edit Organization team distribution [**#13**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/13)
        4. Organize the sidebar of the wiki [**#12**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/12)
        5. Timeline feature  [**#46**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/46) [**#49**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/49)


     * **Management-related significant issues:**
        1. Create repository for mobile development [**#20**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/20)
        2. Identify firewall rules on GCP [**#18**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/18)
        3. Deploy Virtual Machine environment [**#17**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/17)
        4. Create a Virtual Machine on Google Cloud Platform [**#16**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/16)
        5. Organize and publish 14.10.2023 kickoff meeting notes [**#9**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/9)
        6. Ask the professor questions about requirements [**#8**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/8)
        7. Assign the teams [**#7**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/7)
        8. Clean up Requirements [**#6**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/6)
        9. Create new issue labels [**#5**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/5)
        10. Create custom issue labels [**#2**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/2)

 * **Pull requests:**
    1. Update `views.py` for timeline search [**#70**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/70)
    2. Features/56 profile photo improvement [**#57**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/57)
    3. Add swagger settings and configs [**#43**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/43)
    4. Timeline feature [**#91**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/91)

#### **Sadık**
 * **Responsibilities:**

    1. Member of backend, mobile and devops teams.
    1. Working on backend and mobile code improvements.
    1. Mostly reviewing whole pull-requests of both repos.
    1. GitHub pre-release processes.

 * **Main contributions:**

    1. Created GitHub organization account and managed it.
    1. Created GitHub organization teams and gave authorizations.
    1. Created Kanban board in order to track all tasks.
    1. Defined and applied branch protection rules for both repos.
    1. Integrated pre-commit code quality tool into all repos.
    1. Designed and executed dev+prod web deployments w/ [Caner](#Caner)
    1. Designed and executed mobile deployments and test pipeline w/ [Ayhan](#Ayhan)
    1. Did end-to-end tests for both web and mobile apps.
    1. Led the milestone 1 pre-release process.

    * **Code-related significant issues**:

        1. Construct git workflow with new dev branch [**#24**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/24)
        2. Update preview icon and description for web [**#25**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/25)
        1. Change image storage type in story content [**#28**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/28)
        3. Overall Backend Code Refinement [**#36**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/36)
        4. Single string error message in /user/register endpoint [**#89**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/89)
        5. AttributeError at `/user/userFollowers/<int>` [**#77**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/77)
        1. Single string error message in `/user/register` endpoint [**#89**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/89)
        1. Prepare pre-release for milestone 1 [**#92**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/92)
        6. Django Swagger UI backend enhancement [**#37**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/37)
        7. Mobile CI/CD workflow for dev branch [**#30**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/30)
        8. Separate CI and CD mobile pipelines [**#35**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/35)
    * **Management-related significant issues:**
        1. Create custom footer for wiki [**#3**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/3)
        1. Create repository for mobile development [**#20**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/20)
        1. Commits, Branching and Pull Requests Conventions [**#32**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/32)
        1. Create Scenarios for Milestone 1 [**#38**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/38)
        2. Create issue labels for the mobile project [**#1**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/1)
        3. Discord Webhook to follow mobile GitHub repo activities [**#11**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/11)

 * **Pull requests:**
    1. Update preview icon and description #25 [**#26**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/26)
    1. Sync dev with main #28 #33 #34 [**#35**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/35)
    1. Feature/36 overall code refinement [**#55**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/55)
    1. Feature/89 single string error message [**#90**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/90)
    1. Dev->Main 0.1.0-alpha [**#93**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/93)
    1. Feature/30 CI/CD for dev [**#31**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/31)
    1. Separate CI and CD mobile pipelines #35 [**#37**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/37)
    1. Dev->Main mobile 0.1.0-alpha [**#43**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/43)
    1. All necessary files pushed to new repository #10 [**#19**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/19)
    1. [pre-commit.ci] pre-commit autoupdate [**#21**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/21) [**13**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/13)
    1. Update preview icon and description #25 [**#26**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/26)
    1. Story photo store type changed as URL #28 [**#30**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/30)
    1. Feature/28 image store type [**#33**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/33)
    1. Dev->Main PRs [**#34**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/34) [**#65**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/65) [**#102**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/102)
    1. Add swagger settings and configs [**#43**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/43)
    1. Update request responses #50 [**#51**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/51)
    1. Fix user followers request response issues [**#52**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/52) [**#54**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/54)
    1. Add delete story api View [**#61**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/61)
    1. Feature/75 frontend refinements #76[**#76**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/76)
    1. Hotfix/77 attribute error [**#82**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/82)
    1. Feature/46 timeline frontend [**#91**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/91)
    1. Merge milestone 1 report [**#94**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/94)
    1. Update Timeline.js [**#98**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/98)
    1. Feature/login [**#9**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/9)
    1. [network_refinement] Refactor network calls with headers [**#24**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/24)
    1. [Linter] Add lint rules and make fixes related to linting #5 [**#25**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/25)
    1. [LoginBlocTest] Add login bloc tests #6 [**#26**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/26)
    1. [LoginGoldenTest] Add login golden test #7 [**#27**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/27)
    1. [BottomBar] Add bottom navigation bar and landing logic #28 [**#29**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/29)
    1. [NavBar] Make bottom nav bar persistent across pages #33 [**#34**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/34)
    1. Feature/23 register [**#36**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/36)
    1. Feature/21 feed screen [**#38**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/38)
    1. [Register] Improve register appbar design #39 [**#40**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/40)
    1. [Network] Allow insecure calls for http requests #41 [**#42**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/42)

 * **Additional information:**
    1. Shared many informative sources with the team.
    1. Shared experiences on SDLC.
    1. Facilitated Kanban methodology from Agile framework.
