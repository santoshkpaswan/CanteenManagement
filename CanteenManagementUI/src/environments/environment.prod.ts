import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl : 'https://canteen.rdias.ac.in:444/api', // Locl Server //  apiUrl : 'http://192.168.0.252:5001/api',  // LIVE SERVER // https://canteen.rdias.ac.in:444/api
  imageUrl : 'https://canteen.rdias.ac.in:444/files/', // Locl Server // imageUrl : 'http://192.168.0.252:5001/files/',  // LIVE SERVER // https://canteen.rdias.ac.in:444/files/
  _apiLoginUrl: 'http://eshaala.rdias.ac.in:89/API', //development
  apiLoginUrl:'https://canapi.rdias.ac.in:444/API' // http://eshaala.rdias.ac.in:86/API  Live//https://canapi.rdias.ac.in:444/
};


