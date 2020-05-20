This manual instructs building the application and packaging it into an installation package for the desired target platform. At the moment, the target platform packages can be built only from selected origin platforms:
•	Windows – from macOS, GNU/Linux, Windows
•	macOS – only from macOS
•	GNU/Linux – from macOS, GNU/Linux

Follow these steps to build the installation package:
1.	Install the latest Node.js available.
2.	Transfer the source code folder to your computer from the enclosed attachment.
3.	Navigate to the source code directory in the command line.
4.	Run *npm install* command to install all dependencies.
5.	Run *npm run build* command to build the React app.
6.	Run *electron-builder -wml* command to build a packaged installation file (Windows: -w, macOS: -m, GNU/Linux: -l, all:-mwl).
7.	Run the packaged installation file in the dist directory within the app folder.
