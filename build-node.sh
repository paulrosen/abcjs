# remove the old build
rm -r dist/src/ || true
# copy all the js files over
# first copy all src files, then delete the typescript ones
cp -R src/ dist
find dist/src -name "*.ts" -type f -delete
# do the build, which will insert js files instead of the ts ones
npx tsc
# add the standard license
cp LICENSE.md dist/
# copy the entry point for the test modules
cp test.js dist/
