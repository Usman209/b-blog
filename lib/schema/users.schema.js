const mongoose = require("mongoose");
const { Schema } = mongoose;
const { EUserRole, UserGender } = require("../../lib/utils/enum");

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, trim: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: [EUserRole], default: EUserRole.USER },
    gender: { type: String, enum: [UserGender] },
    bio: { type: String },
    profileImg: { type: String },
    lastLogin: { type: Date },
    emailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, // ✅ added field
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", UserSchema);
