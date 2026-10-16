import * as zod from "zod";
export const RegisterSchema = zod
  .object({
    name: zod
      .string()
      .nonempty("name is requerd")
      .min(3, "min length is 3")
      .max(20, "min length is 10"),
    email: zod
      .email()
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "invalid email",
      ),
    dateOfBirth: zod
      .string()
      .nonempty("date is requerd")
      .refine((datavalue) => {
        const userdate = new Date(datavalue).getFullYear();
        const nowDate = new Date().getFullYear();
        return nowDate - userdate > 10 ? true : false;
      }, "Date should be less than 2015"),
    gender: zod.enum(["male", "female"]),
    password: zod
      .string()
      .nonempty("password is requerd")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "The password must be >= 8 characters and contain: an uppercase letter + a lowercase letter + a number + a special character from the list above.",
      ),
    rePassword: zod.string().nonempty("rePassword is requerd"),
  })
  .refine(
    ({ password, rePassword }) => {
      return password === rePassword ? true : false;
    },
    { path: ["rePassword"], error: "password and rePassword not the same" },
  );
export type RegisterSchemaType = zod.infer<typeof RegisterSchema>;

export const loginSchema = zod.object({
  email: zod
    .email()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "invalid email"),

  password: zod
    .string()
    .nonempty("password is requerd")
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "The password must be >= 8 characters and contain: an uppercase letter + a lowercase letter + a number + a special character from the list above.",
    ),
});

export type loginSchemaType = zod.infer<typeof loginSchema>;
