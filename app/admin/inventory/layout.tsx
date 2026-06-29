"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Envanter", href: "/admin/inventory" },
    { name: "Katalog", href: "/admin/inventory/catalog" },
    { name: "Satış Geçmişi", href: "/admin/inventory/sales-history" },
  ];

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif text-gray-900 dark:text-white">Stok ve Envanter</h1>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${isActive 
                    ? "border-[#B5482E] text-[#B5482E]" 
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700"
                  }
                `}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}
