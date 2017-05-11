import BaseApiService from '../BaseApiService'

class GlobalService extends BaseApiService {

  MODULE = 'global'

  getUserInfo({ userId }) {
    return this.fetch('getUserInfo', { userId });
  }

}

export default new GlobalService();
