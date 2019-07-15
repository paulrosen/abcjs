#!/bin/sh
die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "Call with a version number argument in the form x.y.z"
echo $1 | grep -E -q '^[1-9]\.[0-9]+\.[0-9ab]+$' || die "Version number argument required (x.y.z), $1 provided"

echo "Fix build files..."
perl -pi -e "s/ v5([^\"]+)/ v$1/" *.js
perl -pi -e "s/\'([^\']+)\'/\'$1\'/" version.js


echo "Fix readme..."
perl -pi -e "s/abcjs_(.+)_5([^-]+)-min.js/abcjs_\$1_$1-min.js/" README.md
perl -pi -e "s/abcjs_(.+)_5([^-]+).user.js/abcjs_\$1_$1.user.js/" README.md
perl -pi -e "s/abcjs_(.+)_5([^-]+)-min.js/abcjs_\$1_$1-min.js/" docs/*.md
perl -pi -e "s/abcjs_(.+)_5([^-]+).user.js/abcjs_\$1_$1.user.js/" docs/*.md

echo "Fix examples..."
perl -pi -e "s/abcjs_(.+)_5([^-]+)-min.js/abcjs_\$1_$1-min.js/" examples/*.html
perl -pi -e "s/abcjs_(.+)_5([^-]+)-min.js/abcjs_\$1_$1-min.js/" examples/plugin/*.html
