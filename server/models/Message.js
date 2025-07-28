const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'sender_id'
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'receiver_id'
  },
  conversationId: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'conversation_id'
  },
  messageType: {
    type: DataTypes.ENUM('text', 'image', 'file', 'system'),
    defaultValue: 'text',
    field: 'message_type'
  },
  content: {
    type: DataTypes.TEXT
  },
  fileUrl: {
    type: DataTypes.STRING(255),
    field: 'file_url'
  },
  fileName: {
    type: DataTypes.STRING(255),
    field: 'file_name'
  },
  fileSize: {
    type: DataTypes.INTEGER,
    field: 'file_size'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_read'
  },
  readAt: {
    type: DataTypes.DATE,
    field: 'read_at'
  },
  repliedTo: {
    type: DataTypes.INTEGER,
    field: 'replied_to'
  }
}, {
  tableName: 'messages',
  timestamps: true,
  paranoid: true
});

module.exports = Message;