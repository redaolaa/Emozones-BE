// * This file is responsible for defining your own model (type) for your data (movie)

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import mongooseHidden from "mongoose-hidden";
// Stretch: use mongoose-unique-validator to ensure uniqueness across dropped collections

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (email: string) => validator.isEmail(email),
  }, // uses the validator package to check that the email is valid
  password: {
    type: String,
    required: true,
    validate: (password: string) =>
      validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1,
      }),
  },
});

// ! Mongoose lets us run some custom code "pre"-saving to DB
// ? first argument = "save" or "validate" or other mongoose lifecycle (typically save)
// ? second argument = a function with a required argument of next
//                    that you must call at the end.
userSchema.pre("save", function hashPassword(next) {
  // ! "this" variable represents our about-to-be-saved document
  //   in mongoDB
  console.log("user's password", this.password);
  // ! hashSync is a bcrypt function
  // ? first argument is our password we want to hash
  // ? second argument lets you provide a salt
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
  console.log("user's hashed password", this.password);

  // ! calling next() tells mongoose we're done our custom stuff
  next();
});

export function validatePassword(
  plainTextPassword: string,
  hashedPasswordFromDB: string
) {
  return bcrypt.compareSync(plainTextPassword, hashedPasswordFromDB);
}

export function checkPasswords(password: string, passwordConfirmation: string) {
  return password === passwordConfirmation;
}

userSchema.plugin(mongooseHidden({ defaultHidden: { password: true } }));

export default mongoose.model("User", userSchema);
