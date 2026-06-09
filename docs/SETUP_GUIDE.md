# Hướng Dẫn Setup Pet Healthy

## Yêu Cầu

- Node.js 20 trở lên.
- npm.
- PostgreSQL 14 trở lên nếu chạy local theo kiểu gần production.
- Playwright Chromium để chạy browser smoke test.

## Cài Đặt

```powershell
npm install
npm run prisma:generate
npx playwright install chromium
```

## Cấu Hình Môi Trường

Tạo file `.env` từ file mẫu:

```powershell
Copy-Item .env.example .env
```

Nội dung mặc định của `.env.example`:

```env
DATABASE_URL="postgresql://pet_healthy:pet_healthy@localhost:5432/pet_healthy?schema=public"
AUTH_STORE="prisma"
```

`AUTH_STORE=prisma` dùng PostgreSQL thông qua Prisma.

`AUTH_STORE=memory` chỉ dùng cho demo hoặc smoke test local. Dữ liệu sẽ mất khi restart dev server.

## Setup Database

Tạo database PostgreSQL local khớp với `DATABASE_URL`, rồi đồng bộ schema:

```powershell
npx prisma db push
npm run prisma:generate
```

Hiện project đang dùng `prisma db push` để đồng bộ schema local. Khi schema cần lịch sử migration rõ ràng để review, hãy thêm Prisma migrations.

## Chạy Dev Server

```powershell
npm run dev
```

Mở:

```text
http://localhost:3000
```

Các flow đã implement:

- Đăng ký, đăng nhập, đăng xuất.
- Tạo household mặc định khi đăng ký.
- Tạo, sửa, archive pet profile.
- Tạo, filter, sửa, xóa health log.

## Chạy Demo Nhanh Không Cần PostgreSQL

Dùng memory storage:

```powershell
$env:AUTH_STORE="memory"
npm run dev
```

Mở `http://localhost:3000`.

Dữ liệu chỉ nằm trong bộ nhớ và sẽ mất khi restart server.

## Kiểm Tra Và Validation

Chạy unit test và route test:

```powershell
npm test
```

Chạy lint:

```powershell
npm run lint
```

Chạy production build:

```powershell
npm run build
```

Chạy browser smoke test:

```powershell
npm run test:e2e
```

Chạy verify theo từng story:

```powershell
npm run verify:auth-account
npm run verify:pet-profile
npm run verify:health-log
```

Chạy Harness verification:

```powershell
.\scripts\bin\harness-cli.exe story verify auth-account
.\scripts\bin\harness-cli.exe story verify pet-profile
.\scripts\bin\harness-cli.exe story verify health-log
.\scripts\bin\harness-cli.exe query matrix
```

## Lỗi Thường Gặp

### PowerShell báo lỗi với `&&`

PowerShell trên máy này không nhận `&&` như Bash. Hãy chạy từng lệnh riêng:

```powershell
npm test
npm run lint
```

### Prisma báo thiếu `DATABASE_URL`

Tạo `.env` từ `.env.example`, rồi chạy lại:

```powershell
npm run prisma:generate
```

### Playwright báo thiếu browser

Cài Chromium:

```powershell
npx playwright install chromium
```

### Muốn chạy smoke test bằng dữ liệu sạch

Restart dev server. Memory store không lưu dữ liệu sau khi restart.
