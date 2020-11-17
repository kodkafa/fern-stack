# react-firebase
React Mobx Firebase Boilerplate (ex: https://kodkafa.com)


##Setup

firstly clone the project and build
```
git clone git@github.com:kodkafa/react-firebase.git my-project
cd my-project
yarn install
```

go to https://console.firebase.google.com/ and create a new project.

```
npm install -g firebase-tools
firebase login
firebase init
```
select all features and keep going

!!! DO NOT change rule and config files name and DO NOT overwrite.

choose "JavaScript" for Cloud Functions \
say yes for ESLint \

!!! DO NOT overwrite "package.json"\
!!! DO NOT overwrite "functions/Routing.js"

change "public" directory as "build"

and say "y" for single-page app

go to __firebase console__ > __Settings__\
copy your **Firebase SDK snippet** from Config 
and paste to "src/firebase/config.json"

finally
```
yarn build
firebase deploy
```

you can visit your  "my-project.firebaseapp.com" 

```
 @firebase/database: FIREBASE WARNING: {"code":"app/invalid-credential",
 "message":"Credential implementation provided to initializeApp() via 
 the \"credential\" property failed to fetch a valid Google OAuth2 access token 
 with the following error: \"Error fetching access token: Error while making request: 
 getaddrinfo ENOTFOUND metadata.google.internal. Error code: ENOTFOUND\"."} 
```

