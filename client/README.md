# FixSync Client - Frontend Application

Frontend application cho hệ thống quản lý sửa chữa điện thoại FixSync.

## 🛠 Công nghệ sử dụng

- **React 19** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **React Query (TanStack Query)** - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons

## 📁 Cấu trúc dự án

```
client/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── PublicRoute.tsx
│   ├── pages/               # Page components
│   │   ├── Login.tsx
│   │   └── Dashboard.tsx
│   ├── hooks/               # Custom hooks
│   │   └── useAuth.ts
│   ├── services/            # API services
│   │   ├── api.ts
│   │   └── auth.service.ts
│   ├── stores/              # Zustand stores
│   │   └── auth.store.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── constants/           # Constants
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── cn.ts
│   │   └── format.ts
│   ├── providers/           # Context providers
│   │   └── QueryProvider.tsx
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── .env.example             # Environment variables template
└── package.json
```

## ⚙️ Cài đặt và chạy

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình environment variables

Sao chép file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Chỉnh sửa `.env` với API URL của bạn:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

### 4. Build cho production

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

## 🔐 Authentication

Ứng dụng sử dụng JWT authentication:
- Token được lưu trong localStorage
- Token tự động được thêm vào header của mọi API request
- Tự động redirect về login nếu token hết hạn (401)

## 📚 Cấu trúc code

### Components

- **Layout**: Layout chính với header và navigation
- **ProtectedRoute**: Bảo vệ routes yêu cầu authentication
- **PublicRoute**: Routes công khai (redirect nếu đã đăng nhập)

### Pages

- **Login**: Trang đăng nhập
- **Dashboard**: Trang dashboard chính

### Services

- **api.ts**: Axios instance với interceptors
- **auth.service.ts**: Authentication service

### Stores

- **auth.store.ts**: Zustand store cho authentication state

### Types

Tất cả TypeScript types được định nghĩa trong `src/types/index.ts`:
- User, Device, Brand, DeviceModel
- Transaction, Warranty, RepairItem
- Media, RealtimeLog
- API Response types

### Constants

- **API_ENDPOINTS**: Tất cả API endpoints
- **ROUTES**: Application routes
- **STORAGE_KEYS**: LocalStorage keys
- **PAGINATION**: Pagination defaults

### Utils

- **cn.ts**: Utility để merge Tailwind classes
- **format.ts**: Format currency, date, phone number

## 🎨 Styling

Sử dụng Tailwind CSS 4 với utility-first approach. Các utility functions:
- `cn()`: Merge Tailwind classes với clsx và tailwind-merge

## 🔄 State Management

- **Server State**: React Query cho data từ API
- **Client State**: Zustand cho authentication và UI state

## 📝 Development Notes

- Tất cả API calls nên sử dụng React Query hooks
- Forms nên sử dụng React Hook Form với Zod validation
- Components nên được tách thành các component nhỏ, reusable
- Sử dụng TypeScript strict mode
- Follow React best practices (hooks, functional components)

## 🚀 Next Steps

1. Tạo các pages còn lại (Devices, Users, etc.)
2. Tạo các components UI (Button, Input, Modal, etc.)
3. Implement các API services
4. Thêm error handling và loading states
5. Thêm form validation
6. Implement responsive design
7. Thêm unit tests

## 📄 License

Copyright © 2024 FixSync
