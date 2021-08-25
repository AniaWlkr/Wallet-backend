const { Transaction } = require('../model');

const addTrans = (ownerId, body) => {
  return Transaction.create(ownerId, body);
};

const getAllTrans = (
  ownerId,
  {
    page = 1,
    limit = 5,
    sortBy = 'date',
    transType = null,
    month = null,
    year = null,
  },
) => {
  let query = { owner: ownerId };
  if (transType) query = { ...query, transType: `${transType}` };
  if (month) query = { ...query, month: `${month}` };
  if (year) query = { ...query, year: `${year}` };

  return Transaction.paginate(query, {
    page,
    limit,
    sort: { [`${sortBy}`]: -1 },
    populate: [
      {
        path: 'categoryId',
        select: 'categoryName',
      },
      {
        path: 'owner',
        select: ['name', 'email'],
      },
    ],
  });
};

const getTransById = async (ownerId, transId) => {
  try {
    return await Transaction.findOne({
      _id: transId,
      owner: ownerId,
    }).populate([
      {
        path: 'categoryId',
        select: 'categoryName',
      },
      {
        path: 'owner',
        select: ['name', 'email'],
      },
    ]);
  } catch (error) {
    if (error.message.includes('Cast to ObjectId failed')) {
      return null;
    }
    throw error;
  }
};

const updateTransaction = (ownerId, transId, newData) => {
  return Transaction.findByIdAndUpdate(
    { _id: transId, owner: ownerId },
    { ...newData },
    {
      new: true,
    },
  );
};

const deleteTransaction = (ownerId, transId) => {
  return Transaction.findByIdAndDelete({ _id: transId, owner: ownerId });
};

module.exports = {
  addTrans,
  getAllTrans,
  getTransById,
  updateTransaction,
  deleteTransaction,
};
