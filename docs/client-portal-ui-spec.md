# Courtify Client Portal UI Specification

## 1. Muc Tieu

Client Portal la khu vuc public cho khach dat san chu dong, khong can dang ky tai khoan. He thong dung so dien thoai lam dinh danh khach hang.

Muc tieu chinh:

- Khach tu dat san online.
- Khach tich diem theo so dien thoai.
- Khach xem lich su dat san bang so dien thoai.
- Khach doi lich truoc gio choi toi thieu 2 gio.
- Khach huy lich truoc gio choi toi thieu 2 gio.
- Khach chon dich vu/vat pham di kem khi dat san.
- Dashboard noi bo hien tai van giu vai tro quan ly, xac nhan, check-in, thanh toan, quan ly kho va bao cao.

## 2. Nguyen Tac San Pham

Client Portal khong thay the dashboard noi bo. Day la mot lop public dung chung data voi dashboard.

Nguyen tac:

- Khong bat buoc dang nhap.
- Khong bat buoc dang ky tai khoan.
- So dien thoai la khoa chinh de gom lich su va diem tich luy.
- Booking public can hien thi ro trang thai.
- Moi thao tac nhay cam nhu doi lich/huy lich phai validate bang so dien thoai.
- Diem chi duoc cong sau khi booking hoan tat hoac hoa don da thanh toan.
- Dich vu/vat pham khach chon khi dat san nen duoc xem la "dat kem", chua tru kho ngay neu chua thanh toan/xac nhan.

## 3. Route De Xuat

### MVP 4 Man Hinh

| Route | Man hinh | Muc dich |
|---|---|---|
| `/book` | Dat san | Khach chon san, gio, dich vu/vat pham, nhap thong tin va xac nhan |
| `/book/success/:bookingId` | Dat thanh cong | Hien thong tin booking sau khi tao |
| `/booking-lookup` | Tra cuu lich | Nhap SDT de xem lich su, diem, danh sach booking |
| `/booking/:bookingId` | Chi tiet booking | Xem chi tiet, doi lich, huy lich |

### Mo Rong Sau MVP

| Route | Man hinh | Muc dich |
|---|---|---|
| `/booking/:bookingId/reschedule` | Doi lich rieng | Tach rieng neu luong doi lich phuc tap |
| `/customer/history` | Lich su va diem | Tach rieng neu can trang ho so khach |
| `/book/venues/:venueId` | Dat san theo co so | Link public rieng cho tung co so |

## 4. Luong Nghiep Vu Tong Quan

### 4.1. Dat San Khong Can Tai Khoan

```text
Khach vao /book
Chon co so
Chon ngay
Chon san
Chon khung gio
Chon dich vu/vat pham dat kem
Nhap ho ten va so dien thoai
Xac nhan dat san
Backend tim Customer theo SDT
Neu chua co Customer thi tao moi
Tao Booking gan customerId
Hien man dat thanh cong
```

### 4.2. Tich Diem Theo SDT

```text
Khach dat san -> chua cong diem
Nhan vien check-in -> chua cong diem
Nhan vien check-out hoac hoa don PAID -> cong diem
Customer.points tang theo tong tien hop le
```

Cong thuc de xuat:

```text
1 diem / 10.000 VND thanh toan
```

Vi du:

- 150.000 VND -> 15 diem.
- 250.000 VND -> 25 diem.
- 1.000.000 VND -> 100 diem.

### 4.3. Xem Lich Su Bang SDT

```text
Khach vao /booking-lookup
Nhap so dien thoai
He thong tim Customer theo phone
Hien tong diem, tong luot dat, lich sap toi, lich da choi, lich da huy
```

Khuyen nghi bao mat MVP:

- Chi hien danh sach booking rut gon khi chi nhap SDT.
- Muon xem chi tiet day du, doi lich hoac huy lich thi yeu cau nhap dung SDT trong man chi tiet/modal.
- Sau nay co the nang cap OTP SMS/Zalo.

### 4.4. Doi Lich Truoc 2 Gio

Dieu kien:

- Booking thuoc dung SDT khach nhap.
- Trang thai la `PENDING` hoac `CONFIRMED`.
- Thoi diem hien tai con cach gio bat dau it nhat 2 gio.
- Slot moi con trong.
- Booking chua `IN_PROGRESS`, `COMPLETED`, `CANCELLED`.

Neu khong thoa dieu kien:

- Disable button `Doi lich`.
- Hien thong bao: "Lich nay da gan gio choi. Vui long lien he san de duoc ho tro."

