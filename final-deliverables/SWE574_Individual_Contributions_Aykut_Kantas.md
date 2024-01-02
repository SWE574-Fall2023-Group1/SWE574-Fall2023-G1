# Aykut Kantaş

## Requirements fulfilled

### F-1.1 New members shall register with a unique username and password.

**Description:**
The registration feature requires new members to create a unique username and password. This ensures secure, individualized access and maintains data integrity within our system.

**Issue:**
[Register page design #145](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/145)

**Pull request:**
[feature/145-register-page-design](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/146)

#### Explanation of the code

The code is a segment from a React component for a registration page in our web application. It features a user interface where individuals can sign up by entering their username, email, and password. The layout is built using Flexbox for centering and arranging elements, and inline CSS styles are applied for consistent design. The form includes TextField components for input fields, each with event handlers to update state and handle key presses. A Button component is used for submitting the registration form, with an onClick event linked to the form submission logic. Additional elements like spacing divs and a ToastContainer for notifications are included. The design focuses on a clean, user-friendly experience with direct feedback and interaction.

##### Screenshots:
![Screenshot 2023-12-29 at 17.53.44](https://hackmd.io/_uploads/S1Ni6UhPp.png)


### F-1.2 Members shall log in with their username and password.

**Description:**
Members must use a unique combination of a username and a password to log in. The username serves as a personal identifier, distinct for each member, while the password provides a secure key, known only to the member and the system.

**Issue:**
[Design Login Page #147](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/147)

**Pull request:**
[feature/147-design-login-page](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/148)

#### Explanation of the code

The code represents login page in our React web application. It features a centralized layout with Flexbox styling and a responsive design. Key elements include an image header, username and password input fields (using TextField components), and a visually appealing login button with an onClick event handler. The page also provides navigation options for new users to register and for existing users to recover forgotten passwords. The design is consistent and user-friendly, focusing on ease of use and clear navigation. A ToastContainer is included for displaying notifications, enhancing user interaction and feedback.

##### Screenshots:
![Screenshot 2023-12-29 at 17.54.39](https://hackmd.io/_uploads/SJ1R6Lnwp.png)


### F-2.15 The system shall allow users to see other's memories on feed page.

**Description:**
This requirement outlines that the system will feature a feed page where users can view memories shared by others. The feed will display a collection of posts representing memories. Each user will have the ability to access this feed and browse through these shared memories, fostering a sense of community and connection among the user base. The system's design will ensure that this feed is easily navigable and visually engaging, enhancing the user experience.

**Issue:**
[Redesign homepage #150](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/147)

**Pull request:**
[Feature/150 design homepage](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/205)

#### Explanation of the code

The React component which we used in home page of our web application displays a list of stories with pagination. When loading, it shows a "Loading..." message. Once loaded, it lists stories, each with an author photo, username, and creation date. Story titles are clickable, leading to more details. Date and location are also shown, enhanced with icons. The pagination section at the bottom allows users to navigate between pages. CSS styling is applied for a clean and interactive user interface, with hover effects and clickable elements for a better user experience.

##### Screenshots:
![Screenshot 2023-12-29 at 17.57.11](https://hackmd.io/_uploads/rJRDRIhPa.png)

### F-3.3 The system shall display activities of the followed users.

**Description:**
The system will have a feature to showcase the activities of users that an individual follows. This functionality will allow users to stay updated with the actions (such as follow, unfollow, comment, create new story, like, unlike).

**Issue:**
[Activity Stream design improvements #110](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/110)

**Pull request:**
[110-activity-stream-design-improvements #130](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/130)
[Add commented activity on activity stream #133](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/133)

#### Explanation of the code

The code is a part of our Flutter mobile application, specifically for the "Activity Stream" feature. It displays a stream of user activities like story likes, follows, comments, etc., in a list format. State Management uses the Bloc pattern for managing the application's state. Different states like loading, success, failure, and offline are handled to update the UI accordingly. Activity Stream Route is defined as a StatefulWidget, which means it has a mutable state. It's responsible for displaying the activity stream. The UI is built dynamically based on the current state. It includes a loading indicator, a list of activities, error messages, and offline indicators. Each activity is represented with an icon and a description, both determined by the type of activity (like liking a story, following a user, etc.). The app allows users to interact with the activity stream, like navigating to a user's profile when an activity is tapped. Custom methods like _buildActivityItem, _getActivityIcon, and _getActivityDescription are used for building individual components of the activity list.

##### Screenshots:
![Screenshot 2023-12-30 at 17.05.22](https://hackmd.io/_uploads/HJkfO06Da.png)

### F-3.4 Activities shall be sorted by the type such as, like unlike, follow, comment.

**Description:**
The system will categorize and sort activities based on their type, such as likes, unlikes, follows, unfollows, comments and new story creation. This sorting feature ensures that users can easily navigate and view specific types of interactions.

**Issue:**
[Activity Stream design improvements #110](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/110)

**Pull request:**
[110-activity-stream-design-improvements #130](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/130)
[Add commented activity on activity stream #133](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/133)

#### Explanation of the code

The code is a part of our Flutter mobile application, specifically for the "Activity Stream" feature. It displays a stream of user activities like story likes, follows, comments, etc., in a list format. State Management uses the Bloc pattern for managing the application's state. Different states like loading, success, failure, and offline are handled to update the UI accordingly. Activity Stream Route is defined as a StatefulWidget, which means it has a mutable state. It's responsible for displaying the activity stream. The UI is built dynamically based on the current state. It includes a loading indicator, a list of activities, error messages, and offline indicators. Each activity is represented with an icon and a description, both determined by the type of activity (like liking a story, following a user, etc.). The app allows users to interact with the activity stream, like navigating to a user's profile when an activity is tapped. Custom methods like _buildActivityItem, _getActivityIcon, and _getActivityDescription are used for building individual components of the activity list.

##### Screenshots:
![Screenshot 2023-12-30 at 17.05.22](https://hackmd.io/_uploads/HJm-_CTva.png)



### F-4.1 The system shall allow members to add a profile photo to their profile.

**Description:**
The system will enable members to upload and display a profile photo on their personal profile. This feature allows users to personalize their account with an image of their choice, which can be a photograph, an avatar, or any other graphic that represents them.

**Issue:**
[Redesign profile page #151](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/151)

**Pull request:**
[Feature/Improve profile page design #151](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/200)

#### Explanation of the code

This code is a component from our React web application for user profile pages. A flexbox layout displaying the user's profile photo (if available), username, and follower count. The photo can be added, changed or removed with buttons that trigger corresponding functions. The included CSS styles define the appearance of profile photos and buttons. The design focuses on readability, ease of use, and responsive layout.

##### Screenshots:
![Screenshot 2023-12-29 at 17.58.05](https://hackmd.io/_uploads/SJUeJvhwa.png)


### F-4.2 The system shall allow members to add a bio to their profile.

**Description:**
The system will provide members the option to add a bio to their profile. This feature enables users to share a brief personal description, interests, or any information they wish to convey about themselves to the community.

**Issue:**
[Redesign profile page #151](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/151)

**Pull request:**
[Feature/Improve profile page design #151](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/200)

#### Explanation of the code

This code is a component from our React web application for user profile pages. Users can add their bio in a text field (TextField component) with a character limit and multiline support. Save and cancel buttons are provided to submit changes or revert them. The included CSS styles define the appearance.

##### Screenshots:

![Screenshot 2023-12-29 at 18.02.29](https://hackmd.io/_uploads/BJ4TyDhv6.png)



### F-4.3 The system shall allow members to edit their profile photo.

**Description:**
The system will include a functionality for members to edit their profile photo. This feature allows users to update, change, or adjust their existing profile image as desired.

**Issue:**
[Redesign profile page #151](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/151)

**Pull request:**
[Feature/Improve profile page design #151](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/200)

#### Explanation of the code

This code is a component from our React web application for user profile pages. A flexbox layout displaying the user's profile photo. The photo can be changed with button that trigger corresponding functions. The included CSS styles define the appearance of profile photos and buttons.

##### Screenshots:
![Screenshot 2023-12-29 at 18.00.35](https://hackmd.io/_uploads/Sy4SyvnDp.png)

### F-4.4 The system shall allow members to remove their profile photo.

**Description:**
The system will provide members with the option to remove their existing profile photo. This feature enables users to delete their current profile image, which results in the display of a default avatar.

**Issue:**
[Redesign profile page #151](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/151)

**Pull request:**
[Feature/Improve profile page design #151](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/200)

#### Explanation of the code

This code is a component from our React web application for user profile pages. A flexbox layout displaying the user's profile photo. The photo can be removed with button that trigger corresponding functions. The included CSS styles define the appearance of profile photos and buttons.

##### Screenshots:
![Screenshot 2023-12-29 at 18.00.35](https://hackmd.io/_uploads/Sy4SyvnDp.png)

### F-4.5 The system shall allow members to edit their bio.

**Description:**
The system will offer a feature for members to edit their bio. This functionality enables users to modify, update, or completely change the personal description or information displayed in their profile bio.

**Issue:**
[Redesign profile page #151](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/151)

**Pull request:**
[Feature/Improve profile page design #151](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/200)

#### Explanation of the code

This code is a component from our React web application for user profile pages. Users can edit their bio in a text field (TextField component) with a character limit and multiline support. Save and cancel buttons are provided to submit changes or revert them. The included CSS styles define the appearance.

##### Screenshots:
![Screenshot 2023-12-29 at 18.01.38](https://hackmd.io/_uploads/rket1P2Dp.png)

### F-4.6 The system shall allow members to see other members' profiles.

**Description:**
The system will allow members to view the profiles of other members. This feature facilitates users engagement by enabling them to access and explore the personal profiles and stories of others.

**Issue:**
[Redesign profile page #151](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/151)

**Pull request:**
[Feature/Improve profile page design #151](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/200)

#### Explanation of the code

This React component is designed for displaying user profiles in our web application. It differentiates between the current user's profile, showing a UserProfile component, and other users' profiles, which include profile photos, usernames, follower counts, and follow/unfollow buttons. The bio section presents the user's biography, and the stories section lists recent stories with pagination for navigation. The component dynamically adjusts content and style based on the user's identity (whether it's the current user or another user) and the loading state of the stories. The CSS styling aims for a clean, user-friendly interface with interactive elements.

##### Screenshots:
![Screenshot 2023-12-29 at 18.04.45](https://hackmd.io/_uploads/Hy77xD3v6.png)



## Code Reviews

| Pull request                                                                                                                                               | Author           |
|------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| [Feature/356 frontend minor refinements](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/357)                                             | Sadık Kuzu       |
| [Feature/354 unit test for recommendations page](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/355)                                     | Sadık Kuzu       |
| [Dev->Main #321 #322 #324 #326 #332 #335 #328 #299 #331 #342 #341 #346 #340 #348 #349 #340 #354 #356 #358 #360 #362 #364 #366 #368 #370](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/351)                                                                             | Sadık Kuzu       |
| [Feature/285 implement frontend pop up warnings](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/311)                                     | Deniz Aslan      |
| [Merge final report to dev branch](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/296)                                                   | Deniz Aslan      |
| [Bug/230 user profile stories bug](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/234)                                                   | Caner Ertam      |
| [Fix login register sizes & header sizes #232](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/233)                                       | Caner Ertam      |
| [Feature/108 reduce defined but never used warnings](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/144)                                 | Sadık Kuzu       |
| [Update storyDetails for like issue](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/95)                                                 | Caner Ertam      |
| [Dev -> Main #36 #37 #50 #56](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/65)                                                         | Caner Ertam      |
| [Feature/129 recommendations tests](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/131)                                           | Ayhan Cavdar     |


## Pull Requests

| Pull request                                                                                                                                      | Author       |
|---------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| [Add unit test for search story details box #368](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/369)                          | Aykut Kantaş |
| [Add unit test for search user results #366](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/367)                                | Aykut Kantaş |
| [Add unit test for search results #364](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/365)                                    | Aykut Kantaş |
| [Add unit test for tag search #362](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/363)                                        | Aykut Kantaş |
| [Add unit test for story details #360](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/361)                                      | Aykut Kantaş |
| [Add unit test for comment section #358](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/359)                                    | Aykut Kantaş |
| [340 unit test for profile pages](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/352)                                          | Aykut Kantaş |
| [Add unit test for resetpassword #348](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/350)                                      | Aykut Kantaş |
| [Add unit test for logout #346](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/347)                                            | Aykut Kantaş |
| [Add profile page unit test #340](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/339)                                          | Aykut Kantaş |
| [Add AllStories component test #334](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/339)                                        | Aykut Kantaş |
| [Add Register Unit Test #332](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/333)                                              | Aykut Kantaş |
| [Add unit test v2 for login #80](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/254)                                            | Aykut Kantaş |
| [Improve navbar #143](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/213) | Aykut Kantaş |
| [Feature/150 design homepage](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/99)                                        | Aykut Kantaş |
| [Dev->Feature/150-design-homepage](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/202)                                          | Aykut Kantaş |
| [Feature/Improve profile page design #151](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/200)                                  | Aykut Kantaş |
| [feature/147-design-login-page](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/148)                                            | Aykut Kantaş |
| [feature/145-register-page-design](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/146)                                          | Aykut Kantaş |
| [Feature/81 follow user button counter issue](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/99)                                | Aykut Kantaş |
| [Feature/75 frontend refinements](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/pull/76)                                            | Aykut Kantaş |
| [Add commented activity on activity stream](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/133)                          | Aykut Kantaş |
| [110-activity-stream-design-improvements](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/pull/130)                            | Aykut Kantaş |



## Issues

| Issue                                                                                                                        | Created by me | Assigned to me |
|------------------------------------------------------------------------------------------------------------------------------|---------------|----------------|
| [Unit Test For Search Story Details Box](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/368)              | ✅            | ✅              |
| [Unit Test For Search User Results](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/366)                  | ✅            | ✅              |
| [Unit Test For Search Results](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/364)                       | ✅            | ✅              |
| [Unit Test For Tag Search](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/362)                            | ✅            | ✅              |
| [Unit Test For Story Details](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/360)                        | ✅            | ✅              |
| [Unit Test For Comment](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/358)                             | ✅            | ✅              |
| [Unit Test For Reset Password](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/348)                        | ✅            | ✅              |
| [Unit Test For Logout Page](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/346)                          | ✅            | ✅              |
| [Unit Test For Profile Pages](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/340)                        | ✅            | ✅              |
| [Unit Test For Home Page](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/334)                           | ✅            | ✅              |
| [Unit Test For Register Page](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/332)                        | ✅            | ✅              |
| [Location Marker Label Design](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/154)                        | ✅            | ✅              |
| [Redesign profile page](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/151)                             | ✅            | ✅              |
| [Redesign homepage](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/150)                                 | ✅            | ✅              |
| [Design Login Page](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/147)                                  | ✅            | ✅              |
| [Register page design](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/145)                               | ✅            | ✅              |
| [Loading home page is too late](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/86)                      | ✅            | ✅              |
| [Story like button does not work](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/85)                      | ✅            | ✅              |
| [Unit test execution](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/80)                                  | ✅            | ✅              |
| [Implement user acceptance tests](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/79)                      | ✅            | ✅              |
| [Frontend Refinements](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/75)                                | ✅            | ✅              |
| [Project Plan for Milestone 1 Report](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/74)                | ✅            | ✅              |
| [Create Web Application Mockups](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/31)                     | ✅            | ✅                                                                                                            | [Organize and revise requirements](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/29)                    | ✅            | ✅              |
| [Fix author profile pic in memory detail](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/201)            | ✅            |                 |
| [Match mobile and web password requirements](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/96)          | ✅            |                 |
| [Record Demonstration Videos](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/315)                        |               | ✅              |
| [Plan cross-team meetings](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/301)                            |               | ✅              |
| [Improve timeline response formatting](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/297)                |               | ✅              |
| [Line for Timeline](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/286)                                  |               | ✅              |
| [Implement frontend pop-up warnings](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/285)                  |               | ✅              |
| [Write milestone 2 report](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/173)                           |               | ✅              |
| [Fix login page scaling](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/163)                              |               | ✅              |
| [Timeline Design Imps](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/153)                              |               | ✅              |
| [Fix logout button overlapping search bar](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/143)            |               | ✅              |
| [Timeline search result title issue](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/130)                  |               | ✅              |
| [Add actions for enter key](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/113)                          |               | ✅              |
| [Create better pop-up messages](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/112)                      |               | ✅              |
| [Add feature to edit memory content](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/111)                  |               | ✅              |
| [Upload mockups directly to repo](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/87)                      |               | ✅              |
| [Cache photo system in frontend](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/83)                      |               | ✅              |
| [Follow user button & counter issue](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/81)                  |               | ✅              |
| [Improve frontend design](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/68)                            |               | ✅              |
| [Recommendation System Ideas](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/67)                          |               | ✅              |
| [Write milestone 1 report](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/64)                           |               | ✅              |
| [Make necessary changes on Frontend Components for Timeline Feature](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/49)  |               | ✅              |
| [Hold first frontend meeting](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/47)                          |               | ✅              |
| [Create needed component on frontend for Timeline Feature](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/46)   |               | ✅              |
| [Get on the same page](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/44)                                |               | ✅              |
| [Display notification if signup is ok](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/42)                |               | ✅              |
| [Improve User Page Story Preview](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/41)                      |               | ✅              |
| [Improve Main Page Story Preview](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/39)                      |               | ✅              |
| [Create Scenarios for Milestone 1](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1/issues/38)                    |               | ✅              |
| [Activity Stream design improvements](https://github.com/SWE574-Fall2023-Group1/SWE574-Fall2023-G1-mobile/issues/110)          |               | ✅              |
