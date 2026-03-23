export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff";
  avatarUrl?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  nameKana: string;
  phone: string;
  email: string;
  address: string;
  rank: "ブロンズ" | "シルバー" | "ゴールド" | "プラチナ";
  totalAmount: number;
  totalCount: number;
  idVerified: boolean;
  memo: string;
  createdAt: string;
}

export interface PurchaseItem {
  id: string;
  purchaseId: string;
  category:
    | "ブランドバッグ"
    | "時計"
    | "ジュエリー"
    | "貴金属"
    | "家電"
    | "楽器"
    | "カメラ"
    | "骨董品";
  name: string;
  description: string;
  quantity: number;
  price: number;
  condition: "S" | "A" | "B" | "C" | "D";
}

export interface Purchase {
  id: string;
  customerId: string;
  staffId: string;
  status: "査定中" | "承認待ち" | "買取完了" | "キャンセル";
  purchaseDate: string;
  totalAmount: number;
  location: string;
  items: PurchaseItem[];
  memo?: string;
}

export interface Inventory {
  id: string;
  purchaseItemId: string;
  name: string;
  category: string;
  status: "在庫中" | "出品中" | "売却済" | "廃棄";
  location: string;
  barcode: string;
  photosCount: number;
  cost: number;
  listedPrice?: number;
  condition: "S" | "A" | "B" | "C" | "D";
  registeredAt: string;
}

export interface Sale {
  id: string;
  inventoryId: string;
  channel: "店頭" | "ヤフオク" | "メルカリShops" | "業販";
  salePrice: number;
  saleDate: string;
  buyerInfo: string;
  staffId: string;
}

export interface Expense {
  id: string;
  purchaseId?: string;
  inventoryId?: string;
  category:
    | "交通費"
    | "送料"
    | "修理・クリーニング費"
    | "出品手数料"
    | "その他";
  amount: number;
  description: string;
  date: string;
  staffId: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: "作成" | "更新" | "削除" | "ログイン" | "ログアウト";
  targetType: string;
  targetId?: string;
  changes?: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface KPI {
  totalPurchases: number;
  totalSales: number;
  grossProfit: number;
  profitRate: number;
  inventoryCount: number;
  avgDaysToSell: number;
  repeatRate: number;
  monthlyPurchaseCount: number;
}
