const { UsersRepository } = require('../repository');

const { createTokens, getIdUser } = require('../helpers/token');

class AuthService {
  constructor() {
    this.repositories = {
      users: new UsersRepository(),
    };
  }

  async login({ email, password }) {
    const user = await this.repositories.users.findByEmail(email);
    if (!user || !user.validPassword(password)) return null;
    if (!user.verify) return { verifyMessage: 'Please verify your email' };

    const id = user._id;

    const newTokens = createTokens(id);

    await this.repositories.users.updateTokens(id, newTokens);

    const data = await this.repositories.users.findById(id);

    const result = {
      accessToken: data.accessToken,
      accessTokenExpireAt: data.accessTokenExpireAt,
      refreshToken: data.refreshToken,
      user: { name: data.name, email: data.email },
      message: 'Authentication successful',
    };
    return result;
  }

  async logout(id) {
    const data = await this.repositories.users.updateTokens(id, {
      accessToken: null,
      refreshToken: null,
    });
    return data;
  }

  async updateTokens(accessToken, refreshToken) {
    const id = await getIdUser(accessToken, refreshToken);
    if (!id) return null;
    const user = await this.repositories.users.findById(id);
    if (!user) return null;
    const newTokens = createTokens(id);
    await this.repositories.users.updateTokens(id, newTokens);
    const updatedUser = await this.repositories.users.findById(id);
    if (!updatedUser) return null;

    const result = {
      accessToken: updatedUser.accessToken,
      refreshToken: updatedUser.refreshToken,
      message: 'Tokens updated successful',
    };
    return result;
  }
}

module.exports = new AuthService();
