import { useState } from "react";
import "./Project3.css";

function Project3() {
  const [students, setStudents] = useState([
    { name: "Devasree", status: "" },
    { name: "Rahul", status: "" },
    { name: "Priya", status: "" },
    { name: "Arun", status: "" },
    { name: "Kavya", status: "" },
    {name: "jessica", status:""},
    { name: "sree", status: "" },
    { name: "bhavani", status: "" },
    { name: "madhu", status: "" },
    { name: "kaviya", status: "" },
    { name: "lathi", status: "" },
    {name: "john", status:""},
    {name:"james",status:""},
    {name:"rohit",status:""},
    {name:"sneha",status:""}

  ]);

  const changeStatus = (name, status) => {
    setStudents(
      students.map((student) =>
        student.name === name
          ? { ...student, status }
          : student
      )
    );
  };

  const present = students.filter(
    (student) => student.status === "Present"
  ).length;

  const absent = students.filter(
    (student) => student.status === "Absent"
  ).length;

  return (
    <div className="attendance">

      <h1>Student Attendance</h1>

      <div className="summary">

        <div>
          <h3>Total</h3>
          <p>{students.length}</p>
        </div>

        <div className="present-box">
          <h3>Present</h3>
          <p>{present}</p>
        </div>

        <div className="absent-box">
          <h3>Absent</h3>
          <p>{absent}</p>
        </div>

      </div>

      <div className="students">

        {students.map((student) => (
          <div className="student" key={student.name}>

            <div>
              <h3>{student.name}</h3>

              <p
                className={
                  student.status === "Present"
                    ? "current-present"
                    : student.status === "Absent"
                    ? "current-absent"
                    : "no-status"
                }
              >
                {student.status
                  ? `Status: ${student.status}`
                  : "Status: Not Submitted"}
              </p>
            </div>

            <div className="options">

              <label className="present">
                <input
                  type="radio"
                  name={student.name}
                  checked={student.status === "Present"}
                  onChange={() =>
                    changeStatus(student.name, "Present")
                  }
                />
                Present
              </label>

              <label className="absent">
                <input
                  type="radio"
                  name={student.name}
                  checked={student.status === "Absent"}
                  onChange={() =>
                    changeStatus(student.name, "Absent")
                  }
                />
                Absent
              </label>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Project3;