### 4.5. Huy Lich Truoc 2 Gio

Dieu kien:

- Booking thuoc dung SDT khach nhap.
- Booking chua check-in.
- Booking chua hoan thanh.
- Con truoc gio bat dau it nhat 2 gio.

Khi huy:

- Doi trang thai booking thanh `CANCELLED`.
- Khong cong diem.
- Neu co vat pham/dich vu dat kem thi huy yeu cau dat kem.
- Neu sau nay co dat coc, can them luong hoan tien/ghi nhan tien coc.

## 5. Man Hinh 1: Dat San

Route: `/book`

Muc dich: tao booking public.

### 5.1. Layout Desktop

De xuat layout 2 cot:

- Cot trai: noi dung chon co so, san, ngay, gio, dich vu, thong tin khach.
- Cot phai: sticky booking summary.

```text
Header public
--------------------------------------------------
Main content                         Sticky summary
Co so                                Thong tin dat san
Ngay                                 Tien san
San                                  Dich vu/vat pham
Khung gio                            Tong tam tinh
Dich vu/vat pham                     Diem du kien
Thong tin khach                      CTA xac nhan
```

### 5.2. Layout Mobile

De xuat mot cot, co bottom sticky CTA:

```text
Header
Co so
Ngay
San
Khung gio
Dich vu/vat pham
Thong tin khach
Bottom sticky: Tong tien + Xac nhan dat san
```

### 5.3. Header Public

Noi dung:

- Logo hoac ten san: `Courtify`.
- Subtext: `Dat san cau long truc tuyen`.
- Button `Tra cuu lich dat`.
- Button/icon `Goi san`.

Components:

- Logo block.
- Text title.
- Icon button phone.
- Secondary button lookup.

### 5.4. Chon Co So

UI:

- Select/dropdown `Co so`.
- Card thong tin co so sau khi chon.

Fields:

- Ten co so.
- Dia chi.
- Gio mo cua.
- Hotline.

Input/button:

- Select `Chon co so`.
- Optional search input neu co nhieu co so.

Empty state:

- "Chua co co so nao dang hoat dong."

### 5.5. Chon Ngay

UI:

- Date picker.
- Quick date chips.

Inputs/buttons:

- Input type date hoac calendar popover.
- Button `Hom nay`.
- Button `Ngay mai`.
- Button `Cuoi tuan`.

States:

- Ngay dang chon.
- Ngay qua khu disabled.
- Ngay khong mo cua disabled neu co cau hinh.

### 5.6. Chon San

UI:

- Grid card san.

Court card:

- Ten san.
- Co so.
- Loai mat san.
- Trong nha/ngoai troi.
- Gia tu.
- Badge trang thai.
- Button/card selectable.

States:

- Available: border mac dinh.
- Selected: border primary, background primary tint.
- Maintenance: disabled, opacity thap.
- Inactive: disabled.

Text de xuat:

- `San A1`
- `Trong nha`
- `Synthetic`
- `Tu 150.000d/gio`

### 5.7. Chon Khung Gio

UI:

- Time slot grid.
- Moi slot la mot button kich thuoc co dinh.

Slot text:

- `06:00`
- `07:30`
- `09:00`

States:

- Con trong.
- Dang chon.
- Da dat.
- Qua gio.
- Khong kha dung.

Mau de xuat:

- Con trong: `#171717`, border `#262626`, text `#fafafa`.
- Dang chon: background `#22c55e`, text `#ffffff`.
- Da dat: background `rgba(239, 68, 68, 0.14)`, text `#ef4444`, disabled.
- Qua gio: background `#262626`, text `#737373`, disabled.
- Peak hour: them badge/outline `#f59e0b`.

Inputs/buttons:

- Slot button.
- Button `Xoa gio da chon`.
- Optional toggle `Chi hien gio con trong`.

Validation:

- Chi cho chon slot lien tiep.
- End time phai sau start time.
- Khong cho chon trung slot da dat.

### 5.8. Dich Vu/Vat Pham Dat Kem

UI:

- Section `Dich vu them`.
- Tabs: `Dich vu`, `Vat pham`.
- Search input.
- Item cards.

Item card:

- Icon.
- Ten.
- Mo ta ngan.
- Gia.
- Don vi.
- Ton kho neu la san pham.
- Stepper so luong.

Fields:

- Service:
  - Ten dich vu.
  - Gia.
  - Don vi.
  - Mo ta.

