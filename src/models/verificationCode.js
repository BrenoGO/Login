module.exports = (sequelize, DataTypes) => {
  const VerificationCode = sequelize.define('Verification_Code', {
    field: DataTypes.STRING,
    code: DataTypes.STRING,
    expiresAt: DataTypes.DATE,
    tries: DataTypes.INTEGER
  }, {})
  return VerificationCode
}
