import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl : 'https://canteen.rdias.ac.in:444/api', // 252 //10 SERVER LIVE
  imageUrl : 'https://canteen.rdias.ac.in:444/files/', // 252 //10 SERVER LIVE
  _apiLoginUrl: 'http://eshaala.rdias.ac.in:89/API', //development
  apiLoginUrl:'https://canapi.rdias.ac.in:444/API' // http://eshaala.rdias.ac.in:86/API  Live//https://canapi.rdias.ac.in:444/
};
