#!/bin/sh
die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "Call with a version number argument in the form x.y.z[-beta.n]"

# switch to dev branch.
git checkout dev

# change version number in package.json and version.js.
perl -pi -e "s/\'([^\']+)\'/\'$1\'/" version.js
perl -pi -e "s/\"version\": \"([^\"]+)\"/\"version\": \"$1\"/" package.json

# build so dist has the right version numbers.
CMD="install" docker-compose up
CMD="run build" docker-compose up
#### If not running under Docker, do this instead:
# npm install
# npm run build
