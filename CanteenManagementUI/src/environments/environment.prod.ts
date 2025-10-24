import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl : 'http://192.168.0.252:5001/api',
  imageUrl : 'http://192.168.0.252:5001/files/',
  apiLoginUrl: 'http://eshaala.rdias.ac.in:89/API',
  _apiLoginUrl:'http://eshaala.rdias.ac.in:86/API'
};
