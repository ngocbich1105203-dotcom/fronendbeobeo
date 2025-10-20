const courseList = document.getElementById('course-list');
const openAddCourseModal = document.getElementById('open-add-course-modal');
const courseModal = document.getElementById('course-modal');
const courseForm = document.getElementById('course-form');
const courseNameInput = document.getElementById('course-name');
const courseDescriptionInput = document.getElementById('course-description');
const courseIdInput = document.getElementById('course-id');

const login = document.getElementById('login');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const emailLogin = document.getElementById('email');
const passwordLogin = document.getElementById('password');
const usernameDisplay = document.getElementById('username-display');

const register = document.getElementById('register');
const registerModal = document.getElementById('register-modal');
const registerForm = document.getElementById('register-form');
const emailRegister = document.getElementById('reg-email');
const fullnameRegister = document.getElementById('reg-fullname');
const passwordRegister = document.getElementById('reg-password');
const comfirmPasswordRegister = document.getElementById('reg-confirm-password');

// Chức năng đăng nhập
if (login) {
    login.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = emailLogin.value;
        const password = passwordLogin.value;
        // alert(password);
        fetch(`http://localhost:3000/users?email=${email}&password=${password}`)
            .then(response => response.json())
            .then(users => {
                console.log(users);
                if (users.length > 0) {
                    alert('Đăng nhập thành công');
                    loginModal.style.display = 'none';
                    loginForm.reset();
                    usernameDisplay.textContent = users[0].fullname;
                } else {
                    alert('Tài khoản chưa đúng');
                }
            })
            .catch(error => console.error(error));
    });
}

// Chức năng đăng ký
if (register) {
    register.addEventListener('click', () => {
        registerModal.style.display = 'block';
        loginModal.style.display = 'none';
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (passwordRegister.value !== comfirmPasswordRegister.value) {
            alert('Mật khẩu nhập không khớp');
            return;
        }

        const users = await fetch(`http://localhost:3000/users?email=${emailRegister.value}`)
            .then(response => response.json());

        if (users.length > 0) {
            alert('Email đăng ký đã tồn tại');
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            fullname: fullnameRegister.value,
            email: emailRegister.value,
            password: passwordRegister.value,
        };

        console.log(newUser);

        await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        })
            .then(response => response.json())
            .then(data => {
                alert('Đăng ký thành công');
                registerModal.style.display = 'none';
                registerForm.reset();
                loginModal.style.display = 'block';
            })
            .catch(error => console.error(error));
    });
}
