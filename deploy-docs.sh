# Get the examples somewhere they can be served
cp -r examples docs/.vuepress/dist/examples
cp -r dist docs/.vuepress/dist/dist
cp abcjs-audio.css docs/.vuepress/dist

# navigate into the build output directory
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:paulrosen/abcjs.git master:gh-pages

cd -
