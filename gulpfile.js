const { src, dest } = require('gulp');
const xml2js = require('xml2js');
const fs = require('fs/promises');

// devtools front_end 产物地址
const DevtoolsFrontendGenPath =
  'devtools/devtools-frontend/out/Default/gen/front_end/';

exports['copy:devtools:dev'] = function () {
  return src(
    transDevtoolsSrc([
      '**/*.{js,html,json,svg,png}',
      '!legacy_test_runner/**/*',
    ])
  ).pipe(dest('public/front_end'));
};

exports['copy:devtools:release'] = async function () {
  return src(transDevtoolsSrc(await readDevtoolFrontendReleaseFiles()), {
    base: DevtoolsFrontendGenPath,
  }).pipe(dest('public/front_end'));
};

async function readDevtoolFrontendReleaseFiles() {
  const xml = await fs.readFile(
    transDevtoolsSrc(['devtools_resources.grd'])[0],
    { encoding: 'utf8' }
  );
  const result = await xml2js.parseStringPromise(xml);
  const includes = result.grit.release[0].includes[0].include;

  return includes
    .map(include => {
      return include.$.file.replace('.compressed', '');
    })
    .slice(1); // 不需要 include[0]
}

/**
 * 转换 devtools 产物地址
 */
function transDevtoolsSrc(paths) {
  return paths.map(p => {
    if (p.startsWith('!')) {
      return `!${DevtoolsFrontendGenPath}${p.slice(1)}`;
    }
    return `${DevtoolsFrontendGenPath}${p}`;
  });
}
