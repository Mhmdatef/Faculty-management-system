import { useEffect } from "react";
import { Student } from "../../interfaces/Student.interface";
// import { getOneStudent } from "../../services/studentServices";

const StudentData = ({ studentData }: { studentData: { user: Student } }) => {
  useEffect(() => {
    // getOneStudent();
  }, []);

  const student=studentData.user||{}
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div>
        <p>
          <span className="font-semibold">Name:</span> {student.name}
        </p>
        <p>
          <span className="font-semibold">Student ID:</span> {student.studentID}
        </p>
        <p>
          <span className="font-semibold">GPA:</span> {student.GPA}
        </p>
        <p>
          <span className="font-semibold">Major:</span> Computer Science
        </p>
        <p>
          <span className="font-semibold">Email:</span> {student.email}
        </p>
      </div>
      <div>
        <p>
          <span className="font-semibold">Level:</span> {student.level}rd Year
        </p>
        <p>
          <span className="font-semibold">Enrolled Since:</span> {student.enrollmentDate}
        </p>
        <p>
          <span className="font-semibold">Remaining Credits:</span> 20
        </p>
      </div>
    </div>
  );
};

export default StudentData;
