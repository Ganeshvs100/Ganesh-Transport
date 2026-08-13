import { DataTypes } from 'sequelize';

export default function defineTrip(sequelize) {
  return sequelize.define('Trip', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    tripCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    deliveredTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastUpdated: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eta: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alert: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
}
