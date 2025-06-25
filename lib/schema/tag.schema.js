const TagSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Tag", TagSchema);
