@echo off

set NULL_VAL=null
set NODE_VER=%NULL_VAL%
set NODE_EXEC=node-v10.15.3-x86.msi

set SETUP_DIR=%CD%

node -v >.tmp_nodever
set /p NODE_VER=<.tmp_nodever
del .tmp_nodever

IF "%NODE_VER%"=="%NULL_VAL%" (
	echo.
	echo Node.js is not installed! Please press a key to download and install it from the website that will open.
	PAUSE
	start "" http://nodejs.org/dist/v10.15.3/%NODE_EXEC%
	echo.
	echo.
	echo After you have installed Node.js, press a key to shut down this process. Please restart it again afterwards.
	PAUSE
	EXIT
) ELSE (
	echo A version of Node.js ^(%NODE_VER%^) is installed. Proceeding...
	IF EXIST %SETUP_DIR%/tests (
	    echo.
		echo Starting script ... 
		echo.
		node main.js
		echo.
		echo Finished. Find your files inside the "pages" folder.
		echo Open them with a text editor to copy-paste their content on the website.
		echo.
		PAUSE
	) ELSE (
		echo.
		echo No folder named "tests".
		echo Please create a folder called "tests" and place every tests inside then restart.
		echo.
		PAUSE
		EXIT
	)
)