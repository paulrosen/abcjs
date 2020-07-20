# Automated Tests

## Jest

Run with:
```shell script
npm run test
```

## Mocha

These are browser-based tests. To run, load the `.html` file into the browser. That will run
all of the tests associated with that file. To run just some of the tests, use the query parameter:
```
?grep=test-name
```
where `test-name` is any part of the test name. All the tests that match will be run.
