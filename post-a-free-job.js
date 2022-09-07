// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
// `context` is automatically populated with HTTP request data
// you can modify `context.params` test data via [Payload] below
const companyCollectionId = '6299d6392663856bc2f0568a';
const jobPostCollectionId = '6299d63926638511b6f05676';
let message = context.params;

let fetchedData = context.params.event.data;
let companyCreated;
let jobPostCreated;
let timeZoneArray = [];
let companyExistInCMS = false;
let salary;
console.log(fetchedData);
if (fetchedData['Job Salary'].length < 2) {
  salary = '';
} else {
  salary = '$' + fetchedData['Job Salary'] + ' USD';
}

const makeid = (length) => {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const jobTypes = {
  full: 'c0dd888f4cd03ba945520c799657f9a7',
  part: '672d5fa6c321fc864cfd815bddabd4c4',
};
const remoteStatus = {
  yes: '6340bf99aa99f016c8e83f58f9fd406f',
  no: '936c1fd466106f1366c0a4cf2000b655',
};
const category = {
  development: '6299d6392663851fa4f056fe',
  marketing: '6299d639266385cdb7f05701',
  support: '6299d6392663857fc1f05703',
  'business-development': '6304f722907a4ffc0e44d01a',
  'finance-legal': '6304f731ba0ce449f72c632d',
  'management': '6304f4eb3c9402eca690ad0c',
  'hr-recruiting': '6307a1345394f2ca1fba72e0',
  'design-creative': '6304f48b7c43212ff1a68e20',
};
const timeZones = {
  'anywhere-in-the-world': '6299d639266385006ef056fa',
  usa: '6299d6392663854931f056f9',
  europe: '6299d6392663857904f056f8',
  сanada: '6299d63926638539dbf056f7',
  asia: '62b08c93e78f9ce631a77bc5',
  australia: '62b08cacd1cd09c652f2db8d',
  'latin-america': '62b08cbd1036bfbceecbf614',
  'middle-east': '62c5b8afd59dce0af20caeaf',
};
const webflowRadioData = {
  jobType: null,
  remote: null,
};
function parseJobDataFromWF() {
  if (fetchedData['Job type'] === 'part-time') {
    webflowRadioData.jobType = jobTypes.part;
  } else if (fetchedData['Job type'] === 'full-time') {
    webflowRadioData.jobType = jobTypes.full;
  }

  if (fetchedData['Remote'] === 'yes') {
    webflowRadioData.remote = remoteStatus.yes;
  } else if (fetchedData['Remote'] === 'no') {
    webflowRadioData.remote = remoteStatus.no;
  }
}

function updateTimeZoneArray() {
  if (fetchedData['Time Zone Anywhere In The World'] === 'true' || (fetchedData['Time Zone Anywhere In The World'] && fetchedData['Time Zone Anywhere In The World'] != 'false')) {
    timeZoneArray = [...timeZoneArray, timeZones['anywhere-in-the-world']];
  }
  if (fetchedData['Time Zone Usa'] === 'true' || (fetchedData['Time Zone Usa'] && fetchedData['Time Zone Usa'] != 'false')) {
    timeZoneArray = [...timeZoneArray, timeZones['usa']];
  }
  if (fetchedData['Time Zone Europe'] === 'true' || (fetchedData['Time Zone Europe'] && fetchedData['Time Zone Europe'] != 'false')) {
    timeZoneArray = [...timeZoneArray, timeZones['europe']];
  }
  if (fetchedData['Time Zone Canada'] === 'true' || (fetchedData['Time Zone Canada'] && fetchedData['Time Zone Canada'] != 'false')) {
    timeZoneArray = [...timeZoneArray, timeZones['сanada']];
  }
  if (fetchedData['Time Zone Asia'] === 'true' || (fetchedData['Time Zone Asia'] && fetchedData['Time Zone Asia'] != 'false')) {
    timeZoneArray = [...timeZoneArray, timeZones['asia']];
  }
  if (fetchedData['Time Zone Australia'] === 'true' || (fetchedData['Time Zone Australia'] && fetchedData['Time Zone Australia'] != 'false')) {
    timeZoneArray = [...timeZoneArray, timeZones['australia']];
  }
  if (fetchedData['Time Zone Latin America'] === 'true' || (fetchedData['Time Zone Latin America'] && fetchedData['Time Zone Latin America'] != 'false')) {
    timeZoneArray = [...timeZoneArray, timeZones['latin-america']];
  }
  if (fetchedData['Time Zone Middle East'] === 'true' || (fetchedData['Time Zone Middle East'] && fetchedData['Time Zone Middle East'] != 'false')) {
    timeZoneArray = [...timeZoneArray, timeZones['middle-east']];
  }
}

// get all companies in webflow cms
// let webflowCompaniesItems = lib.webflow.collections['@1.0.0'].items.list({
// collection_id: companyCollectionId, // required
// });
// let allCollectionItems = await webflowCompaniesItems;

// check if company exist in webflow cms
// allCollectionItems.items.forEach((item) => {
// if (item.name === fetchedData['Company Name']) {
// console.log('company exist in cms');
// companyExistInCMS = true;
// }
// });

// if collection data exist - create webflow cms item (company)
if (fetchedData) {
  let slug = fetchedData['Company Name']
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
  const rndInt = Math.floor(Math.random() * 100) + 100;
  let uniqeID = makeid(21);
  companyCreated = lib.webflow.collections['@1.0.0'].items.create({
    collection_id: companyCollectionId, // required
    fields: {
      _archived: false,
      _draft: true,
      slug: `${rndInt}-${slug}`,
      name: fetchedData['Company Name'],
      'company-website-link': fetchedData['Company Website'],
      'company-linkedin-link': fetchedData['Linkedin Page'],
      'company-about': fetchedData['Company Description'],
      'company-logo-isotype': {
        fileId: uniqeID,
        url: fetchedData['logo url'],
        alt: null,
      },
      'company-perks-benefits-left-column':
        fetchedData['Company perks and benefits'],
      moderated: false,
    },
    live: true,
  });
}

// get company id
const companyId = await companyCreated;

// if collection data exist - create webflow cms item (job post)
if (fetchedData) {
  // get company name and job title to convert it intro slug
  const slugCompany = fetchedData['Company Name']
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
  const slugJobPost = fetchedData['Job Title']
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');

  // call all nedded functions
  parseJobDataFromWF();
  updateTimeZoneArray();
  //create job post
  let jobCategory = fetchedData['Job category'];
  jobPostCreated = lib.webflow.collections['@1.0.0'].items.create({
    collection_id: jobPostCollectionId, // required
    fields: {
      _archived: false,
      _draft: true,
      slug: `${slugCompany}-${slugJobPost}`,
      name: fetchedData['Job Title'],
      remote: webflowRadioData.remote,
      'job-type': webflowRadioData.jobType,
      'job-description': fetchedData['Job Description'],
      'job-salary': salary,
      'job-company': companyId['_id'],
      'job-department': category[jobCategory],
      'job-application-link': fetchedData['Company Website'],
      'show-salary': fetchedData['Show Salary'],
      'time-zone-2': timeZoneArray,
      'job-post-owner-email': fetchedData['Email'],
      moderated: false,
    },
    live: true,
  });
}

console.log(`companyCreated`, await companyCreated);
console.log(`jobPostCreated`, await jobPostCreated);

// endpoints are executed as functions, click [> Run] below to test
return true;
