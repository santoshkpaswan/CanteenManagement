import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl : 'http://192.168.0.10:5001/api', // 252 //10 SERVER LIVE
  imageUrl : 'http://192.168.0.10:5001/files/', // 252 //10 SERVER LIVE
  _apiLoginUrl: 'http://eshaala.rdias.ac.in:89/API', //development
  apiLoginUrl:'http://eshaala.rdias.ac.in:86/API' //Live
};
