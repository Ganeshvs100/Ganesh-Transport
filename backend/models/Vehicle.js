import { DataTypes } from 'sequelize';

export default function defineVehicle(sequelize) {
  return sequelize.define('Vehicle', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    registration: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    insuranceExpiry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    insuranceFormatted: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fitnessExpiry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fitnessFormatted: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isInsuranceAlert: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isFitnessAlert: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isLoan: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    loanBank: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    loanTotal: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    loanEmi: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    loanEmiDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    loanEndDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    permitExpiry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    permitFormatted: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pucExpiry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pucFormatted: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    driverName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    driverPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
}
