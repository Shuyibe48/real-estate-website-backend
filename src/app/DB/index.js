// import config from "../config/index.js";
// import { SuperAdmin } from "../modules/admin/admin.model.js";
// import USER_ROLE from "../modules/User/user.constant.js";
// import { User } from "../modules/User/user.model.js";

// const superUser = {
//   id: "SA-0001",
//   email: "shuyibesiddikif@gmail.com",
//   password: config.super_admin_password,
//   role: USER_ROLE.superAdmin,
//   status: "in-progress",
//   isDeleted: false,
// };

// const seedSuperAdmin = async () => {
//   //when database is connected, we will check is there any user who is super admin
//   const isSuperAdminExits = await User.findOne({ role: USER_ROLE.superAdmin });
//   if (!isSuperAdminExits) {
//     const newUser = await User.create(superUser);
//     const data = {
//       id: newUser.id,
//       userId: newUser._id,
//     };
//     const superAdmin = await SuperAdmin.create(data);
//   }
// };

// export default seedSuperAdmin;


import mongoose from "mongoose";
import config from "../config/index.js";
import { SuperAdmin } from "../modules/admin/admin.model.js";
import USER_ROLE from "../modules/User/user.constant.js";
import { User } from "../modules/User/user.model.js";

const superUser = {
  id: "SA-0001",
  email: "shuyibesiddikif@gmail.com",
  password: config.super_admin_password,
  role: USER_ROLE.superAdmin,
  status: "in-progress",
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if super admin already exists
    const isSuperAdminExists = await User.findOne({ role: USER_ROLE.superAdmin }).session(session);

    if (!isSuperAdminExists) {
      // Create new user
      const newUser = await User.create([superUser], { session });

      // Create new super admin
      const data = {
        id: newUser[0].id,
        userId: newUser[0]._id,
      };
      await SuperAdmin.create([data], { session });
    }

    // Commit the transaction
    await session.commitTransaction();
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    throw error;
  } finally {
    // End the session
    session.endSession();
  }
};

export default seedSuperAdmin;

