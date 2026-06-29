import { FolderOpen } from "lucide-react";

export default function EmptyReportState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 dark:bg-[#1a1a1a]/50 rounded-3xl border border-dashed border-gray-200 dark:border-[#333]">
      <div className="w-16 h-16 bg-gray-100 dark:bg-[#222] rounded-full flex items-center justify-center text-gray-400 mb-4">
        <FolderOpen className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Bu tarih aralığında veri bulunamadı</h3>
      <p className="text-gray-500 max-w-md">
        Farklı bir tarih aralığı seçmeyi deneyin veya işletmeniz randevu/satış almaya başladığında burada raporlarınızı göreceksiniz.
      </p>
    </div>
  );
}
