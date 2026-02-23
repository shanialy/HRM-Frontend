import { postRequest } from "./api";

export const createEmployee = (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  designation: string;
  department: string;
  userType: string;
  salary: number;
  targetAmount?: number;
}) => {
  return postRequest("employee/createEmployee", data);
};
