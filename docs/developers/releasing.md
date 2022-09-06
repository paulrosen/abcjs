# Releasing

::: danger Important!
Note: The following checklist is for committers only! 

For people who want to contribute a pull request, this isn't relevant!
:::

::: tip Branch
All new work should be done in the `dev` branch.
:::

## To begin a new version:

[_] Run the script `./start-version.sh ${version}`.

[_] Check in the changed files.

## To release a new version, this checklist should be followed:

[_] Get all commits since the last release with `git log > temp.txt`.

[_] Add a section to the top of [the release notes](../RELEASE.md).

[_] Be sure [the read me file](../README.md) is up to date, along with all the files in [docs](../docs).

[_] Create a docker instance with `./docker-start.sh`.

[_] Minify the various library versions with `npm run build`.

[_] Update all personal projects to see if anything breaks.

[_] Check the minified versions and other changed files in.

[_] Merge the `dev` branch into `main`. 

[_] Push the merge to github with `git push`.

[_] Update npm with `npm publish` or `npm publish --tag beta`.
    To do this in docker:
```bash
docker run -v $(pwd):/srv/app -it abcjs /bin/bash
npm login
``` 

[_] Build docs with `npm run docs:build`.

[_] Push the change that npm publish created with `git push`.

[_] Push new documentation with `./deploy-docs.sh`.

[_] On github, "Draft a new release".
* Click "releases".
* Click "draft a new release"
* The tag should be the release number (i.e. "3.0.0")
* The title should be "Version 3.0.0 release"
* The description should be a couple sentences about what the release is.

[_] Add the binary to https://github.com/paulrosen/historical-abcjs-versions.

[_] Read through all the issues to see if any should be closed.

[_] Update https://abcjs.net.

[_] Release a new version of the [WordPress plugin](https://wordpress.org/plugins/abc-notation/).
* Repo at: `svn checkout https://plugins.svn.wordpress.org/abc-notation/`
* Make changes in `/trunk`
* When ready to release, make tag with right-click trunk, subversion => Branch or Tag, then pick "any location" and change the location to `.../tags/x.x.x` with the version number.
* check in all changed files.

[_] Release a new version of the vscode extension.