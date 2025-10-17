// Mảng lưu dữ liệu sản phẩm mẫu
let courses = [
    { id: 1, name: "Iphone 17 Promax", desc: "Lấp lánh óng ánh" },
    { id: 2, name: "Xiaomi 17 Promax", desc: "Giống iphone nhưng là android" }
];

// Render danh sách sản phẩm ra bảng
function renderCourses() {
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = "";
    courses.forEach((course, idx) => {
        tbody.innerHTML += `
            <tr>
                <td>${idx + 1}</td>
                <td>${course.name}</td>
                <td>${course.desc}</td>
                <td>
                    <button class="btn-dark" onclick="editCourse(${course.id})">Sửa</button>
                    <button class="btn-dark" onclick="deleteCourse(${course.id})">Xoá</button>
                </td>
            </tr>
        `;
    });
}

// Xử lý thêm sản phẩm
function addCourse() {
    const name = prompt("Nhập tên sản phẩm:");
    if (!name) return;
    const desc = prompt("Nhập mô tả sản phẩm:");
    if (!desc) return;
    const newId = courses.length ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    courses.push({ id: newId, name, desc });
    renderCourses();
}

// Xử lý sửa sản phẩm
function editCourse(id) {
    const course = courses.find(c => c.id === id);
    if (!course) return;
    const newName = prompt("Sửa tên sản phẩm:", course.name);
    if (!newName) return;
    const newDesc = prompt("Sửa mô tả:", course.desc);
    if (!newDesc) return;
    course.name = newName;
    course.desc = newDesc;
    renderCourses();
}

// Xử lý xoá sản phẩm
function deleteCourse(id) {
    if (confirm("Bạn có chắc muốn xoá sản phẩm này?")) {
        courses = courses.filter(c => c.id !== id);
        renderCourses();
    }
}

// Gắn sự kiện cho nút Thêm sản phẩm
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".btn-dark").onclick = addCourse;
    renderCourses();
});