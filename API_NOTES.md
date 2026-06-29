# API Notes & REST Contracts

## Promosyonlar (İndirimler ve Ödüller)

```http
GET    /api/promotions                   # Tüm promosyonları getir
GET    /api/promotions/:id               # Tekil promosyon detayı
POST   /api/promotions                   # Yeni promosyon oluştur
PATCH  /api/promotions/:id               # Promosyon güncelle (aktif/pasif yapma vb.)
```

## Sadakat (Loyalty)

```http
GET    /api/loyalty/tiers                # Sadakat seviyelerini getir
PUT    /api/loyalty/tiers                # Tüm merdiveni (sıralama ve eşikler dahil) toplu güncelle
GET    /api/loyalty/points-rule          # Puan kazanım kuralı (1₺ = 1 puan vb.)
PATCH  /api/loyalty/points-rule          # Puan kazanım kuralını güncelle
GET    /api/loyalty/members              # Müşteri sadakat listesi (search, tier, sort parametreli)
GET    /api/loyalty/members/:customerId  # Tekil müşteri detayı
GET    /api/loyalty/members/:id/ledger   # Puan geçmişi (kazanım/harcama logları)
POST   /api/loyalty/members/:id/adjust   # Manuel puan ekle/düş
```

## Raporlar (Analitik)

```http
# Tablo Verisi Çekme
# dimension: SHOP, BARBER, SERVICE, PRODUCT, BOOKING_TYPE, SOURCE, CUSTOMERS
GET /api/reports/table?dimension=SERVICE&from=2026-03-01&to=2026-06-27

# Grafik Serisi Çekme (D3 Line/Area chart için)
# metric: VALUE, BOOKINGS_COUNT, NEW_CUSTOMERS
# granularity: DAILY, WEEKLY, MONTHLY, YEARLY
# dimension (opsiyonel): Hangi boyuta göre kırılım yapılacağı
GET /api/reports/chart?metric=VALUE&granularity=MONTHLY&from=2026-03-01&to=2026-06-27&dimension=SERVICE

# Dışa Aktarma (Export) Endpoint'i
# format: csv, xlsx
# Büyük veri setlerinde tablo özet verisi yerine tam veriyi backend üzerinden dışa aktarır
GET /api/reports/export?dimension=SHOP&groupKey=BerberEskisehir&from=2026-03-01&to=2026-06-27&format=csv
```

## Personel Çalışma Saatleri Raporu (Staff Schedule)

```http
# Tek Personel Raporu
# weekStartDay: Sadece groupBy=WEEK ise anlamlıdır (MON, TUE vb.)
# monthStartDayOfMonth: Sadece groupBy=MONTH ise anlamlıdır (1-31)
GET    /api/staff/:staffId/schedule-report?year=2026&groupBy=MONTH&monthStartDayOfMonth=1

# Çoklu Personel Karşılaştırma Raporu
GET    /api/staff/schedule-report/compare?staffIds=id1,id2,id3&year=2026&groupBy=MONTH

# İnline Güncelleme (Tekil gün vardiyası)
# body: { status: "SCHEDULED" | "CLOSED" | "DAY_BLOCKED", shiftStart: "09:00", shiftEnd: "18:00" }
PATCH  /api/staff/:staffId/shifts/:date

# Toplu Güncelleme (Gelecek Özellik)
POST   /api/staff/:staffId/shifts/bulk
```

## İşletme Yönetim Merkezi (Benim İşim)

```http
# Ana Şube Listesi
GET    /api/business/shops
POST   /api/business/shops                          (yeni mağaza ekle)
DELETE /api/business/shops/:shopId

# Şube Detay Güncellemeleri
PATCH  /api/business/shops/:shopId/working-hours
PATCH  /api/business/shops/:shopId/address
POST   /api/business/shops/:shopId/contact-info
DELETE /api/business/shops/:shopId/contact-info/:id

# Personel (Barber) Yönetimi
GET    /api/business/shops/:shopId/barbers
POST   /api/business/shops/:shopId/barbers          (wizard'ın son adımı)
PATCH  /api/business/shops/:shopId/barbers/:barberId
DELETE /api/business/shops/:shopId/barbers/:barberId

# Hizmet (Service) Yönetimi
GET    /api/business/shops/:shopId/barbers/:barberId/services
POST   /api/business/shops/:shopId/barbers/:barberId/services
PATCH  /api/business/shops/:shopId/barbers/:barberId/services/:serviceId
PUT    /api/business/shops/:shopId/barbers/:barberId/services/reorder
       body: { orderedServiceIds: string[] }     (sürükle-bırak sıralama)
DELETE /api/business/shops/:shopId/barbers/:barberId/services/:serviceId

# Abonelik
GET    /api/business/shops/:shopId/subscription
```

> **onlineBookingEnabled Notu:**
> `ServiceRow` üzerindeki hap (pill) şeklindeki hızlı geçiş butonu (Evet/Hayır) ile `ServiceEditModal` içindeki açılır menü aynı state'i (`onlineBookingEnabled`) hedeflemektedir. Ancak modal içindeki dropdown'da "Sadece Yönetici" gibi üçüncü bir opsiyon tasarlanırsa, API'nin bunu salt bir `boolean` yerine üç-durumlu bir `Enum` (örn: `ONLINE_ALL`, `ADMIN_ONLY`, `OFFLINE`) olarak alacak şekilde güncellenmesi gerekmektedir. Şu anki mock sistemde `boolean` (true/false) olarak bırakılmıştır.