- Product:
  - Ten san pham.
  - Gia.
  - Don vi.
  - Ton kho.
  - Badge `Sap het` neu stock <= threshold.

Buttons/inputs:

- Search input `Tim dich vu hoac vat pham...`.
- Tab button `Dich vu`.
- Tab button `Vat pham`.
- Quantity stepper: `-`, numeric value, `+`.
- Button `Xoa`.

States:

- Het hang: disable stepper, badge `Het hang`.
- Sap het: badge warning.
- Da chon: border primary, quantity > 0.

Ghi chu nghiep vu:

- MVP: luu danh sach dat kem vao booking notes hoac metadata neu chua them bang.
- Ban hoan chinh: them bang `BookingAddon`.
- Khong nen tru kho ngay khi khach vua dat public.
- Tru kho khi nhan vien xac nhan ban hang/thanh toan hoa don.

### 5.9. Thong Tin Khach

Inputs:

- `Ho ten` required.
- `So dien thoai` required.
- `Email` optional.
- `Ghi chu` optional.

Validation:

- Ho ten khong rong.
- SDT 10-11 ky tu so, chap nhan format Viet Nam.
- Email dung format neu co nhap.

Helper text:

- "So dien thoai dung de tra cuu lich va tich diem, khong can dang ky tai khoan."

### 5.10. Booking Summary

Desktop: sticky sidebar.

Mobile: bottom sheet hoac section truoc CTA.

Noi dung:

- Co so.
- San.
- Ngay.
- Gio.
- Thoi luong.
- Tien san.
- Dich vu/vat pham.
- Tong tam tinh.
- Diem du kien.

Buttons:

- `Xac nhan dat san`.
- `Xoa lua chon`.

Disabled state:

- Chua chon san.
- Chua chon gio.
- Thieu ten/SDT.

Loading state:

- Button text: `Dang tao lich...`
- Disable toan bo CTA.

## 6. Man Hinh 2: Dat Thanh Cong

Route: `/book/success/:bookingId`

Muc dich: xac nhan booking da duoc ghi nhan.

### 6.1. Noi Dung

Hero/status block:

- Icon check.
- Title: `Dat san thanh cong`.
- Subtitle:
  - Neu auto confirm: `Lich cua ban da duoc xac nhan.`
  - Neu pending: `Yeu cau dat san da duoc ghi nhan va dang cho xac nhan.`

Booking info card:

- Ma dat san.
- Trang thai.
- Ten khach.
- SDT.
- Co so.
- San.
- Ngay.
- Gio.
- Tong tam tinh.
- Diem du kien.

Addon section:

- Danh sach dich vu/vat pham da chon.
- So luong.
- Tam tinh.

Policy note:

- `Ban co the doi hoac huy lich truoc gio choi toi thieu 2 gio.`
- `Diem se duoc cong sau khi hoan tat hoac thanh toan.`

### 6.2. Buttons

- Primary: `Xem chi tiet lich dat`.
- Secondary: `Dat them san`.
- Ghost: `Tra cuu lich bang SDT`.
- Icon button: `Sao chep ma dat san`.
- Icon button: `Goi san`.

### 6.3. QR/Check-In Code

Optional for MVP:

- QR code chua booking code.
- Text: `Dua ma nay cho nhan vien khi den san.`

## 7. Man Hinh 3: Tra Cuu Lich Dat

Route: `/booking-lookup`

Muc dich: nhap SDT de xem lich dat, lich su, diem.

### 7.1. Lookup Form

Inputs:

- `So dien thoai` required.
- `Ma dat san` optional.

Buttons:

- Primary: `Tra cuu`.
- Secondary: `Dat san moi`.

Helper text:

- "Nhap so dien thoai da dung khi dat san de xem lich va diem tich luy."

### 7.2. Sau Khi Tra Cuu Thanh Cong

Customer summary card:

- Ten khach.
- SDT.
- Tong luot dat.
- Tong chi tieu.
- Diem tich luy.
- Hang thanh vien neu co.

Tabs:

- `Sap toi`.
- `Da hoan thanh`.
- `Da huy`.
- `Tat ca`.

Booking list card:

- Ma booking.
- San.
- Co so.
- Ngay.
- Gio.
- Trang thai.
- Tong tien.
- Diem nhan duoc neu co.
- Add-on summary.

Buttons tren moi card:

- `Xem chi tiet`.
- `Doi lich`.
- `Huy lich`.

Button visibility:

