This manual instructs on how to run the application in the development environment and how to build an installation package with technologies described in 5.5. At the moment, the target platform installation packages can be built only from selected origin platforms:

•	Windows  – buildable from macOS, GNU/Linux, Windows
•	macOS – buildable only from macOS
•	GNU/Linux – buildable from macOS, GNU/Linux

Follow these steps to run the application in the development environment:
1.	Install the latest Node.js available.
2.	Transfer the source code folder to your computer from the enclosed attachment.
3.	Navigate to the source code directory in the command line.
4.	Run **npm install** command to install all dependencies.
5.	Run **npm run start** command to start a development Node.js server.
6.	Run **npm run electron** command in a new command line to start the application (in the application directory).

Continue with these steps, if you would like to build an installation package:
7.	Run **npm run build** command to build the React app.
8.	Run **npm run dist -wml** command to build a packaged installation file, according to targeted platforms (Windows: -w, Linux: -l, macOS: -m, all: -wml).
9.	Run the packaged installation file in the **dist** directory within the app folder.

Contact the author: hoang.doan@rocketmail.com