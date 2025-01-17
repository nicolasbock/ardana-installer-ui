// (c) Copyright 2017-2018 SUSE LLC
/**
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/
import LocalizedStrings from 'react-localization';

var supportedLangs = ['en', 'ja'];
var translationData, bundlename, brandingData, bundlebrandingname, allTranslatedData, catalog = {};

for (var i = 0; i < supportedLangs.length; i++) {
  bundlename = './bundles/' + supportedLangs[i] + '.json';
  //require doesn't interpret this as a string correctly unless its converted
  //easiest conversion is to use + ''
  translationData = require(bundlename + '');

  // for branding
  bundlebrandingname = './bundles/' + supportedLangs[i] + '_branding.json';
  brandingData = require(bundlebrandingname + '');

  // combine branding bundle
  allTranslatedData = Object.assign(translationData, brandingData);
  catalog[supportedLangs[i]] = allTranslatedData;
}

//TODO - determine what to do with annotated langs... like en-US
var strings = new LocalizedStrings(catalog);
for (i = 0; i < window.navigator.languages.length; i++) {
  if (supportedLangs.indexOf(window.navigator.languages[i]) !== -1) {
    strings.setLanguage(window.navigator.languages[i]);
    break;
  }
}

export function translate(key, ...args) {
  // Note!
  // For some bizarre reason, strings.formatString returns an array of strings rather than a single string.
  // The join() corrects this by joining the elements into a single string.
  try {
    return strings.formatString(strings[key], ...args).join('');
  } catch (e) {
    console.error('Unable to translate '+key); // eslint-disable-line no-console
    return key;
  }
}

export function translateModelName(key) {
  // Since it is possible for new model names to be introduced or even modified by the customer,
  // the translation of these names needs to have some human readable fallbacks the situations where
  // there is no pre-existing translation
  try {
    // Note!
    // For some bizarre reason, strings.formatString returns an array of strings rather than a single string.
    // The join() corrects this by joining the elements into a signle string.
    return strings.formatString(strings['model.name.' + key]).join('');
  } catch (e) {
    return key
      .replace(/[-_.]/g, ' ')                            // change _, - and . to space
      .split(' ')                                        // split into words
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))  // capitalize the first letter of each word
      .join(' ');                                        // join elements back together into a single string
  }
}
