import path from 'path';
import fs from 'fs';
import nock from 'nock';

export default function Recorder(name, { dirPath = path.resolve('./tests'), dirName = 'fixtures' } = {}) {
  const fixturesDir = path.join(dirPath, dirName);
  const fixturesFile = path.join(fixturesDir, `${name}.js`);
  const shouldRecord = !!process.env.NOCK_RECORD || !importFixtures(fixturesFile);
  return {
    before() {
      if (shouldRecord) {
        nock.recorder.rec({
          dont_print: true
        });
      }
    },
    after(done) {
      if (shouldRecord) {
        exportFixtures(fixturesFile, done);
      } else {
        done();
      }
    }
  };

  function exportFixtures(file, done) {
    const fixtures = nock.recorder.play();
    const text = fixtures.length > 0 ? `import nock from 'nock';\n${fixtures.join(';\n')}` : '';
    nock.recorder.clear();
    fs.mkdir(fixturesDir, (e) => {
      if (!e || (e && e.code === 'EEXIST')) {
        fs.writeFile(file, text, done);
      } else {
        done();
      }
    });
  }
  function importFixtures(file) {
    try {
      /* eslint-disable-next-line */
      require(file);
      return true;
    } catch (e) {
      return false;
    }
  }
}
