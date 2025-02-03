# Personal Web Desktop (PWD)

## Introduction

A single-page application (SPA) with chat integration against a web socket server. Only client side code, server side not included here.


## The assignment

The PWD, the memory sub-application, the messages sub-application, and the custom sub-application.

The PWD application is the main application in which the smaller applications live. This part will have a "desktop-like" feeling with a dock in which the sub-applications icons will be presented to the user.

A user can open multiple instances of the same sub-application and multiple different sub-applications at once. The sub-applications in the PWD can be draggable using the mouse. It can be possible to place a sub-application on top of another sub-application. When the user gives a sub-application focus, it is placed in front of other sub-applications. The user can be able to close the sub-applications.

## 2. The Memory sub-app 

Several pairs of tiles are placed face-down in a grid in a memory game. The point of the game is to flip over tiles and match the pairs together. If the images on the facing tiles match, the matching tiles are removed. The tiles are flipped back face down if the images do not match. The object of the game is to find all pairs. The game is over when all the tiles are gone.

## 3. The Messages sub-app 

This sub-application is a course-wide message chat using Web Sockets. This application is a regular message client like WhatsApp, Signal, FB Messenger, or iMessage.
