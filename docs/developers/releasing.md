## Releasing

::: danger Important!
Note: The following checklist is for committers only! 

For people who want to contribute a pull request, this isn't relevant!
:::

::: tip Branch
All new work should be done in the `dev` branch.
:::

To begin a new version:

[_] Switch to the `dev` branch and do all new work there.

[_] Find any hardcoded version numbers in [the package file](../package.json) and change them. 

[_] Minify the various library versions with `npm run build` just to get the next version's examples set up.

[_] Add the new files: `git add bin/abcjs*_x.x.x*`.

To release a new version, this checklist should be followed:

[_] Get all commits since the last release with `git log > temp.txt`.

[_] Add a section to the top of [the release notes](../RELEASE.md).

[_] Be sure [the read me file](../README.md) is up to date, along with all the files in [docs](../docs).

[_] Minify the various library versions with `npm run build`.

[_] Check the minified versions and other changed files in.

[_] Merge the `dev` branch into `master`. 

[_] Update npm with `npm publish` or `npm publish --tag beta`.
    To do this in docker:
    `docker run -v $(pwd):/srv/app -it abcjs /bin/bash`
     `npm login`

[_] Run `npm install` and check it in.

[_] Push the change that npm publish created with `git push`.

[_] Push new documentation with `./deploy-docs.sh`.

[_] On github, "Draft a new release".
* Click "releases".
* Click "draft a new release"
* The tag should be the release number (i.e. "3.0.0")
* The title should be "Version 3.0.0 release"
* The description should be a couple sentences about what the release is.

[_] Read through all the issues to see if any should be closed.

[_] Update https://abcjs.net and the examples on github.

[_] Release a new version of the [WordPress plugin](https://wordpress.org/plugins/abc-notation/).

