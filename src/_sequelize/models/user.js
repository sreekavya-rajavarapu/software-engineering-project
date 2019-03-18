module.exports = (connection, DataTypes) => {
  const User = connection.define('users', {
    csuid: {
      type: DataTypes.STRING,
      unique: true
    },
    user_type: {
      type: DataTypes.STRING,
      defaultValue: 'student'
    },
    fname: {
      type: DataTypes.STRING
    },
    lname: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    major_1: {
      type: DataTypes.STRING,
    },
    major_2: {
      type: DataTypes.STRING,
    }
  },
  {
    timestamps: false,
    underscored: true
  });
  return User;
};
