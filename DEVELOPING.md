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

Run this to build the tests files : 
````bash
npm run build:test
````

Or this command to continuously rebuild at any changes :
````bash
npm run serve:test
````

Then open your browser to `test/index.html` to see the results and debug the
errors.

### In command line ###

````bash
npm run test
````

This will show the test result directly in the command line interface.

To generate a coverage report in the `coverage/lcov-report/` folder, run :

````bash
npm run coverage
````
