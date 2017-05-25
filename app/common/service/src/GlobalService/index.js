import BaseApiService from '../BaseApiService'

class GlobalService extends BaseApiService {

  MODULE = 'global'

  getUserInfo({ userId }) {
    return this.fetch('getUserInfo', { userId });
  }

  getUserList() {
    return this.fetch('getUserList');
  }
}

export default new GlobalService();
