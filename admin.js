// ===== DỮ LIỆU MẪU =====
let courses = [
    { id: 1, name: "Iphone 17 Promax", desc: "Lấp lánh óng ánh" },
    { id: 2, name: "Xiaomi 17 Promax", desc: "Giống iPhone nhưng là Android" }
];

// ===== HIỂN THỊ DANH SÁCH =====
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

// ===== THÊM SẢN PHẨM =====
function addCourse() {
    const name = prompt("Nhập tên sản phẩm:");
    if (!name) return;
    const desc = prompt("Nhập mô tả sản phẩm:");
    if (!desc) return;

    const newId = courses.length ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    courses.push({ id: newId, name, desc });
    renderCourses();
}

// ===== SỬA SẢN PHẨM =====
function editCourse(id) {
    const course = courses.find(c => c.id === id);
    if (!course) return;

    const newName = prompt("Sửa tên sản phẩm:", course.name);
    if (newName === null) return; // bấm Cancel
    const newDesc = prompt("Sửa mô tả:", course.desc);
    if (newDesc === null) return;

    course.name = newName.trim() || course.name;
    course.desc = newDesc.trim() || course.desc;

    renderCourses();
}

// ===== XOÁ SẢN PHẨM =====
function deleteCourse(id) {
    if (confirm("Bạn có chắc muốn xoá sản phẩm này?")) {
        courses = courses.filter(c => c.id !== id);
        renderCourses();
    }
}

// ===== KHỞI TẠO =====
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnAdd").addEventListener("click", addCourse);
    renderCourses();
});