- `Doi lich`: chi enabled neu con tren 2 gio va booking cho phep doi.
- `Huy lich`: chi enabled neu con tren 2 gio va booking cho phep huy.

### 7.3. Empty State

Neu khong tim thay SDT:

- Title: `Chua co lich dat nao`.
- Description: `So dien thoai nay chua co lich dat tren he thong.`
- Button: `Dat san ngay`.

## 8. Man Hinh 4: Chi Tiet Booking

Route: `/booking/:bookingId`

Muc dich: xem chi tiet mot booking, doi lich, huy lich.

### 8.1. Noi Dung

Header:

- Back button.
- Title: `Chi tiet lich dat`.
- Status badge.

Info sections:

- Ma booking.
- Trang thai.
- Thong tin co so.
- Thong tin san.
- Ngay gio.
- Thong tin khach.
- Dich vu/vat pham dat kem.
- Tam tinh thanh toan.
- Diem tich luy.
- Chinh sach doi/huy.

### 8.2. Buttons

- Primary: `Doi lich`.
- Danger: `Huy lich`.
- Secondary: `Dat lai lich tuong tu`.
- Ghost: `Goi san`.
- Ghost: `Quay lai`.

### 8.3. Action States

Neu con truoc gio choi tren 2 gio:

- Enable `Doi lich`.
- Enable `Huy lich`.

Neu duoi 2 gio:

- Disable `Doi lich`.
- Disable `Huy lich`.
- Hien alert warning: `Lich nay da gan gio choi. Vui long lien he san de duoc ho tro.`

Neu booking da `COMPLETED`:

- Hide/disable doi va huy.
- Hien `Lich da hoan thanh`.

Neu booking da `CANCELLED`:

- Hide/disable doi va huy.
- Hien `Lich da huy`.

## 9. Modal Doi Lich

Dung trong man chi tiet booking hoac tach thanh route rieng.

### 9.1. Noi Dung

Current booking summary:

- San hien tai.
- Ngay gio hien tai.

Inputs:

- Date picker `Ngay moi`.
- Select/card `San moi` hoac checkbox `Giu san hien tai`.
- Time slot grid `Khung gio moi`.
- Input `So dien thoai xac nhan`.
- Textarea `Ly do doi lich` optional.

Summary:

- Gio cu.
- Gio moi.
- Chenh lech tien neu co.

### 9.2. Buttons

- Primary: `Xac nhan doi lich`.
- Secondary: `Kiem tra lich trong`.
- Ghost: `Huy thao tac`.

### 9.3. Validation/Error

- SDT khong khop: `So dien thoai khong khop voi lich dat.`
- Qua 2 gio: `Chi co the doi lich truoc gio choi toi thieu 2 gio.`
- Slot trung: `Khung gio moi da co nguoi dat.`

## 10. Modal Huy Lich

### 10.1. Noi Dung

Warning block:

- Title: `Xac nhan huy lich`.
- Text: `Thao tac nay se huy lich dat cua ban.`

Inputs:

- Input `So dien thoai xac nhan`.
- Textarea `Ly do huy` optional.

Summary:

- San.
- Ngay.
- Gio.
- Tong tam tinh.

### 10.2. Buttons

- Danger: `Xac nhan huy`.
- Ghost: `Khong huy nua`.

### 10.3. Validation/Error

- SDT khong khop.
- Qua gio cho phep huy.
- Booking da check-in/hoan thanh.

## 11. Component Can Thiet Cho Designer

### 11.1. Public Header

Thanh phan:

- Logo.
- Ten thuong hieu.
- Nav link `Dat san`.
- Nav link `Tra cuu lich`.
- Button/icon `Goi san`.

Desktop:

- Height 64px.
- Max width content 1200px.

Mobile:

- Logo trai.
- Action icons phai.

### 11.2. Venue Selector

Thanh phan:

- Select/dropdown.
- Venue info card.

States:

- Default.
- Loading.
- Empty.
- Selected.

### 11.3. Court Card

Thanh phan:

- Ten san.
- Badge loai san.
- Gia tu.
- Status.
- Select state.

Kich thuoc:

- Desktop: 3-4 cards/row.
- Tablet: 2 cards/row.
- Mobile: 1 card/row.

### 11.4. Time Slot Button

Kich thuoc de xuat:

- Desktop: min width 88px, height 44px.
- Mobile: grid 3 columns, height 44px.

States:

- Available.
- Selected.
- Booked.
- Disabled.
- Peak.

### 11.5. Add-On Item Card

Thanh phan:

