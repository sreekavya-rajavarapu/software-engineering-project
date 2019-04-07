module.exports = (connection, DataTypes) => {
  const Project = connection.define('projects', {
    title: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    composition: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: false,
    underscored: true
  });
  return Project;
};
