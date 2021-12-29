const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Videos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Videos.init(
    {
      userId: DataTypes.STRING,
      fileName: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Videos'
    }
  );
  return Videos;
};
