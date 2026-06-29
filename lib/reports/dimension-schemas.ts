export type ReportDimension =
  | "SHOP" | "BARBER" | "SERVICE" | "PRODUCT" | "BOOKING_TYPE" | "CUSTOMERS" | "SOURCE";

export type ReportColumn =
  | "TOTAL" | "CANCELLED" | "NO_SHOW" | "CUSTOMERS" | "AVG_TICKET" | "HOURS_SOLD" | "NEW_SIGNUPS";

interface DimensionConfig {
  id: ReportDimension;
  label: string;
  tableTitle: (count: number) => string;
  groupLabel: string;
  visibleColumns: ReportColumn[];
  rowsEndpoint: string;
  icon?: string;
}

export const DIMENSION_CONFIGS: Record<ReportDimension, DimensionConfig> = {
  SHOP: {
    id: "SHOP", label: "Dükkan",
    tableTitle: () => "Dükkan Tarafından Raporlama",
    groupLabel: "Dükkan",
    visibleColumns: ["TOTAL", "CANCELLED", "NO_SHOW", "CUSTOMERS", "AVG_TICKET", "HOURS_SOLD"],
    rowsEndpoint: "/reports/by-shop",
  },
  BARBER: {
    id: "BARBER", label: "Barber",
    tableTitle: () => "Barber Tarafından Raporlama",
    groupLabel: "Barber",
    visibleColumns: ["TOTAL", "CANCELLED", "NO_SHOW", "CUSTOMERS", "AVG_TICKET", "HOURS_SOLD"],
    rowsEndpoint: "/reports/by-barber",
  },
  SERVICE: {
    id: "SERVICE", label: "Hizmet",
    tableTitle: () => "Hizmet Tarafından Raporlama",
    groupLabel: "Hizmet",
    visibleColumns: ["TOTAL", "CANCELLED", "NO_SHOW", "CUSTOMERS", "AVG_TICKET", "HOURS_SOLD"],
    rowsEndpoint: "/reports/by-service",
  },
  PRODUCT: {
    id: "PRODUCT", label: "Ürün",
    tableTitle: () => "Ürün satışları",
    groupLabel: "Ürün",
    visibleColumns: ["TOTAL", "CANCELLED", "AVG_TICKET"],
    rowsEndpoint: "/reports/by-product",
  },
  BOOKING_TYPE: {
    id: "BOOKING_TYPE", label: "Randevu Tipi",
    tableTitle: () => "Randevu Tipine Göre Raporlama",
    groupLabel: "Randevu Tipi",
    visibleColumns: ["TOTAL", "CANCELLED", "CUSTOMERS", "AVG_TICKET"],
    rowsEndpoint: "/reports/by-booking-type",
  },
  SOURCE: {
    id: "SOURCE", label: "Kaynak",
    tableTitle: () => "Kaynak Tarafından Raporlama",
    groupLabel: "Kaynak",
    visibleColumns: ["TOTAL", "CANCELLED", "NO_SHOW", "CUSTOMERS", "AVG_TICKET", "HOURS_SOLD"],
    rowsEndpoint: "/reports/by-source",
  },
  CUSTOMERS: {
    id: "CUSTOMERS", label: "Müşteriler",
    tableTitle: () => "Yeni Müşteriler",
    groupLabel: "Kategori",
    visibleColumns: ["NEW_SIGNUPS"],
    rowsEndpoint: "/reports/new-customers",
  },
};

export const COLUMN_LABELS: Record<ReportColumn, string> = {
  TOTAL: "Genel Toplam",
  CANCELLED: "İptal edildi",
  NO_SHOW: "Cevapsız randevular",
  CUSTOMERS: "Müşteriler",
  AVG_TICKET: "Ortalama fatura",
  HOURS_SOLD: "Satılan saatler",
  NEW_SIGNUPS: "Yeni kayıt",
};
