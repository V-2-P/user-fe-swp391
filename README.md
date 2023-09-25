## :construction_worker:  **Installation**
**You must first have installed [NodeJS](https://nodejs.org/) in its 18.17.1 version (I recommend [nvm](https://github.com/nvm-sh/nvm) to deal with versions), [Yarn](https://yarnpkg.com/), and then:**

`git clone https://github.com/V-2-P/fe-swp391.git`

Step 1:

Trỏ đến thư mục `cd fe-swp391`

Step 2:

Chạy lệnh `yarn` (hoặc `npm install`) để cài đặt dự án

Step 3:

Tạo file `.env` trong thư mục gốc của dự án.

Sao chép tất cả nội dung từ `.env.example` sang `.env`

Thay đổi cấu hình thích hợp trong file `.env`

<hr />
<br />

## :open_file_folder: **Architecture**


```
src/
  application/
    assets/
      fonts/
      images/
    components/
    hooks/
    layouts/
    pages/
    routes/
    scripts/
    App.tsx
    index.tsx
    styles.css
  redux/
    slices/
    store.ts
  utils/
    api/
    cache/
```
<hr />
<br />

## Package Commands (NPM)

| Lệnh                  | Mô tả        |
| --------------        | ------------|
| `npm install`         | Cài đặt các package      |
| `npm run dev`         | Khởi động ứng dụng trong môi trường development |
| `npm run build`       | Biên dịch ứng dụng và xây dựng production bundle |
| `npm run lint`        | Kiểm tra lỗi cú pháp và chính tả của các tệp TypeScript |
| `npm run lint:fix`    | Kiểm tra lỗi cú pháp và chính tả của các tệp TypeScript và tự động sửa chữa các lỗi đơn giản |
| `npm run format:check`| Kiểm tra định dạng của các tệp TypeScript, CSS và SCSS |
| `npm run format`      | Định dạng lại các tệp TypeScript, CSS và SCSS |
| `npm test`            | Chạy các kiểm tra với Jest |

## Package Commands (Yarn)

| Lệnh                  | Mô tả        |
| --------------        | ------------|
| `yarn install`        | Cài đặt các package      |
| `yarn dev`            | Khởi động ứng dụng trong môi trường development |
| `yarn build`          | Biên dịch ứng dụng và xây dựng production bundle |
| `yarn lint`           | Kiểm tra lỗi cú pháp và chính tả của các tệp TypeScript |
| `yarn lint:fix`       | Kiểm tra lỗi cú pháp và chính tả của các tệp TypeScript và tự động sửa chữa các lỗi đơn giản |
| `yarn format:check`   | Kiểm tra định dạng của các tệp TypeScript, CSS và SCSS |
| `yarn format`         | Định dạng lại các tệp TypeScript, CSS và SCSS |
| `yarn test`           | Chạy các kiểm tra với Jest |

## Tasks

