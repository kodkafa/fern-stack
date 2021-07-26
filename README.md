# FERN STACK

Firebase, Express, React and Node Boilerplate with Mobx (ex: https://kodkafa.com)

## Setup

If you want to "_automatic deployment_", please  fork before.
Firstly,  clone the project and build

```
git clone git@github.com:kodkafa/fern-stack.git my-project
cd my-project
yarn install
```

```
npm install -g firebase-tools
firebase login
firebase init
```

* Select **all features** and keep going
* Select the **Create a new project** and **!!! DO NOT** change rule and config files name and **DO NOT** overwrite.
*  File database.rules.json already exists. Do you want to overwrite it with the Realtime Database Security Rules for fern-stack-001-default-rtdb f
   rom the Firebase console? \
   **No**
* What file should be used for Firestore Rules? \
  **firestore.rules**
* File firestore.rules already exists. Do you want to overwrite it with the Firestore Rules from the Firebase Console? \
  **No**
* What file should be used for Firestore indexes? \
  **firestore.indexes.json**
* File firestore.indexes.json already exists. Do you want to overwrite it with the Firestore Indexes from the Firebase
  Console? \
  **No**
* What language would you like to use to write Cloud Functions? \
  **JavaScript**
* Do you want to use ESLint to catch probable bugs and enforce style? \
  **Yes**
* File functions/package.json already exists. Overwrite? \
  **No**
* File functions/index.js already exists. Overwrite? \
  **No**
* File functions/.gitignore already exists. Overwrite? \
  **No**
* Do you want to install dependencies with npm now? \
  **Yes**
* What do you want to use as your public directory? \
  **build**
* Configure as a single-page app (rewrite all urls to /index.html)? \
  **Yes**
* Set up automatic builds and deploys with GitHub? \
  **Yes**
* For which GitHub repository would you like to set up a GitHub workflow? (format: user/repository) \
  [_WRITE YOUR OWN REPO_]
* Set up the workflow to run a build script before every deploy? \
  **Yes**
* What script should be run before every deploy? \
  **yarn build**
* Set up automatic deployment to your site's live channel when a PR is merged? \
  **Yes**
* What is the name of the GitHub branch associated with your site's live channel? \
  **master**
  
_If you have an organization repository issue check below:_
https://github.com/FirebaseExtended/action-hosting-deploy/issues/40
  
 * What file should be used for Storage Rules? \
   **storage.rules**
 * File storage.rules already exists. Overwrite? \
   **No**
 * Check all emulators
 * Would you like to download the emulators now? \
   **Yes**

Go to __firebase console__ > _Authentication_ > 
_Sign-in method_,  enable the **Email/Password**

Go to __firebase console__ > __Project Settings__\
under the **Your apps** section, 
_Add Firebase to your web app_ with _Firebase Hosting_

Copy your **Config** from **SDK setup and configuration** and paste to "**src/rest/firebase/config.json**"

Finally,

```
firebase deploy:all
```


You can start to development, 
```
yarn dev
```