- Icon.
- Ten.
- Mo ta.
- Gia/don vi.
- Ton kho.
- Stepper.

States:

- Default.
- Selected quantity > 0.
- Low stock.
- Out of stock.

### 11.6. Quantity Stepper

Thanh phan:

- Icon button minus.
- Numeric value.
- Icon button plus.

Rules:

- Min 0.
- Max theo stock voi product.
- Service co the max tuy config.

### 11.7. Customer Info Form

Fields:

- Full name.
- Phone.
- Email optional.
- Notes.

States:

- Default.
- Focus.
- Error.
- Valid.

### 11.8. Booking Summary

Thanh phan:

- List rows label/value.
- Add-on mini list.
- Divider.
- Total row.
- Expected points.
- Primary CTA.

Desktop:

- Sticky top 88px.

Mobile:

- Bottom sticky mini summary.
- Full summary expandable.

### 11.9. Status Badge

Status:

- `PENDING`.
- `CONFIRMED`.
- `IN_PROGRESS`.
- `COMPLETED`.
- `CANCELLED`.

### 11.10. Points Card

Thanh phan:

- Tong diem.
- Tong luot dat.
- Tong chi tieu.
- Hang thanh vien.

## 12. Design Tokens Tu Frontend Hien Tai

Frontend hien tai dang dung dark mode voi sport green lam mau chinh. Nen client portal giu cung design system de dong bo dashboard.

### 12.1. Primary - Sport Green

| Token | Hex | Goi y su dung |
|---|---|---|
| `primary-50` | `#f0fdf4` | Nen rat nhat, highlight tren light surface neu can |
| `primary-100` | `#dcfce7` | Badge nen nhat |
| `primary-200` | `#bbf7d0` | Border thanh cong nhat |
| `primary-300` | `#86efac` | Accent phu |
| `primary-400` | `#4ade80` | Text accent sang |
| `primary-500` | `#22c55e` | Main brand, primary button, selected state |
| `primary-600` | `#16a34a` | Primary hover |
| `primary-700` | `#15803d` | Active/deep state |
| `primary-800` | `#166534` | Dark tint |
| `primary-900` | `#14532d` | Darkest tint |

### 12.2. Background

| Token | Hex | Goi y su dung |
|---|---|---|
| `background` | `#0a0a0a` | Page background |
| `background-secondary` | `#171717` | Card, modal, panel |
| `background-tertiary` | `#262626` | Input, table header, nested surface |
| `background-hover` | `#2a2a2a` | Hover state |

### 12.3. Text

| Token | Hex | Goi y su dung |
|---|---|---|
| `foreground` | `#fafafa` | Main text |
| `foreground-secondary` | `#a3a3a3` | Secondary text, labels |
| `foreground-muted` | `#737373` | Muted text, disabled copy |

### 12.4. Border

| Token | Hex | Goi y su dung |
|---|---|---|
| `border` | `#262626` | Default border |
| `border-focus` | `#22c55e` | Input focus, selected card |

### 12.5. Semantic

| Token | Hex | Goi y su dung |
|---|---|---|
| `success` | `#22c55e` | Success, available, paid |
| `warning` | `#f59e0b` | Pending, peak hour, low stock |
| `error` | `#ef4444` | Cancel, error, out of stock |
| `info` | `#3b82f6` | Confirmed, informational |

### 12.6. Booking Status

| Status | Token | Hex | UI |
|---|---|---|---|
| Confirmed | `booking-confirmed` | `#3b82f6` | Badge da xac nhan |
| In progress | `booking-in-progress` | `#22c55e` | Badge dang choi |
| Pending | `booking-pending` | `#f59e0b` | Badge cho xac nhan/thanh toan |
| Completed | `booking-completed` | `#6b7280` | Badge hoan thanh |
| Cancelled | `booking-cancelled` | `#ef4444` | Badge da huy |

## 13. Mau Component Cu The

### 13.1. Primary Button

Use:

- `Xac nhan dat san`.
- `Tra cuu`.
- `Xac nhan doi lich`.

Style:

- Background: `#22c55e`.
- Hover: `#16a34a`.
- Text: `#ffffff`.
- Border radius: `8px`.
- Height desktop: `40px` hoac `44px`.
- Height mobile CTA: `48px`.

Disabled:

- Background: `#262626`.
- Text: `#737373`.

### 13.2. Secondary Button

Use:

- `Dat san moi`.
- `Kiem tra lich trong`.
- `Xem chi tiet`.

Style:

