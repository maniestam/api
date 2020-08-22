

module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define(
        "users", {
        uuid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
             
        salutation_uuid: {
            type: DataTypes.INTEGER,
        },                            
        
        user_name: {
            type: DataTypes.STRING(255)
        },
        password: {
            type: DataTypes.STRING(255)
        },
         gender_uuid: {
            type: DataTypes.INTEGER
        },       
        employee_code: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(255)
        },
        user_type_uuid: {
            type: DataTypes.INTEGER,
            allowNull: true
        },       
        role_uuid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },  
        verification_string: {
            type: DataTypes.STRING(30)
        },     
      
        mobile1: {
            type: DataTypes.STRING(15)
        },
        mobile2: {
            type: DataTypes.STRING(15)
        },
              
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        },
         created_by: {
            type: DataTypes.INTEGER
        },
        modified_by: {
            type: DataTypes.INTEGER,
            // allowNull: true
        },
        revision: {
            type: DataTypes.INTEGER
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        }
    },
        {
            createdAt: 'created_date',
            updatedAt: 'modified_date',
            tableName: "users",
            indexes: [{
                fields: ["uuid"]
            }]
        }
    );
    users.associate = models => {

        models.users.belongsTo(models.roles, {
            foreignKey: "role_uuid"
        });

        
    };
    return users;
};



