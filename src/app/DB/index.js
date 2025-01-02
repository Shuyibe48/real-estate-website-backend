import config from '../config/index.js';
import USER_ROLE from '../modules/User/user.constant.js';
import { User } from '../modules/User/user.model.js';

const superUser = {
  id: 'SA-0001',
  email: 'shuyibesiddikif@gmail.com',
  password: config.super_admin_password,
  role: USER_ROLE.superAdmin,
  status: 'in-progress',
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  //when database is connected, we will check is there any user who is super admin
  const isSuperAdminExits = await User.findOne({ role: USER_ROLE.superAdmin });

  if (!isSuperAdminExits) {
    await User.create(superUser);
  }
};

export default seedSuperAdmin;