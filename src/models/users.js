const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const userSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    age: { type: Number, min: 0, default: null },

    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'user', 'premium'],
      default: 'user',
    },
    platform: {
      type: String,
      enum: ['github', 'direct'],
      default: 'direct',
    },
    cart: {
      type: Schema.Types.ObjectId,
      ref: 'Cart',
    },
    documents: [
      {
        name: String,
        reference: String,
        mimetype: String,
        fieldname: {
          type: String,
          enum: ['identification', 'proofOfAddress', 'proofOfAccountStatus', 'document'],
          default: 'document',
        },
      },
    ],
    last_connection: {
      type: Date,
      default: Date.now,
    },
    token: String,
    documents_status: {
      type: String,
      enum: ['pending', 'upload'],
      default: 'pending',
    },
    premium_documents_status: {
      type: String,
      enum: ['pending', 'upload'],
      default: 'pending',
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    collection: 'users',
    timestamps: true,
  }
);
userSchema.plugin(mongoosePaginate);
const User = model('User', userSchema);
module.exports = {
  User,
};
