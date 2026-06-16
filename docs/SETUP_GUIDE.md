# Hướng Dẫn Thiết Lập

## Yêu Cầu

- Node.js 20 trở lên.
- npm 10 trở lên.
- PostgreSQL 14 trở lên nếu chạy local theo kiểu có dữ liệu bền vững.
- Playwright Chromium để chạy browser smoke test.

## Cài Đặt

1. Cài dependencies:
   ```bash
   npm install
   ```
2. Tạo file môi trường:
   - Sao chép `.env.example` thành `.env.local`.
   - Điền các giá trị cần thiết cho database, SePay và Gemini.
3. Đồng bộ schema nếu dùng Prisma:
   ```bash
   npx prisma db push
   ```
4. Khởi tạo dữ liệu hoặc chạy seed nếu dự án có hỗ trợ.

## Cấu Hình Môi Trường

Các biến quan trọng:

- `DATABASE_URL`: chuỗi kết nối PostgreSQL.
- `AUTH_STORE`: chọn `prisma` hoặc `memory`.
- `NEXT_PUBLIC_APP_URL`: URL public của app khi chạy local, ví dụ `http://localhost:3000`.
- `SEPAY_*`: các biến cấu hình cho thanh toán.
- `GEMINI_API_KEY`: khóa cho AI Care Guide.
- `GEMINI_MODEL`: model Gemini, mặc định `gemini-3.1-flash-lite`.

Nội dung mặc định của `.env.example` nên được giữ đồng bộ với các biến trên.

`AUTH_STORE=prisma` dùng PostgreSQL thông qua Prisma.

`AUTH_STORE=memory` chỉ dùng cho demo hoặc smoke test local. Dữ liệu sẽ mất khi restart dev server.

## Chạy Với PostgreSQL Local

1. Tạo database PostgreSQL local khớp với `DATABASE_URL`.
2. Đồng bộ schema:
   ```bash
   npx prisma db push
   ```
3. Chạy ứng dụng:
   ```bash
   npm run dev
   ```

Hiện project đang dùng `prisma db push` để đồng bộ schema local. Khi schema cần lịch sử migration rõ ràng để review, hãy thêm Prisma migrations.

## Chạy Demo Nhanh Không Cần PostgreSQL

1. Đặt:
   ```bash
   AUTH_STORE=memory
   ```
2. Chạy app:
   ```bash
   npm run dev
   ```

Dữ liệu chỉ nằm trong bộ nhớ và sẽ mất khi restart server.

## Kiểm Tra Và Validation

Chạy unit test và route test:

```bash
npm run test
```

Chạy typecheck:

```bash
npm run typecheck
```

Chạy lint:

```bash
npm run lint
```

Chạy browser smoke test:

```bash
npm run test:e2e
```

Nếu cần chạy story verification theo Harness, dùng các lệnh verify tương ứng trong `docs/stories/`.

## Lưu Ý Cho PowerShell

### PowerShell báo lỗi với `&&`

PowerShell trên máy này không nhận `&&` như Bash. Hãy chạy từng lệnh riêng:

```powershell
npm install
npm run dev
```

### Prisma báo thiếu `DATABASE_URL`

Kiểm tra file `.env.local` và đảm bảo `DATABASE_URL` đã được khai báo đúng.

### Playwright báo thiếu browser

Cài Chromium:

```bash
npx playwright install chromium
```

Restart dev server sau khi cài xong. `AUTH_STORE=memory` không lưu dữ liệu sau khi restart.
