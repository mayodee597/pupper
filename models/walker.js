// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
const bcrypt = require("bcryptjs");

// Creating our Walker model
module.exports = function (sequelize, DataTypes) {
const Walker = sequelize.define("Walker", {

    // The email cannot be null, and must be a proper email before creation

    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    zipcode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    dogSize: {
      type: DataTypes.STRING,
      allowNull: true
    }

  });

  Walker.associate = function (models) {
    // Associating Walker with Owner

    Walker.belongsTo(models.Owner, {

    });
  };
  
  // Creating a custom method for our Walker model. This will check if an unhashed password entered by the Walker can be compared to the hashed password stored in our database
  Walker.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  // Hooks are automatic methods that run during various phases of the Walker Model lifecycle
  // In this case, before a Walker is created, we will automatically hash their password
  Walker.addHook("beforeCreate", walker => {
    walker.password = bcrypt.hashSync(
      walker.password,
      bcrypt.genSaltSync(10),
      null
    );
  });
  return Walker;
};