- Background: `#171717`.
- Border: `#262626`.
- Hover background: `#2a2a2a`.
- Text: `#fafafa`.

### 13.3. Ghost Button

Use:

- `Quay lai`.
- `Huy thao tac`.
- Header nav.

Style:

- Background: transparent.
- Hover background: `#2a2a2a`.
- Text: `#a3a3a3`.
- Hover text: `#fafafa`.

### 13.4. Danger Button

Use:

- `Xac nhan huy`.
- `Huy lich`.

Style:

- Background: `#ef4444`.
- Hover: `#dc2626` neu can.
- Text: `#ffffff`.

### 13.5. Input

Style:

- Background: `#171717` hoac `#262626`.
- Border: `#262626`.
- Focus border/ring: `#22c55e`.
- Text: `#fafafa`.
- Placeholder: `#737373`.
- Radius: `8px`.
- Height: `40px` hoac `44px`.

Error:

- Border: `#ef4444`.
- Helper text: `#ef4444`.

### 13.6. Card

Style:

- Background: `#171717`.
- Border: `#262626`.
- Radius: `8px`.
- Padding: `16px`.

Selected:

- Border: `#22c55e`.
- Background: `rgba(34, 197, 94, 0.08)`.

Hover:

- Border: `rgba(34, 197, 94, 0.5)`.

### 13.7. Badge

Pending:

- Background: `rgba(245, 158, 11, 0.2)`.
- Text: `#f59e0b`.
- Border: `#f59e0b`.

Confirmed:

- Background: `rgba(59, 130, 246, 0.2)`.
- Text: `#3b82f6`.
- Border: `#3b82f6`.

Completed:

- Background: `rgba(107, 114, 128, 0.2)`.
- Text: `#9ca3af`.
- Border: `#6b7280`.

Cancelled:

- Background: `rgba(239, 68, 68, 0.2)`.
- Text: `#ef4444`.
- Border: `#ef4444`.

Low stock:

- Background: `rgba(245, 158, 11, 0.16)`.
- Text: `#f59e0b`.

Out of stock:

- Background: `rgba(239, 68, 68, 0.16)`.
- Text: `#ef4444`.

## 14. Typography

Font family hien tai:

