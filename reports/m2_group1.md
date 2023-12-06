## SWE574 Fall 2023 - Milestone 2 Report - Group 1
Due Date: 06 December 2023

Presentation Date: 04 December 2023

Software Release Date: 03 December 2023

[![GitHub G1-milestone2 details](https://img.shields.io/github/milestones/progress/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/3?label=G1-milestone2)](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/milestone/3)
[![GitHub G1-mobile-milestone2 details](https://img.shields.io/github/milestones/progress/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/2?label=G1-mobile-milestone2)](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/milestone/2)

### Content:

* [Project Plan](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Project-Plan)
* [Responsibility Assignment Matrix](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Responsibilities)
* [Software Requirements Specification (Includes Glossary)](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Requirements)
* [Mockups](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Mockups-and-Storyboards)
* [User Scenarios](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/User-Scenarios)

### Progress Tracking:
* [Kanban Board](https://github.com/orgs/SWE574-Fall2023-Group1/projects/1)
* [Milestone 2 Issues](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/milestone/3)
* [Meeting Notes](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Meeting-Notes)

### Software Release:
* [0.2.0-alpha Release Notes](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/releases/tag/customer-milestone-2)
* [Android Application APK](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/releases/download/customer-milestone-2.1/app-release-0.2.1-alpha.apk)

### Milestone Review:
* [Milestones](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Milestones)

#### Current Status

The web and mobile apps are currently deployed with all the features from the previous milestone, with the addition of the following new features:

- [x] Memory Creation (Mobile)
- [x] Memory Viewing (Mobile)
- [x] Recommendation Engine (Web)
- [x] Timeline (Web)
- [x] Memory Editing (Web)
- [x] Location Alias (Web)
- [x] Rehauled Frontend (Web)

#### Requirements Addressed
The following functional requirements have been addressed in the current release. For the ones that are yet to be addressed, consult the full requirements list above.

| NO | REQUIREMENT                                                                                                                                        | STATE             |
|------|----------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
| F-2.12 | The system shall recommend memories to members based on their activity.                                                                                                   | <ul><li>[x] </li> |
| F-2.14 | The system shall display memories from a specific location as a visual timeline.                                                                    | <ul><li>[x] </li> |
| F-2.16 | The system shall match tags to semantic categories.                                                                                                               | <ul><li>[x] </li> |
| F-2.17 | The system shall allow members to label semantic tags.                                                                                                               | <ul><li>[x] </li> |
| F-2.18 | The system shall allow members to edit their memories’ title, location, time and tags.                                                                 | <ul><li>[x] </li> |
| F-2.19 | The system shall allow members to edit their memories’ location names.                                                                 | <ul><li>[x] </li> |
| F-4.3 | The system shall display activities by followed members.| <ul><li>[x] </li> |

#### Testing

Unit tests are now handled in the new CI pipelines:

* We implemented a [Django test pipeline](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/actions/workflows/django.yml) for the web app.
* We implemented a [Flutter test pipeline](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/actions/workflows/test_apk.yml) for the mobile app.

#### Future Plans

For the final milestone, we plan to implement all the remaining features of the web app to the mobile app, execute our final tests, fix all the frontend and backend bugs identified, and improve the features that were newly implemented in 0.2.0-alpha such as the timeline, recommendations, and activity stream.

#### Feedback & Reflections

##### Team Feedback & Reflections
* Live demonstration on an emulator led to unforeseen technical issues. It might be better to record a demonstration video instead and showcase the software application through this pre-recorded format, or demonstrate on a real Android device.
* Spontaneous presentation for milestone 2 did not turn out well. We need to specify what is fully functional and what is not yet developed, so that we can prevent any disruptions during the presentation and proceed smoothly.
* We were not able to demonstrate the full functionality of the mobile app due to the aforementioned issues.

##### Customer and Other Teams' Feedback & Reflections
* We were asked to implement semantic tags, tag labeling, location labeling, and location specification in the forms of lines, shapes and radius. All of these features have been implemented.
* We were asked to change the edit and create button labels, which have been fixed.
* We were asked about using SparQL for semantic search, and telemetry for user data.

#### New Tools & Platforms Used:

| **Tool** | **Purpose** |
| -------- | ----------- |
| GitHub Discussions | Forum for discussions and brainstorming |
| PostGIS | Adds support for geographic objects to PostgreSQL |

We moved from a PostgreSQL database to PostGIS in order to accommodate our changing location formats. We have also taken the professor's feedback regarding our long-form issues and started using GitHub Discussions for brainstorming and decision-making, only using Issues for short-form bug and task notation. For every other operation, we have kept on using the same tools that were featured in the milestone 1 report.

### Individual Contributions:

* [Members and Team Distributions](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/wiki/Team-Members)

#### **Ayhan**

 * **Responsibilities:**
    - General improvements & bug fixes in mobile app
    - Mobile - Story creation logic
    - Mobile - Pagination for listing stories
    - Mobile - Area selection map design
    - Mobile - Current location getter logic
    - Mobile - Reverse geocoding for the locations in map
    - Mobile - Semantic tag implementation
    - Mobile - Uploading image in story creation from gallery
    - Mobile - Routing logic improvements

 * **Main contributions:**

     * **Code-related significant issues:** 
        - Fetch stories from backend [#44](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/44)
        - Define base route branches in main file [#45](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/45)
        - Add create story page [#56](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/56)
        - Add pagination logic for loading stories in home page [#57](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/57)
        - Research location map with polygon, point, polyline and circle [#60](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/60)

     * **Management-related significant issues:**
        - Recommendation System Brainstorming [#67](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/67)
        - Drawable Location Brainstorming [#100](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/100)
        - Activity Stream Brainstorming [#66](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/66)

 * **Pull requests:**
    - Base route branches PR [#46](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/46)
    - Story pagination PR [#59](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/59)
    - Create story PR (contains map and semantic tag) [#75](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/75)
    - Create story design improvements PR [#81](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/81)

 * **Additional information:**

    My primary focus has been implementing the story creation feature within our project. This feature contains a range of functionalities, including the dynamic selection of areas on a map, reverse geocoding for precise location identification, getting the user's current location, location search within the map, semantic tagging, and image uploads directly from the gallery. Beyond the story creation feature, I dedicated efforts to implementing several general improvements across the entire application, such as optimizing the routing mechanism from the base route and pagination logic for listing stories.

#### **Aykut**

 * **Responsibilities:**
    - Create the mockups for login page on web
    - Create the mockups for register page on web
    - Create the mockups for homepage on web
    - Create the mockups for user profile on web
    - Implement login page on web
    - Implement register page on web
    - Implement homepage on web
    - Implement user profile page on web
    - Make UI/UX improvement decisions
    - Improve frontend and bug fix
    - Update project plan

 * **Main contributions:**

     * **Code-related significant issues:**
        - Redesign profile page [#151](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/151)
        - Redesign homepage [#150](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/150)
        - Design Login Page [#147](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/147)
        - Register page design [#145](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/145)
        - Story like button does not work [#85](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/85)
        - Loading homepage is too late [#86](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/86)
        - Follow user and counter issue [#81](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/81)
        - Frontend Refinements [#75](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/75)
        - Fix author profile pic in memory detail [#201](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/201)
        - Timeline Design Imps [#153](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/153)
        - Logout button overlaps search bar [#143](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/143)
        - Timeline search result title issue [#130](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/130)
        - Create better pop-up messages [#112](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/112)
        - Improve User Page Story Preview [#41](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/41)
        - Improve Main Page Story Preview [#39](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/39)

     * **Management-related significant issues:**
        - Update and organize project plan for milestone 2 report [#173](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/173)
        - Improve frontend design [#68](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/68)

 * **Pull requests:**
    - Improve navbar [#143](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/213) 
    - Feature/150 design homepage [#205](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/205)
    - Feature/Improve profile page design #151 [#200](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/200)
    - feature/147-design-login-page [#148](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/148)
    - feature/145-register-page-design [#146](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/146)
    - Feature/81 follow user button counter issue [#99](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/99)
    - Update storyDetails for like issue [#95](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/95)
    - Feature/75 frontend refinements [#76](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/76)
    - Feature/108 reduce defined but never used warnings [#144](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/144)
    - Dev -> Main #36 #37 #50 #56 [#65](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/65)

 * **Additional information:**
    Create and iterate upon user interface (UI) designs using Figma to ensure a visually appealing and user-friendly experience. Collaborate with fellows to incorporate feedback and implement design changes effectively. Translate UI designs into functional web pages, ensuring seamless integration of design elements and responsiveness across various devices. Implement features for the home page, login/register page, and user profile page, adhering to design specifications and project requirements. Conduct thorough testing of the developed pages to identify and rectify any inconsistencies or issues. Specifically focus on testing the home page, login/register page, and user profile page to ensure a smooth and error-free user experience. Address and resolve reported bugs, including issues such as non-functional features (e.g., story-like button) and excessive loading times. Collaborate with the team to replicate and troubleshoot reported problems, ensuring a high level of software quality.

#### **Caner**

 * **Responsibilities:**
    - Backend general improvements & bug fixes.
    - Backend improvements on API responses for both Web App & Mobile App.
    - Backend model, serializer & API creation for activity system.
    - Backend model, serializer & API creation for recommendation system.
    - Backend model, serializer & API creation for edit story system.
    - Backend model, serializer & API creation for new drawable location system.
    - Backend model, serializer & API creation for semantic tag system on both story creation & story edit.
    - Frontend component creation for Edit Story feature.
    - Frontend component creation for Activity Stream feature.
    - Frontend component creation for Recommendation feature.
    - Frontend component improvement for Creation Story with drawable locations.
    - Frontend component creation for Edit Story feature.
    - Frontend component improvement to implement "semantic tag" to create story & edit story features.
    - General improvements on virtual machine speeds.
    - Discussion with [**Sadık**](#Sadık) for improvement on Backend systems & logics.
    - Executed dev+prod web deployments w/ [**Sadık**](#Sadık)
    - Technical presentation parts for milestone 2.

* **Main contributions:**

     * **Code-related significant issues:**
        - Timeline Feature Backend [#45](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/45)
        - Timeline Feature Frontend [#49](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/49)
        - Activity Stream Frontend & Backend [#131](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/131) [#138](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/138)
        - Drawable Locations Frontend & Backend [#100](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/100)
        - User Profile Navigation Bug Fixes [#107](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/107)
        - Make All Story Content Editable Frontend & Backend [#111](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/111) [#117](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/117)
        - Search Page Improvements on Frontend [#129](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/129) [#133](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/133)
        - Location Name Editable While Creating a Memory on Frontend [#152](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/152)
        - Backend Bug Fixes & Improvements for Mobile Part [#161](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/161) [#191](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/191)
        - Semantic Tag Integration on Frontend & Backend [#169](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/169)
        - Frontend Bug Fix for Double Rendering [#186](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/186)
        - Fix author profile pic in memory detail [#201](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/201)
        - Create Story "nullable" Field & Response Changes on Backend for both Frontend & Mobile [#192](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/192)
        - Profile Page Follower Counter Bug Fix [#203](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/203)
        - Recommendation System Version 1 with Semantic Tag Backend & Frontend [#181](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/181)

     * **Management-related significant issues:**
        - Recommendation System Brainstorming [#67](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/67)
        - Drawable Location Brainstorming [#100](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/100)
        - Activity Stream Brainstorming [#66](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/66)

 * **Pull requests:**
    - General Backend Bug Fixes & Improvements PRs [#118](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/118) [#134](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/134) [#162](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/162) [#164](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/164)
    - General Frontend Bug Fixes & Improvements PRs [#134](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/134) [#188](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/188) [#193](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/193)
    - Timeline Related PRs [#70](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/70) [#98](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/98)
    - Make Drawable Location & Rename Location PRs [#128](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/128) [#155](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/155)
    - Activity Stream PRs [#132](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/132) [#139](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/139)
    - Dev to Main PRs [#165](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/165)
    - Semantic Tag PRs [#180](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/180)
    - Edit Story PRs [#211](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/211)
    - Recommendation System PRs [#189](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/189)

 * **Additional information:**

    Try to engage with everyone to help if anyone needs it. Also, mainly worked with [Sadık](#Sadık) to make our backend system works better. Also, I helped the mobile team explain our back-end services to them so that they can more easily implement mobile services. Besides, mostly created the backend logic with a base frontend integration, so that frontend team can develop a better design and logic on web part.

#### **Deniz**

 * **Responsibilities:**

    * Redesign memory and search frontends 
    * Fix frontend bugs
    * Moderate meetings and take notes
    * Maintain wiki by adding new content
    * Improve issue notation by proofreading
    * Work on timeline and message designs
    * Present progress for customer milestone 2

 * **Main contributions:**

    * **Code-related significant issues:**
        * Add feature to edit memory content [#111](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/111)
        * Fix author profile pic in memory detail [#201](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/201)
        * Redesign search frontend [#172](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/172)
        * Redesign memory viewing screen [#171](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/171)
        * Redesign memory creation screen [#170](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/170)
        * Create better pop-up messages [#112](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/112)

    * **Management-related significant issues:**
        * Improve frontend design [#68](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/68)
        * Create sample memory for professor [#175](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/175)
        * Write new user scenarios [#174](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/174)
        * Write milestone 2 report [#173](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/173)

 * **Pull requests: (opened, reviewed, merged)**
    * Feature/172 redesign search frontend [#199](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/199)
    * Feature/171 redesign memory viewing screen [#198](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/198)
    * Feature/170 Redesign memory creation screen [#182](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/182)
    * Merge milestone 1 report [#94](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/94)
    * Reports->Main Milestone-2 [#190](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/190)
    * Feature/145-register-page-design [#146](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/146)
    * Dev->Main #101 #105 #81 #109 #100 #124 #120 #131 #133 #123 #124 #136 #138 #135 #103 #108 #122 #145 #147 #152 #157 #161 #158 #166 [#165](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/165)
    * Add Search semantic tag feature on search [#235](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/235)
    * Fix story author photo [#231](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/231)

#### **Mert**

 * **Responsibilities:**
    1. Developing the mobile app in Flutter
    2. Developing the mobile designs in Flutter
    3. Writing unit tests for the mobile app
    4. Making UI/UX decisions for the mobile app
 * **Main contributions:**
    1. Story detail page developed. Showing every detail related to selected story. Including author, title, content, tags, time resoulution, locaction (point/circle/line/area), like count and comments.
    2. Story page is interative so that a user can like and comment stories within the page.
    3. Made UI/UX decision on mobile app due to my extensive experience on mobile development
    
     * **Code-related significant issues:**
    1. User shall be able to post comment on story details page. [**#66**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/66)
    2. Story Detail Page UI Improvements [**#71**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/71)
    3. Story like counters are not refreshed [**#63**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/63)
    4. Implement story details page [**#55**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/55)
    
     * **Management-related significant issues:**
    1. Find examples from similar apps to improve user experience [**#71**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/71)

 * **Pull requests:**
    1. Completed development of Story Detail Page [**#67**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/67)

 * **Additional information:**
    Worked with Oğuz to give him my insight on UX on mobile apps and collaborate ideas to design screens.

#### **Oğuz**
 *  **Responsibilities:**

    1. Creating the mockup designs for mobile and web app
    2. Developing frontend improvements for web app
    3. Making UI/UX improvement decisions
 * **Main contributions:**

     * **Code-related significant issues:**
    1. Make website pop-up messages for login and register [**#183**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/183)
    2. Redesign Activity Stream page [**#177**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/177)
    3. Redesign Header for Website [**#176**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/176)
    4. Timeline Design Imps [**#153**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/153)
    
  
     * **Management-related significant issues:**
    1. Improve frontend design [**#68**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/68) 

 * **Pull requests:**

    1. Website Navbar Improvement [**#210**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/210)
    2. Login - Register pop-up messages [**#207**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/207)
    3. Redesign Activity Stream [**#204**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/204)
    4. Visual Changes on Header [**#187**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/187)
 * **Additional information:**
    Worked with the teammates about UX/UI improvements. I reviewed pull requests and merge them into dev branch.

#### **Sadık**
 * **Responsibilities:**
    - Member of backend, mobile, devops teams.
    - General improvements & bug fixes in both apps.
    - General improvements on virtual machine speeds.
    - Discussion w/ [**Caner**](#Caner) for improvement on Backend systems & logics.
    - Both repos' test&build GitHub Actions workflow pipelines.
    - Made UI/UX improvement decisions.
    - Reviewed mostly all pull-requests of both repos.
    - End-to-end tests while reviewing pull-requests.
    - Executed dev+prod web deployments w/ [**Caner**](#Caner)
    - Executed mobile deployments and test pipeline w/ [**Ayhan**](#Ayhan) & [**Mert**](#Mert)
    - Led the milestone-2 pre-release processes.
    - Published [**app-download website**](https://swe574-fall2023-group1.github.io/) w/ **QR codes**.

 * **Main contributions:**

    * **Code-related significant issues**:
        - Remove remove-profile-photo button for empty pics [**#101**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/101)
        - Update author info in LICENSE file [**#103**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/103)
        - Reduce "defined but never used" warnings in frontend [**#108**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/108)
        - Remove duplicate dictionary key [**#109**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/109)
        - Migration file for new StoryImage model [**#110**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/110)
        - Add Makefile [**#120**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/120)
        - Clear django staticfiles_dirs list [**#122**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/122)
        - Add .env.sample files to corresponding directories [**#123**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/123)
        - Django log level management [**#124**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/124)
        - Makefile new target: env-files [**#135**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/135)
        - Extend photos/images folders' .gitignore files [**#136**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/136)
        - Django Debug Mode [**#157**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/157)
        - Add new targets into Makefile [**#158**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/158)
        - Add missing migration file [**#166**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/166)
        - Reduce docker image sizes [**#168**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/168)
        - [CI] Django Test Pipeline [**#178**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/178)
        - Documentation for local frontend development [**#184**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/184)
        - Recommendation System Ideas [**#67**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/67)
        - Add Makefile for mobile repo [**#68**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/68)
        - Change app launcher logo (Android) [**#69**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/69)
    * **Management-related significant issues:**
        * Create sample memory for professor [**#175**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/175)
        - Write milestone 2 report [**#173**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/173)

 * **Pull requests:**
    - Project wide all environment variables - sample files [**#125**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/125)
    - Backend django log level management [**#126**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/126)
    - Project wide make usage and Makefile [**#127**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/127)
    - Backend extending image .gitignore [**#137**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/137)
    - Backend clear django STATICFILES_DIRS list [**#141**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/141)
    - Update author info in License file [**#142**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/142)
    - Frontend reduce defined but never used variables [**#144**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/144)
    - Backend django debug mode management [**#159**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/159)
    - Add new targets to Makefile [**#140**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/140) [**#160**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/160)
    - Backend adding missing migration files [**#167**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/167)
    - CI Django test pipeline [**#179**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/179)
    - "make local-frontend" for frontend developers [**#185**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/185)
    - docker-compose-pipeline.yml [**#196**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/196)
    - Reduce both docker image sizes [**#197**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/197)
    - Dev->Main code releases [**#165**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/165) [**#206**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/206)
    - Mobile - Feature/69 change app launcher logo android [**#70**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/70)
    - Mobile - Feature/68 add Makefile for mobile repo [**#77**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/77)
    - Dev->Main mobile code releases [**#76**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/76) [**#90**](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/90)
 * **Additional information:**
    1. Shared git and docker usage info with the team.
    1. Shared slim-buster info in docker images.
    1. Shared experiences on SDLC. Especially via project cards.
    1. Facilitated Kanban methodology from Agile framework.
    1. Facilitated Saturday meetings w/ done, doing, will-do tasks and any blockages methodology.
    1. Spread code conventions and code quality in both repos.