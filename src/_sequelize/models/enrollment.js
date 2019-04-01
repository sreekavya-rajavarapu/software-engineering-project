module.exports = (connection, DataTypes) => {
  const Enrollment = connection.define('enrollments', {
    date_of_enrollment:{
      type: DataTypes.DATE,
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    project_id:{
      type: DataTypes.INTEGER
    }
  },{
      timestamps: false,
      underscored: true
    }
  )
  return Enrollment
}