- Sans: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`.
- Mono: `JetBrains Mono`, `monospace`.

De xuat scale:

| Usage | Size | Weight |
|---|---:|---:|
| Page title | 24px | 700 |
| Section title | 18px | 600 |
| Card title | 15-16px | 600 |
| Body | 14px | 400 |
| Label | 13-14px | 500 |
| Helper text | 12-13px | 400 |
| Button | 14px | 500-600 |
| Price/total | 18-24px | 700 |

Khong nen dung heading qua lon cho client portal vi day la tool dat san, can quet nhanh, thao tac nhanh.

## 15. Spacing & Radius

### 15.1. Spacing

| Token | Value | Usage |
|---|---:|---|
| `xs` | 4px | Icon gap, badge padding nho |
| `sm` | 8px | Button gap, field gap |
| `md` | 12px | Inline form gap |
| `lg` | 16px | Card padding |
| `xl` | 24px | Section gap |
| `2xl` | 32px | Page block gap |

### 15.2. Radius

Theo FE hien tai:

| Token | Value | Usage |
|---|---:|---|
| `sm` | 4px | Badge nho |
| `default/md` | 8px | Button, input, cards |
| `lg` | 12px | Modal/card lon |
| `xl` | 16px | Panel lon |
| `2xl` | 24px | Modal dac biet |

Khuyen nghi cho client portal:

- Button/input/card mac dinh: `8px`.
- Modal: `12px` hoac `16px`.
- Khong lam qua tron de dong bo dashboard hien tai.

## 16. Responsive Behavior

### Desktop >= 1024px

- Container max width: 1200px.
- Dat san: 2 cot, summary sticky.
- Court grid: 3-4 columns.
- Add-on grid: 3-4 columns.
- Time slot grid: auto-fit min 88px.

### Tablet 768-1023px

- Container padding 24px.
- Dat san: 1 cot hoac 2 cot tuy khong gian.
- Court grid: 2 columns.
- Add-on grid: 2 columns.

### Mobile < 768px

- Container padding 16px.
- Mot cot.
- Header compact.
- Time slot grid: 3 columns.
- Bottom sticky CTA:
  - Ben trai: tong tien.
  - Ben phai: button `Xac nhan`.
- Summary co the mo bang bottom sheet.

## 17. Loading, Empty, Error States

### Loading

- Skeleton shimmer cho card san, slot, add-on.
- Button loading spinner va text:
  - `Dang tai...`
  - `Dang tao lich...`
  - `Dang cap nhat...`

### Empty

Khong co san:

- Title: `Chua co san kha dung`.
- Description: `Vui long chon co so khac hoac ngay khac.`

Khong co slot:

- Title: `Hom nay da het gio trong`.
- Button: `Chon ngay khac`.

Khong co lich su:

- Title: `Chua co lich dat nao`.
- Button: `Dat san ngay`.

### Error

Slot vua bi dat:

- `Khung gio nay vua co nguoi dat. Vui long chon gio khac.`

SDT khong hop le:

- `Vui long nhap so dien thoai hop le.`

Qua thoi gian doi/huy:

- `Chi co the doi hoac huy lich truoc gio choi toi thieu 2 gio.`

## 18. Data Can Hien Thi Tren UI

### Venue

- `id`
- `name`
- `address`
- `phone`
- `openTime`
- `closeTime`
- `isActive`

### Court

- `id`
- `venueId`
- `name`
- `description`
- `surfaceType`
- `isIndoor`
- `status`
- `sortOrder`

### Booking

- `id`
- `courtId`
- `customerId`
- `date`
- `startTime`
- `endTime`
- `status`
- `totalAmount`
- `notes`
- `isRecurring`
- `createdAt`

### Customer

- `id`
- `name`
- `phone`
- `email`
- `membershipTier`
- `totalBookings`
- `totalSpent`
- `points`

### Product

- `id`
- `venueId`
- `name`
- `description`
- `price`
- `stock`
- `unit`
- `isActive`

### Service

- `id`
- `venueId`
- `name`
- `description`
- `price`
- `unit`
- `isActive`

## 19. De Xuat Backend/API Cho Client Portal

De giu dashboard hien tai on dinh, nen them route public rieng:

```text
GET  /api/public/venues
GET  /api/public/venues/:venueId/courts
GET  /api/public/venues/:venueId/addons
GET  /api/public/courts/:courtId/availability
POST /api/public/bookings
GET  /api/public/bookings/lookup?phone=...
GET  /api/public/bookings/:id
PATCH /api/public/bookings/:id/reschedule
POST /api/public/bookings/:id/cancel
```

### 19.1. POST `/api/public/bookings`

Request:

```json
{
  "venueId": "venue-id",
  "courtId": "court-id",
  "date": "2026-07-10",
  "startTime": "18:00",
  "endTime": "20:00",
  "customerName": "Nguyen Van A",
  "customerPhone": "0901234567",
  "customerEmail": "a@example.com",
  "notes": "Den som 10 phut",
  "addons": [
    { "type": "service", "id": "service-id", "quantity": 1 },
    { "type": "product", "id": "product-id", "quantity": 2 }
  ]
}
```

Response:

```json
{
  "success": true,
  "data": {
    "bookingId": "booking-id",
    "bookingCode": "BK202607100001",
    "status": "PENDING",
    "totalAmount": 350000,
    "estimatedPoints": 35
  }
}
```

### 19.2. Lookup By Phone

Request:

```text
GET /api/public/bookings/lookup?phone=0901234567
```

Response nen gom:

- Customer summary.
- Upcoming bookings.
- Completed bookings.
- Cancelled bookings.

## 20. Dashboard Can Bo Sung De Ho Tro Client Portal

De Client Portal hoat dong tot, dashboard nen co them:

### 20.1. Booking Source

Hien tren calendar/list:

- `Nhan vien tao`.
- `Khach tu dat`.

### 20.2. Public Booking Badge

Badge tren booking card:

- `Online`.
- `Cho xac nhan`.

### 20.3. Add-On Summary Trong Booking Detail

Trong panel chi tiet booking:

- Danh sach vat pham/dich vu khach dat kem.
- Nut `Tao hoa don`.
- Nut `Xac nhan giao/nhan dich vu`.

### 20.4. Hoa Don Tu Booking

Flow:

```text
Nhan vien mo booking
Kiem tra dich vu/vat pham
Nhan Tao hoa don
Hoa don gom tien san + addons
Khi thanh toan -> tru kho san pham + cong diem
```

### 20.5. Quan Ly Ton Kho Day Du

Trang `Kho & Dich Vu` nen them:

- Nut `Nhap/Xuat kho` tren product card.
- Tab `Bien dong kho`.
- Lich su thay doi stock.
- Ly do thay doi.
- Nguoi thao tac.

## 21. Luong Ton Kho De Xuat

Hien tai UI moi co stock tren product card. Backend da co API cap nhat stock va hoa don da co logic tru stock khi tao invoice co productItems.

De xuat nghiep vu:

### MVP

- Client chon vat pham khi dat san.
- He thong kiem tra stock hien tai de khong cho chon qua ton.
- Chua tru stock ngay khi dat.
- Khi nhan vien tao/thanh toan hoa don, stock moi bi tru.

### Ban Hoan Chinh

Them model `InventoryTransaction`:

- `id`
- `productId`
- `type`: `IMPORT`, `SALE`, `ADJUSTMENT`, `RETURN`, `DAMAGED`, `RESERVED`, `RELEASED`
- `quantity`
- `stockBefore`
- `stockAfter`
- `reason`
- `createdById`
- `bookingId`
- `invoiceId`
- `createdAt`

Them model `BookingAddon`:

- `id`
- `bookingId`
- `productId?`
- `serviceId?`
- `quantity`
- `unitPrice`
- `total`
- `status`: `REQUESTED`, `CONFIRMED`, `CANCELLED`, `FULFILLED`

## 22. Checklist UI De Thiet Ke

### Pages

- [ ] `/book` Dat san.
- [ ] `/book/success/:bookingId` Dat thanh cong.
- [ ] `/booking-lookup` Tra cuu lich.
- [ ] `/booking/:bookingId` Chi tiet booking.

### Modals

- [ ] Modal doi lich.
- [ ] Modal huy lich.
- [ ] Bottom sheet booking summary mobile.
- [ ] Optional modal chon dich vu/vat pham neu khong dat inline.

### Components

- [ ] Public header.
- [ ] Venue selector.
- [ ] Date picker.
- [ ] Court card.
- [ ] Time slot grid.
- [ ] Time slot button.
- [ ] Add-on item card.
- [ ] Quantity stepper.
- [ ] Customer info form.
- [ ] Booking summary.
- [ ] Success state.
- [ ] Lookup form.
- [ ] Customer points card.
- [ ] Booking history tabs.
- [ ] Booking list card.
- [ ] Booking detail card.
- [ ] Status badge.
- [ ] Empty state.
- [ ] Error alert.
- [ ] Loading skeleton.
- [ ] Mobile sticky CTA.

## 23. Copywriting De Xuat

### Main CTA

- `Xac nhan dat san`
- `Tra cuu lich dat`
- `Doi lich`
- `Huy lich`
- `Dat san moi`

### Helper Text

- `So dien thoai dung de tra cuu lich va tich diem, khong can dang ky tai khoan.`
- `Diem se duoc cong sau khi lich hoan tat hoac hoa don da thanh toan.`
- `Ban co the doi hoac huy lich truoc gio choi toi thieu 2 gio.`

### Error Text

- `Vui long nhap so dien thoai hop le.`
- `Khung gio nay da co nguoi dat.`
- `Chi co the doi hoac huy lich truoc gio choi toi thieu 2 gio.`
- `So dien thoai khong khop voi lich dat.`

## 24. Pham Vi MVP Nen Chot

Nen thiet ke truoc MVP nay:

1. Khach dat san bang SDT.
2. Tu tao/tim Customer theo SDT.
3. Chon dich vu/vat pham dat kem.
4. Xem lich su va diem bang SDT.
5. Xem chi tiet booking.
6. Doi lich truoc 2 gio.
7. Huy lich truoc 2 gio.
8. Diem cong sau khi booking completed hoac invoice paid.

Chua nen lam trong MVP:

- Dang ky tai khoan.
- OTP.
- Thanh toan online.
- Dat coc online.
- Hoan tien tu dong.
- Membership portal phuc tap.

## 25. Tom Tat Huong Thiet Ke

Client Portal nen la mot trai nghiem gon, nhanh, mobile-first:

- Buoc 1: Chon co so, ngay, san, gio.
- Buoc 2: Chon dich vu/vat pham them.
- Buoc 3: Nhap ten va so dien thoai.
- Buoc 4: Xac nhan va nhan ma dat san.

Tat ca du lieu khach hang duoc gom theo so dien thoai:

```text
So dien thoai -> Customer -> Booking -> Hoa don -> Diem tich luy
```

Dashboard hien tai tiep tuc la noi van hanh:

```text
Booking public -> Dashboard calendar -> Check-in -> Check-out/Hoa don -> Tru kho -> Cong diem
```

