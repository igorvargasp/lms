import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const emailRegexPattern: RegExp =
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export interface IUser extends Document {
  name: string;
  password: string;
  email: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  comparePasswords: (password: string) => Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please a name is required"] },
    email: {
      type: String,
      required: [true, "Please a email is required"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "please a valid email is required",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please a password is required"],
      minlength: [6, "password mus bet at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// compare password

userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
