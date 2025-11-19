import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl : 'http://192.168.0.252:5001/api', // 252 Locl Server(http://192.168.0.252:5001/api)//10 SERVER LIVE(eshaala.domain.rdias.ac.in:5001)
  imageUrl : 'http://192.168.0.252:5001/files/', // 252 Locl Server(http://192.168.0.252:5001/files/)//10 SERVER LIVE(eshaala.domain.rdias.ac.in:5001)
  apiLoginUrl: 'http://eshaala.rdias.ac.in:89/API',
  _apiLoginUrl:'http://eshaala.rdias.ac.in:86/API'
};
