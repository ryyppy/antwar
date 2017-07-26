const _path = require('path');
const _ = require('lodash');
const parseLayout = require('./parse-layout');
const parseIndexPage = require('./parse-index-page');
const parseUrl = require('./parse-url');

module.exports = function parseSectionPages(sectionName, section, modules) {
  const moduleKeys = modules.keys();
  const ret = _.map(
    moduleKeys,
    (name) => {
      const fileName = _.trimStart(name, './') || '';
      const fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
      const layout = parseLayout(section, fileNameWithoutExtension);
      const file = modules(name);

      const nearestSectionName = Object.keys(section.paths || {}).filter(path => (
        fileNameWithoutExtension.startsWith(path)
      )).sort()[0] || sectionName;

      // Render index pages through root
      if (_path.basename(fileNameWithoutExtension).endsWith('index')) {
        return {
          type: 'index',
          fileName,
          file,
          layout,
          section,
          sectionName: nearestSectionName,
          url: nearestSectionName === '/' ?
            '/' :
            `/${fileNameWithoutExtension.split('/index').slice(0, -1).join('')}/`
        };
      }

      return {
        type: 'page',
        fileName,
        file,
        layout,
        section,
        sectionName: nearestSectionName,
        url: parseUrl(section, sectionName, fileNameWithoutExtension)
      };
    }
  );

  // Check for index functions within nested sections
  const checkedSections = {};
  const indexPages = _.map(
    moduleKeys,
    () => {
      const indexPage = parseIndexPage(section, sectionName);

      if (!checkedSections[sectionName] && indexPage) {
        checkedSections[sectionName] = true;

        return {
          type: 'index',
          fileName: '',
          file: indexPage, // Function is an object too - important for title/keyword management.
          layout: indexPage,
          section,
          sectionName,
          url: sectionName === '/' ? '/' : `/${sectionName}/`
        };
      }

      return null;
    }
  ).filter(a => a) || [];

  if (_.isFunction(section.index)) {
    const indexPage = section.index();

    ret.push({
      type: 'index',
      fileName: '',
      file: indexPage, // Function is an object too - important for title/keyword management.
      layout: indexPage,
      section,
      sectionName,
      url: sectionName === '/' ? '/' : `/${sectionName}/`
    });
  }

  return ret.concat(indexPages);
};
