module.exports = (connection, DataTypes) => {
  const Enrollment = connection.define('enrollments', {
    date_of_enrollment:{
      type: DataTypes.DATE,
    }
  },{
      timestamps: false,
      underscored: true
    }
  )
  return Enrollment
}
