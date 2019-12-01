## Releasing

::: danger Important!
Note: The following checklist is for committers only! 

For people who want to contribute a pull request, this isn't relevant!
:::

To release a new version, this checklist should be followed:

[_] Add a section to the top of [the release notes](../RELEASE.md).

[_] Be sure [the read me file](../README.md) is up to date, along with all the files in [docs](../docs).

[_] Find any hardcoded version numbers in [the package file](../package.json) and change them.

[_] Minify the various library versions with `npm run build`.

[_] Add the new files: `git add bin/abcjs*_x.x.x*`.

[_] IMPORTANT! Change the version number (probably line 3) in `package.json` BACK to the old version. (It will be changed automatically by the npm step.)

[_] Check the minified versions and other changed files in.

[_] Change the version in [the package file](../package.json) with `npm version patch` <-- or `minor`, or `major`.

[_] Update npm with `npm publish`.

[_] Push the change that npm publish created with `git push`.

[_] Push new documentation with `./deploy-docs.sh`.

[_] On github, "Draft a new release".
* Click "releases".
* Click "draft a new release"
* The tag should be the release number (i.e. "3.0.0")
* The title should be "Version 3.0.0 release"
* The description should be a couple sentences about what the release is.

[_] Read through all the issues to see if any should be closed.

[_] Update the [configurator](https://github.com/paulrosen/abcjs-configurator) and deploy it.

[_] Update https://abcjs.net and the examples on github.

[_] Also release a new version of the [WordPress plugin](https://wordpress.org/plugins/abc-notation/).

