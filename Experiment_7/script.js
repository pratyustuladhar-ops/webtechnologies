let students = [];

// Save form data
document.getElementById("studentForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let course = document.getElementById("course").value;

    students.push({ name, email, course });

    alert("Data Saved!");

    document.getElementById("studentForm").reset();
});

// Download CSV
function downloadCSV() {

    if (students.length === 0) {
        alert("No data to download!");
        return;
    }

    let csv = "Name,Email,Course\n";

    students.forEach(function(student) {
        csv += student.name + "," + student.email + "," + student.course + "\n";
    });

    let blob = new Blob([csv], { type: "text/csv" });
    let url = window.URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "students.csv");
    a.click();
}