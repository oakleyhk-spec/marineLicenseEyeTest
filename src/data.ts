export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  duration: string;
  suitableFor: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'criteria' | 'color' | 'booking';
}

export interface ColorTestItem {
  id: number;
  number: string;
  options: string[];
  svgSeed: string; // Used to seed the custom Ishihara generator
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'pleasure-vessel-2',
    name: '遊樂船隻二級操作人視力測驗',
    price: 160,
    description: '專為考取遊樂船隻二級操作人證明書（俗稱二級遊艇牌、遊樂船牌）的市民而設。',
    suitableFor: '準備考取二級遊樂船牌、快艇、水上電單車之人士',
    duration: '15 - 20 分鐘',
    features: [
      '提供海事處指定格式「視力測驗證明書」',
      '合格後即場領取，即日發出',
      '由香港第一部分註冊眼科專業人員監理並簽發',
      '遠距離視力檢測 (近視/遠視/散光之矯正視力)',
      '基本辨色能力測試',
      '提供表格 M.D. 687 及相關視力證明附件填寫輔助'
    ]
  },
  {
    id: 'local-master-renewal',
    name: '本地船隻船長執照續期 / 一級船長驗眼',
    price: 240,
    description: '專為本地營業船隻、貨船、漁船、一級/二級/三級本地船隻操作人續期或升級而設。',
    suitableFor: '本地船長、營業船隻操作人、需定期續期之在職海員',
    duration: '20 - 25 分鐘',
    features: [
      '適合一級、二級及三級本地船隻操作人證明書',
      '提供海事處指定格式「視力測驗證明書」',
      '由香港第一部分註冊眼科專業人員監理並簽發',
      '遠距離視力檢測 (近視/遠視/散光之矯正視力)',
      '基本辨色能力測試 ',
      '合格即日取證，有效期 12-24 個月，可直接遞交往海事處',
      '提供表格 M.D. 688 及相關視力證明附件填寫輔助'
    ]
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: '戴眼鏡或隱形眼鏡可以參加船牌驗眼嗎？',
    answer: '可以。香港海事處接受申請人以「矯正視力」參與測驗。如果您平時有近視、遠視或散光，在驗眼當天必須配戴您常用的眼鏡或隱形眼鏡前來。只要配戴眼镜後的矯正視力達到海事處規定的合格標準，即可成功簽發「視力測驗證明書」。'
  },
  {
    id: 'faq-2',
    category: 'color',
    question: '海事處對「色盲色弱」的要求是什麼？如果我有色弱還能考船牌嗎？',
    answer: '在海上航行時，準確辨別各類船隻的「航行燈」（紅燈、綠燈、白燈）對避碰及航行安全至關重要。海事處規定，申請人必須具備足夠的辨色能力，能清晰分辨紅、綠、白三色。在測試中，我們會使用國際標準的 Ishihara 辨色圖譜對您進行檢測。只要能符合海事處對於分辨紅/綠兩大主色燈號的基本安全要求即可。如果您有輕微色弱，大部分情況下仍然能通過基礎測試，建議隨時預約前來，由註冊視光師為您進行專業評估。'
  },
  {
    id: 'faq-3',
    category: 'criteria',
    question: '視力測驗證明書的有效期有多久？',
    answer: '根據海事處的現行規定，由認可註冊視光師或註冊醫生簽署並簽發的「視力測驗證明書」，自簽發日起計通常有 12-24 個月的有效期。市民必須在發出後的有效期內，將該證明書連同您的執照申請表（或續期表格）一併遞交至海事處辦理。如果超過該期限未遞交，該證明書則會失效，需要重新接受測驗。'
  },
  {
    id: 'faq-4',
    category: 'general',
    question: '驗眼當天我需要攜帶什麼文件？',
    answer: '驗眼當天您只需要攜帶：\n1. 您的香港身份證（正本）\n2. 常用眼鏡或隱形眼鏡（如適用）\n\n我們中心會為您預備及填好海事處規格的「視力測驗證明書」以及相關結果附件，您無需自行列印複雜的表格。'
  },
  {
    id: 'faq-5',
    category: 'booking',
    question: '如何預約服務？預約流程如何？',
    answer: '您可以透過我們網站的線上預約系統，極速登記並預約逢星期三的特快驗眼時段。同時，我們支援 WhatsApp 特快諮詢與預約，讓您無憂前來輕鬆完成測驗。'
  },
  {
    id: 'faq-6',
    category: 'criteria',
    question: '如果不合格會怎麼辦？有退款或重新測驗機會嗎？',
    answer: '若您的視力在初次測試時因眼睛疲勞、屈光度數不合或度數偏差等原因暫未達標，不用擔心。我們的專業視光師會仔細分析原因，並盡量提出專業的參考意見（例如調整眼鏡度數等），以助您能順利通過重新測驗，成功考取船牌。'
  }
];

export const COLOR_TESTS: ColorTestItem[] = [
  {
    id: 1,
    number: '12',
    options: ['12', '15', '2', '看不清楚'],
    svgSeed: 'ishihara_12'
  },
  {
    id: 2,
    number: '74',
    options: ['74', '21', '71', '看不清楚'],
    svgSeed: 'ishihara_74'
  },
  {
    id: 3,
    number: '6',
    options: ['5', '6', '8', '看不清楚'],
    svgSeed: 'ishihara_6'
  },
  {
    id: 4,
    number: '29',
    options: ['70', '29', '28', '看不清楚'],
    svgSeed: 'ishihara_29'
  }
];

export interface OfficeBranch {
  name: string;
  address: string;
  transport: string;
  phone: string;
  whatsapp: string;
  mapEmbedUrl?: string;
  hours: string[];
}

export const OFFICE_BRANCHES: OfficeBranch[] = [
  {
    name: '尖沙咀加拿芬廣場中心',
    address: '九龍尖沙咀加拿芬道加拿芬廣場802室',
    transport: '港鐵尖沙咀站 D2 或 B2 出口步行僅 1 分鐘（加拿芬廣場）',
    phone: '+852 5132 6417',
    whatsapp: '+852 5132 6417',
    hours: [
      '逢星期三：上午11:00至下午5:30'
    ]
  }
];
