# Pwgram

This project is based on a Instagram style webpage, with the use of silex and MVC project structure. 
Still some bugs in the edit profile page, but mostly done.  
Keep in mind, this was developed to work with a SSL certificate, so no password encryption was done in client side to ensure data is sent securely. 

Here is some screenshots/gifs:


## Frontpage

The frontpage structure has two categories, populars and recent. Both are organized in a grid layout. The information of each image is hidden and only visible when the user moves the mouse over. 

### No logged in
![Screenshot](WebPage/FrontPage.PNG)

----

### Logged in
![Screenshot](WebPage/FrontPageLogged.PNG)

----
### Animation on mouse hover
![Screenshot](WebPage/AnimationImage.gif)

## Access
### Login
Both the login and register are treated in popups, so the user doesn't have to visit another page to do it. 
![Screenshot](WebPage/Login.gif)

----
### Register
The profile image, just as we did in the new image page, we used Cropper.js, a JS library that gives an interface to crop images the way the user wants and in our case keep the aspect ratio of all images to 1:1. 
![Screenshot](WebPage/Register.gif)

----
### Disconnect

Dialog popup before user disconects. Cookies are deleted too.
![Screenshot](WebPage/disconnect.gif)

----

## Navigation Bar
Dropdown menus for both notifications and user options.

![Screenshot](WebPage/Menu.gif)

----
## Comments and likes

Both likes and comments are updated on the two categories at the same time and in the photo itself. 

![Screenshot](WebPage/CommentsAndLikes.gif)
----

## Pages
### Notifications

Users can sort the notifications by user, type, image and time. Once the user clicks on the "Visto" button on each notification, this disappears on both the table and the notification count in the NavBar.

![Screenshot](WebPage/NotificationPage.PNG)

----
### Comments

Just as the notifications page, this one lets users edit the comment and delete it. 

![Screenshot](WebPage/CommentsPage.PNG)

----
### Image

Each image holds the visits count. In this case, because we are the owners of the image, we can edit its title or privacy status and delete the image. 

![Screenshot](WebPage/ImagePage.PNG)

Users are limited to one comment per image, in case of trying to add more than one it shows a message:

![Screenshot](WebPage/CommentBlocked.gif)

----
### New Image

Users can add images of any size. But because the scale of the images would have to be treated and cut in some way, we decided to add a JS library called Cropper. This give users an interface to cut the image the way they like and we mantain the aspect ration of 1:1 in all images.

![Screenshot](WebPage/AddNewImage.gif)

![Screenshot](WebPage/AddNewImage.PNG)

----
### Profile

Simple profile page, all images are showed to the user including the private ones in case the profile you're looking is yours. 
![Screenshot](WebPage/Profilepage.PNG)

The user can also order images by recent, more likes or more comments
![Screenshot](WebPage/OrderByProfileImages.gif)


