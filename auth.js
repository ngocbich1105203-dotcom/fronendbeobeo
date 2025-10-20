// API URL
const API_URL = 'https://my-json-server.typicode.com/ngocbich1105203-dotcom/backendjson';

// Hiển thị thông báo
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            ${type === 'success' ? '✓' : '✕'}
        </div>
        <div class="notification-message">${message}</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Xử lý đăng ký
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validation
        if (password.length < 6) {
            showNotification('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('Mật khẩu xác nhận không khớp!', 'error');
            return;
        }
        
        try {
            // Lấy danh sách users từ localStorage
            let users = JSON.parse(localStorage.getItem('mystore_users')) || [];
            
            // Nếu chưa có users trong localStorage, lấy từ API
            if (users.length === 0) {
                const response = await fetch(`${API_URL}/users`);
                users = await response.json();
                localStorage.setItem('mystore_users', JSON.stringify(users));
            }
            
            // Kiểm tra email đã tồn tại
            const emailExists = users.find(u => u.email === email);
            if (emailExists) {
                showNotification('Email đã được đăng ký!', 'error');
                return;
            }
            
            // Tạo user mới
            const newUser = {
                id: users.length > 0 ? (Math.max(...users.map(u => parseInt(u.id))) + 1).toString() : "1",
                name: name,
                email: email,
                password: password,
                role: 'customer'
            };
            
            // Thêm user vào localStorage
            users.push(newUser);
            localStorage.setItem('mystore_users', JSON.stringify(users));
            showNotification('🎉 Đăng ký thành công! Đang chuyển đến trang đăng nhập...', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            console.error('Lỗi:', error);
            showNotification('Có lỗi xảy ra. Vui lòng thử lại!', 'error');
        }
    });
}

// Xử lý đăng nhập
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        try {
            // Lấy danh sách users từ localStorage
            let users = JSON.parse(localStorage.getItem('mystore_users')) || [];
            
            // Nếu chưa có users trong localStorage, lấy từ API
            if (users.length === 0) {
                const response = await fetch(`${API_URL}/users`);
                users = await response.json();
                localStorage.setItem('mystore_users', JSON.stringify(users));
            }
            
            // Tìm user
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Lưu thông tin đăng nhập vào localStorage
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                showNotification(`✅ Đăng nhập thành công! Chào mừng ${user.name}`, 'success');
                
                setTimeout(() => {
                    if (user.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 1500);
            } else {
                showNotification('❌ Email hoặc mật khẩu không chính xác!', 'error');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            showNotification('Không thể kết nối đến server!', 'error');
        }
    });
}

// Kiểm tra đăng nhập khi tải trang
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

// Đăng xuất
function logout() {
    localStorage.removeItem('currentUser');
    showNotification('Đã đăng xuất thành công!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}