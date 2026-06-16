import type { AffiliateLinkCategory } from "./types";

export type AffiliateLinkSeed = {
  slug: string;
  title: string;
  description: string;
  affiliateUrl: string;
  category: AffiliateLinkCategory;
  keywords: string[];
  priority: number;
  active: boolean;
};

export const DEFAULT_AFFILIATE_LINKS: AffiliateLinkSeed[] = [
  {
    slug: "food-dog-bowls",
    title: "Thức ăn hạt cho chó",
    description: "Gợi ý sản phẩm thức ăn khô và bữa ăn tiện lợi cho chó.",
    affiliateUrl: "https://shopee.vn/search?keyword=th%E1%BB%A9c%20%C4%83n%20cho%20ch%C3%B3",
    category: "food",
    keywords: ["thuc an cho cho", "dog food", "kibble", "feeding"],
    priority: 90,
    active: true,
  },
  {
    slug: "food-cat-pate",
    title: "Pate và hạt cho mèo",
    description: "Các lựa chọn đồ ăn phù hợp cho mèo kén ăn hoặc cần đổi khẩu vị.",
    affiliateUrl: "https://shopee.vn/search?keyword=pate%20cho%20m%C3%A8o",
    category: "food",
    keywords: ["thuc an cho meo", "cat food", "pate", "nutrition"],
    priority: 80,
    active: true,
  },
  {
    slug: "clinic-vet-visit",
    title: "Tìm phòng khám thú y gần bạn",
    description: "Kết nối tới danh sách phòng khám để đặt lịch kiểm tra sớm.",
    affiliateUrl: "https://www.google.com/maps/search/ph%C3%B2ng%20kh%C3%A1m%20th%C3%BA%20y",
    category: "clinic",
    keywords: ["phong kham thu y", "vet clinic", "clinic", "vet"],
    priority: 100,
    active: true,
  },
  {
    slug: "health-first-aid-kit",
    title: "Bộ sơ cứu thú cưng",
    description: "Dụng cụ cơ bản để hỗ trợ theo dõi và sơ cứu ban đầu.",
    affiliateUrl: "https://shopee.vn/search?keyword=b%E1%BB%99%20s%C6%A1%20c%E1%BB%A9u%20th%C3%BA%20c%C6%B0ng",
    category: "health",
    keywords: ["first aid", "health kit", "suc khoe thu cung", "sick"],
    priority: 70,
    active: true,
  },
  {
    slug: "spa-grooming-kit",
    title: "Bộ grooming và spa tại nhà",
    description: "Chải lông, tắm, cắt móng và chăm da nhẹ nhàng tại nhà.",
    affiliateUrl: "https://shopee.vn/search?keyword=grooming%20th%C3%BA%20c%C6%B0ng",
    category: "spa",
    keywords: ["spa thu cung", "grooming", "cat long", "cat mong"],
    priority: 95,
    active: true,
  },
  {
    slug: "spa-soft-brush",
    title: "Lược chải lông mềm",
    description: "Phù hợp cho bé nhạy cảm với grooming hoặc rụng lông nhiều.",
    affiliateUrl: "https://shopee.vn/search?keyword=l%C6%B0%E1%BB%A3c%20ch%E1%BA%A3i%20l%C3%B4ng%20th%C3%BA%20c%C6%B0ng",
    category: "grooming",
    keywords: ["brush fur", "grooming", "cham soc long"],
    priority: 85,
    active: true,
  },
  {
    slug: "clothing-raincoat",
    title: "Áo mưa cho thú cưng",
    description: "Giữ bé khô ráo khi đi dạo trong thời tiết ẩm hoặc mưa.",
    affiliateUrl: "https://shopee.vn/search?keyword=%C3%A1o%20m%C6%B0a%20th%C3%BA%20c%C6%B0ng",
    category: "clothing",
    keywords: ["ao mua", "raincoat", "pet clothing"],
    priority: 88,
    active: true,
  },
  {
    slug: "training-clicker-kit",
    title: "Bộ huấn luyện clicker",
    description: "Hỗ trợ huấn luyện hành vi cơ bản bằng tín hiệu ngắn và thưởng đúng lúc.",
    affiliateUrl: "https://shopee.vn/search?keyword=clicker%20hu%E1%BA%A5n%20luy%E1%BB%87n%20th%C3%BA%20c%C6%B0ng",
    category: "training",
    keywords: ["huan luyen", "training", "obedience", "behavior"],
    priority: 82,
    active: true,
  },
  {
    slug: "accessories-comfort-bed",
    title: "Giường và phụ kiện nghỉ ngơi",
    description: "Ổ nằm, dây dắt, vòng cổ và đồ chơi an toàn cho bé.",
    affiliateUrl: "https://shopee.vn/search?keyword=gi%C6%B0%E1%BB%9Dng%20th%C3%BA%20c%C6%B0ng",
    category: "accessories",
    keywords: ["bed", "collar", "leash", "carrier", "toy"],
    priority: 75,
    active: true,
  },
  {
    slug: "general-basic-care",
    title: "Bộ chăm sóc cơ bản",
    description: "Khăn, bàn chải, bát ăn và các vật dụng nền tảng cho mọi nhà có thú cưng.",
    affiliateUrl: "https://shopee.vn/search?keyword=ph%E1%BB%A5%20ki%E1%BB%87n%20th%C3%BA%20c%C6%B0ng",
    category: "general",
    keywords: ["pet care", "thu cung", "boss", "dog", "cat"],
    priority: 60,
    active: true,
  },
];
