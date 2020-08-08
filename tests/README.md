# Automated Tests

## Mocha

Currently there are two sets of mocha tests.

Either:

Run with:
```shell script
npm run test
```

this will pass all `.js` files to mocha.

or

To run browser based tests, load the `.html` file into the browser. That will run
all of the tests associated with that file. To run just some of the tests, use the query parameter:
This will most like need a server to serve the `.html` files to solve CORS issues.
```
?grep=test-name
```
where `test-name` is any part of the test name. All the tests that match will be run.
