

module.exports = (sequelize, DataTypes) => {
    const roles = sequelize.define(
        "roles", {
            uuid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            role_code: {
                type: DataTypes.STRING,
                allowNull: true
            },
            role_name: {
                type: DataTypes.STRING(255)
            },
            role_description: {
                type: DataTypes.STRING(255)
            },
            active_from: {
                type: DataTypes.DATE
            },
            active_to: {
                type: DataTypes.DATE
            },
            activity_uuid: {
                type: DataTypes.INTEGER,
                allowNull: false,

            },
          
            revision: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            modified_by: {
                type: DataTypes.INTEGER,
                // allowNull: true
            },
        }, {
            createdAt: 'created_date',
            updatedAt: 'modified_date',
            tableName: "roles",
            indexes: [{
                fields: ["uuid"]
            }]
        }
    );

 
    return roles;
};