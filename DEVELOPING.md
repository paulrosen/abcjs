## Development dependencies ##

Download and install [Node.js](http://nodejs.org/). It should also automatically
install `npm` and set it to the `PATH`.

Then run this to download other dependencies.
````bash
npm install
````

## Build and develop ##

Simply run this command to build the abcjs to `dist/abc.js` and 
`dist/abc-min.js` :

````bash
npm run build
````

In development, you can run this command instead to launch a live-server
that continuously rebuild and refresh any times a file has been modified :

````bash
npm start
````


## Run test ##

### In browser ###

Run this to launch a server to continuously run test in the browser :

````bash
npm run start:test
````

### In command line ###

````bash
npm test
````

This will show the test result directly in the command line interface.

To generate a coverage report in the `coverage/lcov-report/` folder, run :

````bash
npm run coverage
````
