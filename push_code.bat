@echo off
echo Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo Error: Git is not installed or not in PATH. Please install Git from https://git-scm.com/
    pause
    exit /b
)

echo Adding files...
git add .

echo Committing files...
git commit -m "Initial commit - VehiCare India App"

echo Renaming branch to main...
git branch -M main

echo Adding remote origin...
git remote add origin https://github.com/kasvalashubham-hub/vehicare-.git

echo Pushing to GitHub...
git push -u origin main

echo Done!
pause
