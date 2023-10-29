## SWE574 Fall 2023 - Milestone 1 Report - Group 1
Due Date: 02 November 2023

### Deliverables:

* [Project Conventions](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Conventions)
* [Project Plan (TBA)](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Project-Plan)
* [Communication Plan](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Communication-Plan)
* [Responsibility Assignment Matrix](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Responsiblities) (incomplete)
* [Software Requirements Specification (Includes Glossary)](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Requirements)
* [Mockups](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Mockups-and-Storyboards)
* [User Scenarios](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/User-Scenarios) (TBA)
* [Diagrams](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Diagrams) (TBA)
* [Meeting Notes](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Meeting-Notes)


### Progress Tracking:
* [Kanban Board](https://github.com/orgs/SWE574-Fall2023-Group1/projects/1) 
* [Issues](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues) 
* [Issue Labels](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Issue-Labels)

### Software Release:
* [Web Release] (TBA)
* [Mobile Release] (TBA)
* [] (TBA)

#### Instructions
* The software must be dockerized and deployed
* Create a pre-release version of your software that marks this version (check out how you create a release (https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) in GitHub):
* Release Name: 0.1.0-alpha (pre-release option)
* Release Description: Brief description of requirements that are covered
* Tag name: customer-milestone-1
* Your release should include the android package file (.apk).
* All instructions for building and running the software should be provided, including thedocker build instructions and environment variables, if any. A fresh programmer that isfluent with various programming tools but not docker itself nor your project, should beable to do the deployment (for both web and mobile) by just following your steps.

### Milestone Review:
* [Milestones](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Milestones)
* Maybe open separate page on wiki for each milestone?

TBA

#### Tools & Platforms Used:

| **Tool** | **Purpose** |
| -------- | ----------- |
| Android Studio | Development suite for building Android application|
| Discord | Sharing resources and holding online meetings |
| Django | Python-based backend framework for web development|
| Docker | Virtualization for deployment across devices|
| Figma | Designing mockup and web frontend |
| Flutter | SDK for cross-platform development |
| GCP | Cloud service to deploy application online |
| Git | Version control system to track changes |
| GitHub | Online repository for code, packages and documentation|
| GitHub Desktop | Desktop application to sync local repo with GitHub|
| HackMD | Online platform to write markdown collaboratively|
| Kanban Board | Visual management system to track progress|
| Notion | |
| Postman | |
| PostgreSQL | Database for persistent storage |
| pre-commit | |
| Swagger | |
| VS Code | IDE for developing application|
| WhatsApp | Immediate communication among group members |



#### Instructions
* A summary of the project status and any changes that are planned for moving forward.
* A summary of the customer feedback and reflections.
* List and status of deliverables.
* Evaluation of the status of deliverables and its impact on your project plan (reflection).
* Evaluation of tools and processes you have used to manage your team project.
* The requirements addressed in this milestone.

### Individual Contributions:

* [Members and Team Distributions](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Team-Members)

#### Instructions

 * Responsibilities:
The overall description of responsibilities assigned to you.
 * Main contributions:
The overall description of your contributions to the project untilCustomer Milestone 1.
 * Code-related significant issues:
Your issues (that you have resolved or reviewedsignificantly) that contribute to the code base demonstrated during the demo.
 * Management-related significant issues:
Your issues (that you have resolved orreviewed significantly) that contribute to the management of the project.
 * Pull requests:
You have created, merged, and reviewed. Please also briefly summarizewhat the conflict was (if you had any) and how it was resolved, regarding the pullrequests you have reviewed.
 * Additional information:
Mention any additional task you have performed that is notlisted above.

#### Ayhan
 * **Responsibilities:**
1. Developing the architecture of the mobile app
2. Developing the mobile designs in Flutter
3. Writing unit tests for the mobile app
4. Developing the mobile pipeline

 * **Main contributions**:
1. Flutter project is created
2. Network manager added for the mobile app
3. Base request and response models are created
4. Workflow file created for CI/CD for the mobile app
5. BLoC architecture is added for mobile
6. Routing class between pages is added
7. Popup dialog class is added
8. Offline state handling logic is added

 * **Code-related significant issues**:
1. Add initial flutter project for the mobile app #2 (Mobile Repo)
2. Add bloc architecture for login #3 (Mobile Repo)
3. Create network manager class #4 (Mobile Repo)
4. Add repository pattern for network calls for login page #8 (Mobile Repo)
6. Add login page design #14 (Mobile Repo)
7. Add router class #15 (Mobile Repo)
8. Handle offline state in network calls #16 (Mobile Repo)
9. Add popup dialog class #17 (Mobile Repo)
10. Create APK file using Github Actions #18 (Mobile Repo)
11. Add new response format for network calls #19 (Mobile Repo)
12. Add bloc test package #6 (Mobile Repo)
13. Add golden test package #7 (Mobile Repo)
14. Add splash screen #22 (Mobile Repo)

 * **Management-related significant issues**:
1. Add workflow file for CI/CD #12 (Mobile Repo)
2. Set up lint rules #5 (Mobile Repo)

 * **Pull requests**:
1. Feature/login #9
2. [network_refinement] Refactor network calls with headers #24

// TODO: Add splash, bloc test, lint, golden test PRs

#### Aykut
 * **Responsibilities:**
1. Designing web mock-ups
2. Requirements specification
3. Editing wiki pages
4. Frontend code refinement
5. Creation project plan
6. Testing and creation unit tests
 * **Main contributions:**
1. Requirements have been specified according to comments of professor
2. Web mock-ups have been designed in figma and shared
3. Frontend codes such as unnecessary console log have been refined by removing and editing
4. Project plan has been created according to deliverables plan of team 
 * **Code-related significant issues:**
1. In #75 Frontend Refinements issue, non unique ids problem has been fixed. Unnecessary console logs have been removed or edited.  
2. In #80 Unit test execution and in #79 User Acceptance Tests User issues, test scenarios have been planned to creation and execution then according to results codes will be refined.  
 * **Management-related significant issues:**
1. In #74 Project Plan for Milestone 1 Report issue, project plan has been created according to deliverables plan of team.
2. In #31 Create Web Application Mockups issue, web application mockups have been designed. 
3. In #47 Hold first frontend meeting issue, we orginized and met as frontend team for frontend related works. 
4. In #38 Create Scenarios for Milestone 1 Report issue, memories, profiles have been formed. 
5. In #29 Organize and revise requirements issue, requirements have been specified and organized. 
 * **Pull requests:**
1. In #76 Feature/75 frontend refinements pull request, non unique ids problem has been fixed and unnecessary console logs have been removed and edited in branch of feature/75-frontend-refinements. It has been pushed to dev. 
 * **Additional information:**
1. Each week classes, notes relating to professor's comments and team's reviews have been taken and shared with team. 
2. Some informative sources and useful drafts have been found and shared with team. 
#### Caner
 * **Responsibilities:**
1. Creating discord channel & configuring it with Github
2. Transfering details of existing project to the team [SWE573 Project Link](https://github.com/ckertam/SWE573_SPRING_2023)
3. Improvement on backend for initializing the obile part
4. Improvement on frontend for better optimization
5. Explaining frontend components to the frontend team
6. Deployment on GCP
 * **Main contributions:**
1. Main & Dev branches created and both branches deployed on GCP VM. 
2. Changing API request responses for Mobile Development.
3. Adding delete story API request so that we can delete stories while developing the project.
4. Swagger added to the project for everyone to see API requests easily.
5. Changing profile photo store type as URL in the project so that we can get photo faster. 
6. Changing story photo store type as URL and file size decreased on frontend so that rendering become faster.
7. Mobile authentication test for JWT is available to use in flutter easily.
     * **Code-related significant issues:**
    1. Main & Dev branch deployment #24
    2. Changing API request responses for mobile development #50
    3. Delete story API View #62 #62
    4. Swagger related #14 #37
    5. Profile photo related #56
    6. Story photo related #28
    7. Mobile auth related #27
     * **Management-related significant issues:**
    1. Discord related #4
    2. Git workflow & Deployment #24
 * **Pull requests:**
1. Transferring old codes to new repository & Deployment #19 #34 #65
2. Change request response for mobile development #51 #52 #53 #54
3. Delete story related #61
4. Swagger #43
5. Profile Photo & Story Photo related #30 #33 #57
6. Reviewed pull requests #26 #33 #35 #43 #55 #76

#### Deniz
#### Mert
#### Oğuz
 *  Responsibilities:
1. Making mobile mock-ups
2. Web frontend code refinement
3. Requirement specification
4. Wiki page edit
5. Help to define milestone feature determination
6. Taking team meeting notes

 * Main contributions:
My main contrubution is frontend code refinement for website and improve website functionality

 * Code-related significant issues:

 * Management-related significant issues:
Your issues (that you have resolved orreviewed significantly) that contribute to the management of the project.
 * Pull requests:

 * Additional information:

#### Sadık
 * **Responsibilities**:
The overall description of responsibilities assigned to you.
 * **Main contributions**:
The overall description of your contributions to the project untilCustomer Milestone 1.
   * **Code-related significant issues**:
Your issues (that you have resolved or reviewedsignificantly) that contribute to the code base demonstrated during the demo.
   * **Management-related significant issues**:
Your issues (that you have resolved orreviewed significantly) that contribute to the management of the project.
 * **Pull requests**:
You have created, merged, and reviewed. Please also briefly summarizewhat the conflict was (if you had any) and how it was resolved, regarding the pullrequests you have reviewed.
