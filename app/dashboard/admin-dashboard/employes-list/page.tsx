"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/Button";
import {
  getRequest,
  putRequest,
  deleteRequest,
  postRequest,
} from "@/app/services/api";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { AxiosError } from "axios";
import { createEmployee } from "@/app/services/employee.service";

type Employee = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  department?: string;
  designation?: string;
  salary?: number;
  userType?: string;
  targetAmount?: number;
};

export type EmployeeFormValues = {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  phone?: string;
  designation?: string;
  department?: string;
  userType?: string;
  salary?: number;
  targetAmount?: number;
};

const PAGE_SIZE = 5;

// --------- CREATE EMPLOYEE SERVICE ---------
// const createEmployee = (data: {
//   firstName: string;
//   lastName: string;
//   email: string;
//   address: string;
//   phone: string;
//   designation: string;
//   department: string;
//   userType: string;
//   salary: number;
//   targetAmount?: number;
// }) => {
//   return postRequest("employee/employees", data); // URL backend ke hisab se adjust karein
// };

export default function EmployeesListPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState<EmployeeFormValues>({});

  // --------- FETCH EMPLOYEES ---------
  const fetchEmployees = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await getRequest<{
        status: number;
        success: boolean;
        message: string;
        data: { employees: Employee[]; pagination: { totalPages: number } };
      }>(`employee/getAllEmployees?page=${pageNumber}&limit=${PAGE_SIZE}`);
      setEmployees(res.data.data.employees || []);
      setTotalPages(res.data.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(page);
  }, [page]);

  // --------- FILTER ---------
  const displayedEmployees = useMemo(() => {
    if (!search) return employees;
    return employees.filter((emp) =>
      `${emp.firstName ?? ""} ${emp.lastName ?? ""} ${emp.designation ?? ""} ${emp.email ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [employees, search]);

  // --------- VALIDATION ---------
  const employeeValidationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    address: Yup.string().required("Address is required"),
    designation: Yup.string().required("Designation is required"),
    department: Yup.string().required("Department is required"),
    userType: Yup.string().required("User type is required"),
    salary: Yup.number().required("Salary is required").min(0),
    targetAmount: Yup.number().min(0).optional(),
  });

  // --------- DELETE EMPLOYEE ---------
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    try {
      await deleteRequest(`employee/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Delete Error:", error.response?.data || error.message);
      } else {
        console.error("Delete Error:", error);
      }
      alert("Failed to delete employee.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* APP BAR */}
        <div className="relative h-14 flex items-center px-6 bg-gray-900/80 border-b border-white/10">
          <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
            Employees
          </h1>
          <div className="ml-auto flex gap-3">
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded bg-gray-800 border border-white/10"
            />
            <Button
              onClick={() => {
                setForm({});
                setEditId(null);
                setOpen(true);
              }}
            >
              + Add Employee
            </Button>
          </div>
        </div>

        {/* TABLE */}
        <main className="flex-1 p-6 flex flex-col gap-4">
          <div className="bg-gray-900/70 rounded-xl border border-white/10 overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-400">
                Loading employees...
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-800/80 text-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Designation</th>
                    <th className="px-4 py-3 text-left">Department</th>
                    <th className="px-4 py-3 text-left">Salary</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedEmployees.map((emp) => (
                    <tr
                      key={emp._id}
                      className="border-t border-white/10 hover:bg-white/5 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/dashboard/admin-dashboard/employes-list/view-employee-profile/${emp._id}`,
                        )
                      }
                    >
                      <td className="px-4 py-3">{emp.email}</td>
                      <td className="px-4 py-3 font-semibold">
                        {emp.firstName} {emp.lastName}
                      </td>
                      <td className="px-4 py-3">{emp.designation}</td>
                      <td className="px-4 py-3">{emp.department}</td>
                      <td className="px-4 py-3 text-green-400">
                        ${emp.salary}
                      </td>
                      <td className="px-4 py-3 flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setForm(emp);
                            setEditId(emp._id);
                            setOpen(true);
                          }}
                          className="text-blue-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(emp._id);
                          }}
                          className="text-red-400"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-gray-800 rounded"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${page === i + 1 ? "bg-[#EE2737]" : "bg-gray-800"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 bg-gray-800 rounded"
            >
              Next
            </button>
          </div>
        </main>
      </div>

      {/* ADD / EDIT MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
            <Formik<EmployeeFormValues>
              initialValues={{
                firstName: form.firstName ?? "",
                lastName: form.lastName ?? "",
                email: form.email ?? "",
                phone: form.phone ?? "",
                address: form.address ?? "",
                designation: form.designation ?? "",
                department: form.department ?? "",
                userType: form.userType ?? "",
                salary: form.salary ?? 0,
                targetAmount: form.targetAmount ?? 0,
              }}
              validationSchema={employeeValidationSchema}
              enableReinitialize
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  const payload = {
                    firstName: values.firstName?.trim() ?? "",
                    lastName: values.lastName?.trim() ?? "",
                    email: values.email?.trim() ?? "",
                    phone: values.phone?.trim() ?? "",
                    address: values.address?.trim() ?? "",
                    designation: values.designation?.trim() ?? "",
                    department: values.department?.trim() ?? "",
                    userType: values.userType?.trim() ?? "",
                    salary: Number(values.salary ?? 0),
                    targetAmount:
                      values.targetAmount !== undefined
                        ? Number(values.targetAmount)
                        : undefined,
                  };

                  if (editId) {
                    await putRequest(`employee/employees/${editId}`, payload);
                  } else {
                    await createEmployee(payload);
                  }

                  await fetchEmployees(page);
                  resetForm();
                  setEditId(null);
                  setOpen(false);
                } catch (error) {
                  console.error("Employee Save Error:", error);
                  alert("Failed to save employee. Check console for details.");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-3">
                  <Field
                    name="firstName"
                    placeholder="First Name"
                    className="w-full px-4 py-2 bg-gray-800 rounded"
                  />
                  <Field
                    name="lastName"
                    placeholder="Last Name"
                    className="w-full px-4 py-2 bg-gray-800 rounded"
                  />
                  <Field
                    name="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 bg-gray-800 rounded"
                  />
                  <Field
                    name="phone"
                    placeholder="Phone"
                    className="w-full px-4 py-2 bg-gray-800 rounded"
                  />
                  <Field
                    name="address"
                    placeholder="Address"
                    className="w-full px-4 py-2 bg-gray-800 rounded"
                  />
                  <Field
                    name="designation"
                    placeholder="Designation"
                    className="w-full px-4 py-2 bg-gray-800 rounded"
                  />
                  <Field
                    name="department"
                    placeholder="Department"
                    className="w-full px-4 py-2 bg-gray-800 rounded"
                  />
                  <Field
                    name="userType"
                    placeholder="User Type"
                    className="w-full px-4 py-2 bg-gray-800 rounded"
                  />
                  <Field
                    name="salary"
                    type="number"
                    placeholder="Salary"
                    className="w-full px-4 py-2 bg-gray-800 rounded"
                  />
                  <Field
                    name="targetAmount"
                    type="number"
                    placeholder="Target Amount"
                    className="w-full px-4 py-2 bg-gray-800 rounded"
                  />

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#EE2737] px-4 py-2 rounded"
                    >
                      {isSubmitting
                        ? "Saving..."
                        : editId
                          ? "Update Employee"
                          : "Add Employee"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}
