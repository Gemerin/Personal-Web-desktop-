# Personal Web Desktop (PWD)

## Introduction

In this examination assignment, you will focus on building a single-page application (SPA) with chat integration against a web socket server. This assignment's backend (server-side code) will be given, and your assignment is to write the client-side code.

In this assignment, you are supposed to build a "Personal Web Desktop" (PWD). First of all, have a look at this recording to get a better view of the assignment.

[Demo - Personal Web Desktop](https://youtu.be/gNcMvPCyHC0)

## The assignment

The assignment can be divided into the PWD, the memory sub-application, the messages sub-application, and the custom sub-application.

## 1. The PWD (#1, #2, #3, #4, #5, #6)

The PWD application is the main application in which the smaller applications live. This part will have a "desktop-like" feeling (#1) with a dock (#3) in which the sub-applications (#2) icons will be presented to the user. This application **should** be constructed as a SPA application (#6), and it is rewarding to create it as a PWA (progressive web application) with offline capabilities.

A user must be able to open multiple instances of the same sub-application and multiple different sub-applications at once (#5). The sub-applications in the PWD should be draggable using the mouse. It should be possible to place a sub-application on top of another sub-application. When the user gives a sub-application focus, it must be placed in front of other sub-applications. The user should be able to close the sub-applications (#4).

The PWD application should be extended with at least one additional custom feature (#2).

## 2. The Memory sub-app (#7, #8)

This sub-application is a simple [memory game](https://en.wikipedia.org/wiki/Concentration_(card_game)).

Several pairs of tiles are placed face-down in a grid in a memory game. The point of the game is to flip over tiles and match the pairs together. If the images on the facing tiles match, the matching tiles are removed. The tiles are flipped back face down if the images do not match. The object of the game is to find all pairs. The game is over when all the tiles are gone.

The Memory sub-app should be extended with at least one additional custom feature (#8).

For a complete list of requirements, refer to #7.

## 3. The Messages sub-app (#9, #10)

This sub-application is a course-wide message chat using Web Sockets. This application is a regular message client like WhatsApp, Signal, FB Messenger, or iMessage.

The Messages sub-app should be extended with at least one additional custom feature (#10).

For a complete list of requirements, refer to #9.

## 4. The Custom sub-app

As a third application, you are supposed to let your creativity come into play. Think of an application that you want to create and do that as your third application! Why not use this opportunity to try out some of the APIs in the browser that we still have not used?

To fulfill this part of the application, you should create an Issue describing your sub-application in the same way the Memory and Messages sub-applications are described (preferably before coding the sub-app). Make sure to link this issue under "Student-defined requirements" in the submission report.

- Question: "Is it okay to just create a simple "about" application with some text?"
- Answer: Yes. However, one of the grading criteria for this assignment will be how well you can adapt to using APIs that you have not yet used in the course.

## Requirements for a passing grade

Read [all application requirements](../../issues/). This includes: (#1, #2, #3, #4, #5, #6, #7, #8, #9, #10, #11, #12, #13, #14, #15, #16, #17, #18).

In this assignment, you are required to close issues and tasks ([ ]) that you implement. You are also required to create your issues (and close them) for added functionality.

## Requirements for a higher grade

To qualify for a higher grade, the application must meet additional requirements. 

1. All requirements for a passing grade must be met, #1 to #18.
2. PWD should be a progressive web application (PWA), #19.
3. Overall high quality of components and their dependencies, #20.

## Extending the assignment

This assignment is very flexible for you to extend and add extra features to, and the course management invites you to do so! To make sure that the examinator notices the feature, please create a use case (just like the other issues) as an issue in which you describe the feature. Add the issue to the "Student defined requirements" list in the submission report with a short comment describing the issue, like "Offline support."

### Example of extensions:

- Lazy loading. Why load needed sub-apps before the user clicks on an icon? (mandatory for a higher grade)
- Offline support (with service workers). (mandatory for a higher grade)
- Save the state of all windows and their positions when exiting the app.
- Encrypted message application.
- Emoji-enabled message application.
- Multiplayer Memory with game data synced over the chat.
- Video recording and or streaming using WebRTC and the MediaStream Recording API.
- Make the app installable by adding a .webmanifest-file. (mandatory for a higher grade)

## Altering the requirements

Suppose some requirements block your possibility of extending the application as you would like. In that case, it is often okay to skip or alter some requirements in the assignment as long as you do not make the assignment easier to solve or ignore central goals in the course, like not implementing web sockets.

### What you need to do before side-stepping any requirements:

- When in doubt, contact the course management for a blessing.
- Add a comment next to the side-stepped issue in the submission report.
- Do not close the issue or task that is not implemented.
- If the feature is substantial, add it as a new issue and link it in the submission report.
