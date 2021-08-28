const { User } = require('../model');

class UsersRepository {
  constructor() {
    this.model = User;
  }

  async findById(id) {
    const result = await this.model.findById(id);
    return result;
  }

  async findByEmail(email) {
    const result = await this.model.findOne({ email });
    return result;
  }

  async create(body) {
    // eslint-disable-next-line new-cap
    const user = new this.model(body);
    return user.save();
  }

  async updateTokens(id, tokens) {
    await this.model.updateOne({ _id: id }, { ...tokens });
  }

  async updateVerifyToken(verifyToken) {
    return await this.model.findOneAndUpdate(
      { verifyToken },
      { verify: true, verifyToken: null },
    );
  }

  async updateBalance(id, balance) {
    const result = await this.model.updateOne({ _id: id }, { ...balance });
    return result;
  }
}

module.exports = UsersRepository;
