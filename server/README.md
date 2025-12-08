# FixSync Server - Backend API

Hệ thống quản lý sửa chữa điện thoại cho các kỹ thuật viên trong cửa hàng.

## 📋 Mục lục

- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt và cấu hình](#cài-đặt-và-cấu-hình)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [Tính năng chính](#tính-năng-chính)
- [Phân quyền](#phân-quyền)
- [File Upload](#file-upload)
- [Development](#development)

## 🛠 Công nghệ sử dụng

- **Java 20** - Ngôn ngữ lập trình
- **Spring Boot 3.5.7** - Framework chính
- **Spring Security** - Bảo mật với JWT Authentication
- **Spring Data JPA** - ORM với Hibernate
- **PostgreSQL** - Database
- **Flyway** - Database migration
- **MapStruct** - DTO mapping
- **Lombok** - Code generation
- **Maven** - Dependency management
- **AWS S3** (Optional) - File storage

## 📁 Cấu trúc dự án

```
server/
├── src/main/java/com/fixsync/server/
│   ├── config/              # Cấu hình (FileStorage, S3, Security)
│   ├── controller/          # REST Controllers
│   ├── dto/                 # Data Transfer Objects
│   │   ├── request/         # Request DTOs
│   │   └── response/        # Response DTOs
│   ├── entity/              # JPA Entities
│   │   └── enums/           # Enumerations
│   ├── exception/           # Exception handling
│   ├── mapper/              # MapStruct mappers
│   ├── repository/          # JPA Repositories
│   ├── security/            # Security configuration (JWT)
│   ├── service/             # Business logic
│   │   └── impl/            # Service implementations
│   └── util/                # Utilities
└── src/main/resources/
    ├── application.yml.example  # File cấu hình mẫu
    └── db/migration/        # Flyway migrations
        ├── V1__Initial_schema.sql
        ├── V2__Insert_default_admin.sql
        ├── V3__Create_brands_and_models.sql
        └── V4__Create_media_table.sql
```

## 💻 Yêu cầu hệ thống

- **Java 20+** (hoặc Java 17+)
- **Maven 3.6+**
- **PostgreSQL 14+**
- **AWS Account** (nếu sử dụng S3 cho file storage)

## ⚙️ Cài đặt và cấu hình

### 1. Clone repository

```bash
git clone <repository-url>
cd FixSync/server
```

### 2. Cấu hình Database

Tạo database PostgreSQL:

```sql
CREATE DATABASE fixsync;
```

### 3. Cấu hình Application

Sao chép file cấu hình mẫu:

```bash
cp src/main/resources/application.yml.example src/main/resources/application.yml
```

Chỉnh sửa `application.yml` với thông tin của bạn:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/fixsync
    username: your_postgres_username
    password: your_postgres_password

jwt:
  secret: your-very-long-secret-key-at-least-256-bits
  expiration: 86400000

# Nếu sử dụng S3
file:
  upload:
    storage-type: s3

aws:
  region: ap-southeast-1
  s3:
    bucket: your-bucket-name
  accessKeyId: your-access-key
  secretAccessKey: your-secret-key
```

**Lưu ý**: File `application.yml` đã được thêm vào `.gitignore` để bảo mật thông tin nhạy cảm.

### 4. Cấu hình AWS S3 (Optional)

Nếu sử dụng S3 cho file storage:

1. Tạo S3 bucket trên AWS
2. Tạo IAM user với quyền truy cập S3
3. Lấy Access Key ID và Secret Access Key
4. Cập nhật trong `application.yml`

Hoặc sử dụng environment variables:

```bash
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
```

## 🚀 Chạy ứng dụng

### Build project

```bash
mvn clean install
```

### Chạy ứng dụng

```bash
mvn spring-boot:run
```

Hoặc chạy JAR file:

```bash
java -jar target/server-0.0.1-SNAPSHOT.jar
```

Ứng dụng sẽ chạy tại: `http://localhost:8080`

## 📚 API Documentation

### Authentication

- `POST /api/auth/login` - Đăng nhập và nhận JWT token

**Request:**

```json
{
  "email": "admin@fixsync.com",
  "password": "admin123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "user": {
      "id": "...",
      "email": "admin@fixsync.com",
      "role": "ADMIN"
    }
  }
}
```

### Users (Admin only)

- `GET /api/users?page=0&size=10&sortBy=createdAt&sortDir=DESC` - Lấy danh sách người dùng (phân trang)
- `GET /api/users/{id}` - Lấy thông tin người dùng
- `POST /api/users` - Tạo người dùng mới
- `PUT /api/users/{id}` - Cập nhật người dùng
- `DELETE /api/users/{id}` - Xóa người dùng
- `PATCH /api/users/{id}/activate` - Kích hoạt người dùng
- `PATCH /api/users/{id}/deactivate` - Vô hiệu hóa người dùng

### Brands (Public)

- `GET /api/brands?page=0&size=10&sortBy=name&sortDir=ASC` - Lấy danh sách hãng (phân trang)
- `GET /api/brands/active` - Lấy danh sách hãng đang hoạt động
- `GET /api/brands/{id}` - Lấy thông tin hãng

### Device Models (Public)

- `GET /api/device-models/brand/{brandId}?paginated=false` - Lấy danh sách model theo hãng
- `GET /api/device-models/device-type/{deviceType}` - Lấy danh sách model theo loại thiết bị

### Devices

- `GET /api/devices?page=0&size=10&sortBy=createdAt&sortDir=DESC` - Lấy danh sách thiết bị (phân trang)
- `GET /api/devices/{id}` - Lấy thông tin thiết bị
- `POST /api/devices` - Tạo thiết bị mới
- `PUT /api/devices/{id}` - Cập nhật thiết bị
- `DELETE /api/devices/{id}` - Xóa thiết bị
- `PATCH /api/devices/{id}/status?status=REPAIRING` - Cập nhật trạng thái thiết bị
- `PATCH /api/devices/{id}/assign?assignedToId={userId}` - Giao thiết bị cho kỹ thuật viên

**Device Status:** `RECEIVED`, `INSPECTING`, `WAITING_PARTS`, `REPAIRING`, `COMPLETED`, `RETURNED`

### Repair Items

- `GET /api/repair-items/device/{deviceId}?paginated=false` - Lấy danh sách dịch vụ sửa chữa
- `GET /api/repair-items/{id}` - Lấy thông tin dịch vụ sửa chữa
- `POST /api/repair-items` - Tạo dịch vụ sửa chữa mới
- `PUT /api/repair-items/{id}` - Cập nhật dịch vụ sửa chữa
- `DELETE /api/repair-items/{id}` - Xóa dịch vụ sửa chữa
- `GET /api/repair-items/device/{deviceId}/total-cost` - Tính tổng chi phí

### Transactions

- `GET /api/transactions/device/{deviceId}` - Lấy giao dịch của thiết bị
- `GET /api/transactions/{id}` - Lấy thông tin giao dịch
- `POST /api/transactions` - Tạo giao dịch mới
- `PUT /api/transactions/{id}` - Cập nhật giao dịch
- `DELETE /api/transactions/{id}` - Xóa giao dịch
- `GET /api/transactions/revenue?startDate=2024-01-01&endDate=2024-12-31` - Tính doanh thu theo khoảng thời gian

**Payment Methods:** `CASH`, `MOMO`, `BANKING`

### Warranties

- `GET /api/warranties/device/{deviceId}` - Lấy danh sách bảo hành
- `GET /api/warranties/{id}` - Lấy thông tin bảo hành
- `GET /api/warranties/code/{warrantyCode}` - Tìm bảo hành theo mã
- `POST /api/warranties` - Tạo bảo hành mới
- `PUT /api/warranties/{id}` - Cập nhật bảo hành
- `DELETE /api/warranties/{id}` - Xóa bảo hành
- `GET /api/warranties/expiring?days=30` - Lấy bảo hành sắp hết hạn
- `GET /api/warranties/expired` - Lấy bảo hành đã hết hạn

### Realtime Logs

- `GET /api/logs/device/{deviceId}?paginated=false&action=CREATED` - Lấy lịch sử hoạt động của thiết bị

**Action Types:** `CREATED`, `UPDATED`, `ASSIGNED`, `STATUS_CHANGED`

### Media

- `POST /api/media/upload` - Upload file (multipart/form-data)
- `GET /api/media/{id}/download` - Download file (public)
- `GET /api/media/{id}` - Lấy thông tin media
- `GET /api/media/entity/{entityType}/{entityId}?paginated=false` - Lấy media theo entity
- `GET /api/media/entity/{entityType}/{entityId}/type/{mediaType}` - Lấy media theo entity và loại
- `GET /api/media/my-uploads?page=0&size=10` - Lấy danh sách file đã upload
- `GET /api/media?page=0&size=10` - Lấy tất cả media (phân trang)
- `DELETE /api/media/{id}` - Xóa file

**Media Types:** `IMAGE`, `DOCUMENT`, `VIDEO`, `AUDIO`, `OTHER`

**Entity Types:** `DEVICE`, `USER`, `BRAND`, `DEVICEMODEL`, `REPAIRITEM`, `TRANSACTION`, `WARRANTY`, `LOG`

## 🔐 Authentication

Tất cả các API (trừ `/api/auth/**`, `/api/brands/**`, `/api/device-models/**`, và `/api/media/*/download`) đều yêu cầu JWT token trong header:

```
Authorization: Bearer <token>
```

Token được lấy từ endpoint `/api/auth/login` và có thời hạn mặc định là 24 giờ.

## 👤 Default Admin Account

Sau khi chạy migration, tài khoản admin mặc định:

- **Email**: `admin@fixsync.com`
- **Password**: `admin123`

**⚠️ Lưu ý**: Nên đổi mật khẩu ngay sau lần đăng nhập đầu tiên!

## 🗄️ Database Schema

Hệ thống sử dụng các bảng chính:

- **users** - Người dùng (Admin, Technician, Receptionist)
- **brands** - Hãng điện thoại
- **device_models** - Model điện thoại
- **devices** - Thiết bị cần sửa chữa
- **repair_items** - Các dịch vụ sửa chữa
- **transactions** - Giao dịch thanh toán
- **warranties** - Bảo hành
- **realtime_logs** - Lịch sử hoạt động
- **media** - File đã upload

Database migrations được quản lý bởi Flyway và tự động chạy khi khởi động ứng dụng.

## ✨ Tính năng chính

1. **Quản lý người dùng**: Phân quyền Admin, Technician, Receptionist
2. **Quản lý hãng và model**: Quản lý danh sách hãng và model điện thoại
3. **Quản lý thiết bị**: Theo dõi trạng thái sửa chữa với nhiều trạng thái
4. **Quản lý dịch vụ**: Thêm/sửa/xóa các dịch vụ sửa chữa
5. **Quản lý thanh toán**: Xử lý giao dịch và tính doanh thu
6. **Quản lý bảo hành**: Theo dõi bảo hành và cảnh báo hết hạn
7. **Lịch sử hoạt động**: Ghi log mọi thao tác trên hệ thống
8. **Upload file**: Hỗ trợ upload file (local hoặc S3)

## 🔑 Phân quyền

- **ADMIN**: Toàn quyền truy cập, quản lý người dùng
- **TECHNICIAN**: Quản lý thiết bị được giao, cập nhật trạng thái, thêm dịch vụ sửa chữa
- **RECEPTIONIST**: Tiếp nhận thiết bị, tạo giao dịch, quản lý bảo hành

## 📁 File Upload

Hệ thống hỗ trợ 2 phương thức lưu trữ file:

### Local Storage (Mặc định)

File được lưu trữ trên server tại thư mục `./uploads`. Cấu hình:

```yaml
file:
  upload:
    storage-type: local
```

### AWS S3

File được lưu trữ trên AWS S3. Cấu hình:

```yaml
file:
  upload:
    storage-type: s3

aws:
  region: ap-southeast-1
  s3:
    bucket: your-bucket-name
  accessKeyId: your-access-key
  secretAccessKey: your-secret-key
```

**File hỗ trợ:**

- Images: JPEG, PNG, GIF, WebP
- Documents: PDF, DOC, DOCX
- Max size: 10MB (có thể cấu hình)

## 🧪 Testing

### Postman Collection

File `FixSync_API.postman_collection.json` chứa tất cả các API endpoints với:

- Pre-configured requests
- Test scripts để tự động lưu token và IDs
- Synchronized variables ({{userId}}, {{deviceId}}, ...)

Import vào Postman để test API.

### Chạy tests

```bash
mvn test
```

## 🔧 Development

### Build project

```bash
mvn clean package
```

### Chạy với profile khác

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Xem SQL queries

Bật `show-sql: true` trong `application.yml` để xem các SQL queries được thực thi.

## 📝 Notes

- Tất cả timestamps sử dụng UTC timezone
- Database migrations tự động chạy khi khởi động ứng dụng
- JWT token có thời hạn 24 giờ (có thể cấu hình)
- File upload hỗ trợ cả local storage và AWS S3
- Response format nhất quán với `ApiResponse<T>` wrapper

## 📄 License

Copyright © 2024 FixSync
