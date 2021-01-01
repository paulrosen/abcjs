#!/bin/sh
die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "Call with a version number argument in the form x.y.z[-beta.n]"
echo $1 | grep -E -q '^[1-9]+\.[0-9]+\.[0-9]+(-beta\.[0-9]+)?$' || die "Version number argument required (x.y.z[-beta.n]), $1 provided"

cp ./dist/abcjs-basic.js ./bin/abcjs_basic_$1.js
cp ./dist/abcjs-basic-min.js ./bin/abcjs_basic_$1-min.js
cp ./dist/abcjs-plugin-min.js ./bin/abcjs_plugin_$1-min.js
