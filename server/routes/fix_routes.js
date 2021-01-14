// eslint-disable
// TODO: disable it when https://github.com/lukeautry/tsoa/issues/839 is merged
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/routes.ts');
const routeFile = fs.readFileSync(filePath).toString();
const findIndexIssue = routeFile.indexOf('function authenticateMiddleware');
const findLastIndexIssue = (() => {
  let countS = -1;
  for (let i = findIndexIssue; i < routeFile.length; i++) {
    if (routeFile[i] === '{') {
      countS = countS === -1 ? 1 : countS + 1;
    }
    if (routeFile[i] === '}') {
      countS = countS - 1;
      if (countS === 0) {
        return i + 1;
      }
    }
  }
  return routeFile.length;
})();
const replaceBy = `
  function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
    return (request: any, _response: any, next: any) =>
      new Promise((resolve, reject) => {
        const promises: Promise<any>[] = [];
        for (const secMethod of security) {
          for (const name in secMethod) {
            promises.push(expressAuthentication(request, name, secMethod[name]));
          }
        }
        Promise.all(promises)
          .then(resolve)
          .catch(reject);
      }).then((results: any) => {
        request['user'] = results.shift();
        next();
      }).catch((error) => {
        error.status = error.status || 401;
        next(error)
      });
  }
`;

// const cleanRouteFile =
//   routeFile.substring(0, findIndexIssue) +
//   replaceBy +
//   routeFile.substring(findLastIndexIssue, routeFile.length);
// fs.writeFileSync(filePath, cleanRouteFile);
