import moment from 'moment';
import cookie from 'react-cookie';
import { browserHistory } from 'react-router';
var request = require('request-promise-native');
const BASE_URL = 'http://localhost:3000/';



export function loadPatterns() {
  return request({
    uri : BASE_URL+'patterns',
    method: 'GET',
    json : true
  });
}
