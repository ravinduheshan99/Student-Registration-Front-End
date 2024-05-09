function enableForm(disabled) {
  const elements = document.querySelectorAll("input, select, button");
  elements.forEach((element) => {
    element.disabled = disabled;
  });
}

function showLoadingOverlay(show) {
  const overlay = document.getElementById("loading-overlay");
  overlay.style.display = show ? "block" : "none";
}

function isValidForm() {
  const studNo = document.getElementById("txt-studno").value.trim();
  const fname = document.getElementById("txt-fname").value.trim();
  const lname = document.getElementById("txt-lname").value.trim();
  const dep = document.getElementById("cmb-dep").value;
  const course = document.getElementById("cmb-sub").value;

  return studNo !== "" && fname !== "" && lname !== "" && dep !== "Select Your Department" && course !== "Select Course Module";
}

function mapRequest() {
  const requestBody = {
    studNo: document.getElementById("txt-studno").value.trim(),
    fname: document.getElementById("txt-fname").value.trim(),
    lname: document.getElementById("txt-lname").value.trim(),
    dep: document.getElementById("cmb-dep").value,
    course: document.getElementById("cmb-sub").value,
  };

  return requestBody;
}

function enrollStudent() {
  if (!isValidForm()) {
    alert("Please fill in all required fields.");
    return;
  }

  const studNo = document.getElementById("txt-studno").value.trim();

  showLoadingOverlay(true); // Show loading overlay
  enableForm(true); // Disable the form

  // Step 1: Check if the student number already exists
  fetch(`http://localhost:8080/student?studNo=${studNo}`)
    .then((res) => {
      if (res.ok) {
        throw new Error("Duplicate student number. This student already exists."); // If student exists, throw an error
      }
      return res.json(); // If student doesn't exist, proceed
    })
    .then(() => {
      // Step 2: Enroll the new student if no duplicates found
      const requestBody = mapRequest();

      return fetch("http://localhost:8080/student", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to enroll student."); // If enrollment fails
      }
      return res.json();
    })
    .then((data) => {
      alert("Student enrolled successfully!");
      clear();
    })
    .catch((error) => {
      console.error(error);
      alert(error.message); // Provide appropriate error messages
    })
    .finally(() => {
      showLoadingOverlay(false); // Hide loading overlay
      enableForm(false); // Enable the form again
    });
}

function updateStudent() {
  if (!isValidForm()) {
    alert("Please fill in all required fields.");
    return;
  }

  showLoadingOverlay(true); // Show loading overlay
  enableForm(true); // Disable the form

  const requestBody = mapRequest();

  fetch("http://localhost:8080/student", {
    method: "PUT",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to update student");
      }
      return res.json();
    })
    .then((data) => {
      alert("Student updated successfully!");
      clear();
    })
    .catch((error) => {
      console.error(error);
      alert("An error occurred. Please try again.");
    })
    .finally(() => {
      showLoadingOverlay(false); // Hide loading overlay
      enableForm(false); // Re-enable the form
    });
}

function searchStudent() {
  const studNo = document.getElementById("txt-studno").value.trim();

  if (studNo === "") {
    alert("Please enter a student number to search.");
    return;
  }

  showLoadingOverlay(true); // Show loading overlay
  enableForm(true); // Disable the form

  fetch(`http://localhost:8080/student?studNo=${studNo}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Student not found");
      }
      return res.json();
    })
    .then((data) => {
      document.getElementById("txt-fname").value = data.fname;
      document.getElementById("txt-lname").value = data.lname;
      document.getElementById("cmb-dep").value = data.dep;
      document.getElementById("cmb-sub").value = data.course;
    })
    .catch((error) => {
      console.error(error);
      alert("Student not found. Please check the student number.");
    })
    .finally(() => {
      showLoadingOverlay(false); // Hide loading overlay
      enableForm(false); // Re-enable the form
    });
}

function deleteStudent() {
  const studNo = document.getElementById("txt-studno").value.trim();

  if (studNo === "") {
    alert("Please enter a student number to delete.");
    return;
  }

  const confirmation = confirm("Are you sure you want to delete this student?");

  if (!confirmation) {
    alert("Student deletion was canceled.");
    return;
  }

  showLoadingOverlay(true); // Show loading overlay
  enableForm(true); 

  fetch(`http://localhost:8080/student?studNo=${studNo}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Deletion failed.");
      }
      return res.json();
    })
    .then((data) => {
      alert("Student successfully deleted!");
      clear(); // Clear form fields
    })
    .catch((error) => {
      console.error(error);
      alert("Student successfully deleted!");
      clear();
    })
    .finally(() => {
      showLoadingOverlay(false); // Hide loading overlay
      enableForm(false); // Re-enable the form
    });
}

function clear() {
  document.getElementById("txt-studno").value = "";
  document.getElementById("txt-fname").value = "";
  document.getElementById("txt-lname").value = "";
  document.getElementById("cmb-dep").value = "Select Your Department";
  document.getElementById("cmb-sub").value = "Select Course Module";
}

document.getElementById("btn-enroll").addEventListener("click", enrollStudent);
document.getElementById("btn-update").addEventListener("click", updateStudent);
document.getElementById("btn-search").addEventListener("click", searchStudent);
document.getElementById("btn-delete").addEventListener("click", deleteStudent);
document.getElementById("btn-clear").addEventListener("click", clear);
