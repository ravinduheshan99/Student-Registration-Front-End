let body = `
<tr>
  <th>Student Number</th>
  <th>First Name</th>
  <th>Last Name</th>
  <th>Department</th>
  <th>Course Module</th>
</tr>`;


let tblStudentRecords = document.getElementById("tbl-stud-rec");

function getStudentsRecord() {
  fetch("http://localhost:8080/all-students")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((element) => {
        body += `<tr>
                <td>${element.studNo}</td>
                <td>${element.fname}</td>
                <td>${element.lname}</td>
                <td>${element.dep}</td>
                <td>${element.course}</td>
              </tr>`;
      });
      tblStudentRecords.innerHTML=body;
    });
}

document.addEventListener("DOMContentLoaded",getStudentsRecord);