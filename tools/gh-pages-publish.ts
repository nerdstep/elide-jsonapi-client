const { cd, exec, echo, touch } = require('shelljs')
const { readFileSync } = require('fs')
const url = require('url')

const ghToken = process.env.GH_TOKEN

let repoUrl
let pkg = JSON.parse(readFileSync('package.json') as any)

if (!ghToken) {
  throw new Error('GH_TOKEN not defined')
}

if (typeof pkg.repository === 'object') {
  if (!pkg.repository.hasOwnProperty('url')) {
    throw new Error('URL does not exist in repository section')
  }
  repoUrl = pkg.repository.url
} else {
  repoUrl = pkg.repository
}

if (!pkg.author || !pkg.author.name || !pkg.author.email) {
  throw new Error('Name or email does not exist in author section')
}

const parsedUrl = url.parse(repoUrl)
const repository = (parsedUrl.host || '') + (parsedUrl.path || '')

echo('Deploying docs!!!')
cd('docs')
touch('.nojekyll')
exec('git init')
exec('git add .')
exec(`git config user.name "${pkg.author.name}"`)
exec(`git config user.email "${pkg.author.email}"`)
exec('git commit -m "docs(docs): update gh-pages"')
exec(
  `git push --force --quiet "https://${ghToken}@${repository}" master:gh-pages`,
)
echo('Docs deployed!!')
