const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        avatar: {
            type: DataTypes.STRING,
            defaultValue: 'https://lh3.googleusercontent.com/thOkmLyKjAwUokqa1MrZrPcW82nzYEZYELuAdm8NAYrk_V7k_cETzO7UN2v8fffF6VwBpyEL0M1_a3hIdEY4YdQXu-jGLp-QzDff'
        },
        cover: {
            type: DataTypes.STRING
        },
        bio: {
            type: DataTypes.STRING
        },
        location: {
            type: DataTypes.STRING
        },
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    });
};
