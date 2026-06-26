/*
 * data.js — 黃金海岸馬拉松 2026 旅行網站的單一資料來源
 *
 * 維護方式：
 *   - 全部內容都在這支檔案，Neil 可直接編輯，不需要 build step。
 *   - 新增照片：把檔案放進 assets/photos/，再到 gallery 區塊把檔名補上。
 *   - 更新財務：只填分類總額，不要放逐筆明細。
 *
 * 公開原則：只放低敏資訊。
 *   不放：領隊完整電話、房號、護照/簽證/帳戶/信用卡、逐筆消費、私人備忘。
 *   有用但不適合公開的，用 PRIVATE_NOTE 字串提示去看私人備忘或原始 PDF。
 */

const PRIVATE_NOTE = '詳細聯絡資訊請看私人備忘或原始 PDF。';

window.TRIP_DATA = {
  /* ---------------------------------------------------------------- 旅程主體 */
  trip: {
    title: 'Gold Coast Marathon',
    subtitle: '東澳黃金海岸馬拉松旅行',
    packageName: '紐澳假期 · 東澳黃金馬拉松 6+1 天',
    dateStart: '2026-07-02',
    dateEnd: '2026-07-08',
    route: 'TPE → BNE → Gold Coast',
    cities: ['布里斯本 Brisbane', '黃金海岸 Gold Coast'],
    marathonDate: '2026-07-05',
    tagline: '一個人把訓練帶到南半球，跑一場冬天的海岸全馬。',
    meaning:
      '這不是旅行社的廣告頁，是我自己的跑步旅行紀錄。出發前拿來查行程，旅行中拿來記錄，回來後拿來回味。把一段練了很久的路，放到地球另一邊的冬天去完成。',
  },

  /* ---------------------------------------------------------------- 行程須知（整理自領隊 LIST，公開安全版） */
  essentials: {
    gather: '2026-07-02 上午 06:40 集合（提早 2.5 小時）· 桃園機場第 2 航廈 長榮 16 號後方團體櫃台',
    timezone: '昆士蘭（布里斯本／黃金海岸）比台灣快 2 小時；澳洲冬令、不實施日光節約',
    mustDo: [
      '★ 申請澳洲 ETA 電子簽證（個人自辦、約 A$20）——沒辦或被移民局拒發就無法入境，這件最優先！',
      '確認護照效期 6 個月以上（依回程日計算）',
      '準備小費：全程 USD72/人（領隊統一收）＋ 行李服務員每件約 USD1',
      '換好澳幣＋帶些美金（小費以美金支付）',
      '如需特殊餐食（素食等），出發前 7–14 個工作天告知業務',
      '行動電源／鋰電池放手提、不可託運，航程全程禁用與充電',
      '自備牙刷、牙膏、拖鞋、刮鬍刀（飯店不提供）',
      '自行投保海外旅平險（含意外醫療、海外突發疾病、緊急救援、旅遊不便）',
      '入境澳洲：肉、蛋、奶、種子、蔬果一律不帶或誠實申報（違者最高罰 A$50,000、須上法庭）',
    ],
    feeExcludes: [
      '單人房差價',
      '領隊及司機小費 全程 USD72/人',
      '澳洲電子簽證 A$20（個人自辦）',
      '午晚餐酒水、電話、洗衣、房間 mini bar 等私人開銷',
      '行程未註明的自選項目',
    ],
    gifts: ['澳洲網卡（1 天 1G，用完降速）', '與無尾熊合照一張', '澳洲轉換插頭一個'],
    baggage: '長榮國際段：託運 23kg × 2 件、手提 7kg × 1 件；瑞士刀、指甲刀勿放隨身行李。',
    emergency: '緊急可聯絡 駐布里斯本／雪梨台北經濟文化辦事處；當地報警/救護 000。',
  },

  /* ---------------------------------------------------------------- 航班 */
  flights: {
    note: '航班代號與表定時間可先放；登機門、報到櫃台、實際機型會變動，出發前再查。',
    segments: [
      {
        code: 'BR315',
        airline: '長榮航空 EVA Air',
        from: '桃園 TPE',
        to: '布里斯本 BNE',
        depart: '2026-07-02 09:10',
        arrive: '2026-07-02 20:00',
        dir: '去程',
      },
      {
        code: 'BR316',
        airline: '長榮航空 EVA Air',
        from: '布里斯本 BNE',
        to: '桃園 TPE',
        depart: '2026-07-06 22:15',
        arrive: '2026-07-07 05:05 (+1)',
        dir: '回程',
      },
    ],
    // 出發前手動補：實際資訊會變動，不寫死
    manualFields: [
      { label: '報到櫃台', value: null },
      { label: '登機門', value: null },
      { label: '實際機型', value: null },
      { label: '座位', value: null },
    ],
    seatTips: [
      '長程經濟艙若可選位，優先走道位，方便補水、上廁所、伸展。',
      '想睡且不常起身，可考慮靠窗位。',
      '避開廁所旁、廚房旁與最後一排，通常較吵、椅背角度也可能受限。',
      '若有加價選位，可看逃生門排或前排，但要先確認規定與費用。',
      '實際推薦座位等機型確認後，再對照官方座位圖。',
    ],
    links: [
      { label: '桃園機場出發航班查詢', url: 'https://www.taoyuan-airport.com/flight_depart' },
      { label: '長榮航空 全球機場資訊', url: 'https://www.evaair.com/en-tw/fly-prepare/at-the-airport/worldwide-airports/' },
      { label: '長榮 787-10 機型/座位圖', url: 'https://www.evaair.com/en-us/fly-prepare/our-fleets/passenger-airplanes/787-10/' },
      { label: '長榮 777-300ER 機型/座位圖', url: 'https://www.evaair.com/en-tw/fly-prepare/our-fleets/passenger-airplanes/777-300ER/' },
      { label: 'FlightAware 追蹤 BR315', url: 'https://www.flightaware.com/live/flight/EVA315' },
    ],
  },

  /* ---------------------------------------------------------------- 飯店 */
  hotels: [
    {
      key: 'grand-chancellor',
      name: 'Hotel Grand Chancellor Brisbane',
      city: '布里斯本',
      address: '23 Leichhardt St, Brisbane QLD 4000',
      nights: '2026-07-02 第一晚',
      facilities: ['免費 Wi-Fi', '24 小時櫃台', '屋頂溫水泳池', '停車（可能付費）', '客房服務', '禁菸房型'],
      reminders: [
        '抵達第一晚，重點是睡眠、補水、整理全馬裝備。',
        '有空就先確認早餐時間、退房時間、叫車與附近便利店。',
      ],
      links: [
        { label: '官方設施頁', url: 'https://www.grandchancellorhotels.com/hotel-grand-chancellor-brisbane/hotel-information/services-and-facilities' },
        { label: '官方飯店頁', url: 'https://www.grandchancellorhotels.com/hotel-grand-chancellor-brisbane' },
      ],
    },
    {
      key: 'mercure',
      name: 'Mercure Gold Coast Resort',
      city: '黃金海岸',
      address: 'Palm Meadows Drive, Palm Meadows, Gold Coast QLD 4211',
      nights: '7/03–7/05 賽前與賽後主住宿',
      facilities: ['兩座泳池', '網球場', 'SPA', '健身中心', '高爾夫練習場', 'The Green 餐廳', 'Wi-Fi / 停車以官方訂房頁為準'],
      reminders: [
        '賽前在房內標一個「裝備攤開區」，把全馬配備一次擺好。',
        '賽後恢復：冰敷、補水、伸展、睡眠。',
        '飯店不在衝浪者天堂正中心，外出交通看團體安排或叫車。',
      ],
      links: [
        { label: '官方網站', url: 'https://www.mercuregoldcoastresort.com.au/' },
        { label: 'Accor 官方頁', url: 'https://all.accor.com/hotel/9052/index.en.shtml' },
      ],
    },
  ],

  /* ---------------------------------------------------------------- 每日行程 */
  itinerary: [
    {
      date: '2026-07-02', weekday: '週四', tag: '出發',
      city: '桃園 → 布里斯本',
      summary: '飛越赤道，落地南半球的冬天。',
      activities: ['BR315 桃園 09:10 起飛', '布里斯本 20:00 落地', '入住 Hotel Grand Chancellor Brisbane'],
      meals: '午／晚：機上輕食',
      stay: 'Hotel Grand Chancellor Brisbane',
      notes: '長程飛行記得多補水、起身走動；落地先睡好，調整時差。',
    },
    {
      date: '2026-07-03', weekday: '週五', tag: '布里斯本',
      city: '布里斯本市區',
      summary: '城市暖身日，傍晚移往黃金海岸。',
      activities: ['南岸公園 South Bank', '市政廳 City Hall', '故事橋 Story Bridge', '庫莎山 Mt Coot-tha', '賽會場報到', '入住 Mercure Gold Coast Resort'],
      meals: '午：中式七菜一湯／晚：義大利分享餐',
      stay: 'Mercure Gold Coast Resort',
      notes: '賽前兩天，走路觀光即可，不要久站操腿。報到拿物資、確認賽事動線。',
    },
    {
      date: '2026-07-04', weekday: '週六', tag: '賽事日 · 非主賽',
      city: '黃金海岸',
      summary: '團體半馬與 10K 日，我休息養腿。',
      activities: ['半馬與 10K 相關接送（Neil 非主賽事）', '天堂鄉農莊 Paradise Country', '神仙灣 Sanctuary Cove', '入住 Mercure Gold Coast Resort'],
      meals: '午：天堂鄉農莊 BBQ／晚：自助晚餐',
      stay: 'Mercure Gold Coast Resort',
      notes: '全馬前一天：吃好、喝足、早睡，腿留給明天。裝備今晚先全部攤開檢查。',
    },
    {
      date: '2026-07-05', weekday: '週日', tag: '全馬日 · 主賽事',
      city: '黃金海岸',
      summary: '今天是主場：42K 全程馬拉松。',
      activities: ['Neil 跑全馬 42K', '太平洋購物中心 Pacific Fair', 'SkyPoint 觀景台', '直升機遊黃金海岸', '入住 Mercure Gold Coast Resort'],
      meals: '午：自理（方便比賽）／晚：西式牛排套餐',
      stay: 'Mercure Gold Coast Resort',
      notes: '冬天清晨偏冷，賽前準備拋棄式外套保暖。完賽後先恢復，再排觀光。',
      highlight: true,
    },
    {
      date: '2026-07-06', weekday: '週一', tag: '山城 · 返程',
      city: '黃金海岸 → 布里斯本機場',
      summary: '山城藝術小鎮、酒莊與最後採買，夜班機回家。',
      activities: ['鷹高藝術小鎮 Tamborine Mountain / Eagle Heights', '藍騰酒莊', '免稅店', '海港城購物中心 Harbour Town', '布里斯本機場', 'BR316 22:15 起飛'],
      meals: '午：藍騰酒莊澳式漢堡／晚：中式七菜一湯',
      stay: '夜間航班',
      notes: '夜班機，白天行程偏輕鬆。完賽後第二天，逛街用慢步調。',
    },
    {
      date: '2026-07-07', weekday: '週二', tag: '回台',
      city: '抵達桃園',
      summary: '清晨落地，旅程正式結束。',
      activities: ['BR316 桃園 05:05 抵達', '入境、提領行李、返家'],
      meals: '—',
      stay: '回家',
      notes: '紅眼航班，回家先補眠。',
    },
    {
      date: '2026-07-08', weekday: '週三', tag: '收尾',
      city: '台灣 · 在家',
      summary: '保留給整理、恢復與旅行後補記。',
      activities: ['整理行李與照片', '身體恢復', '回來後把日誌補完'],
      meals: '—',
      stay: '在家',
      notes: '把這趟的觀察、身體狀態、最值得記住的事，趁記憶還新時寫下來。',
    },
  ],

  /* ---------------------------------------------------------------- 馬拉松 */
  race: {
    name: 'ASICS Gold Coast Marathon 2026',
    eventDate: '2026-07-05',
    distance: '全程馬拉松 42.195K',
    official: 'https://goldcoastmarathon.com.au/',
    overview:
      '黃金海岸馬拉松是南半球的冬季賽事，沿海岸線出發，路線平坦、以好天氣與快速賽道聞名。7/04 的半馬與 10K 是團體賽事日，我的主賽事是 7/05 的全馬 42K。',
    goal: {
      target: '約 5h30 完賽', // run-walk 完賽策略
      paceNote: '策略核心：寧慢起、不要快崩，run-walk 從第 1 公里就開始（別等累了才走）。冬季涼溫（約 8–18°C）對全馬有利，前段壓住心率與配速，後段靠主動走路換取不暴崩。目標是完賽，不是 PB。',
      pacePlan: {
        note: 'run-walk 完賽計畫（下表配速為含走路的實際平均）。預估完賽約 5h18（策略順利）~ 5h37（偏慢），關門 7 小時有 1.3–1.7 小時緩衝。',
        phases: [
          { km: '0–21K', ratio: '跑 8 走 1', pace: '實際約 7:00/km', hr: '心率壓 <160', tip: '起跑務必忍住別衝' },
          { km: '21–32K', ratio: '跑 6 走 1', pace: '實際約 7:35/km', hr: '心率 <165', tip: '開始覺得累很正常' },
          { km: '32–42K', ratio: '跑 5 走 2', pace: '實際約 8:40/km', hr: '過 170 就走一段', tip: '完賽優先、補給防抽筋' },
        ],
        fuel: '能量膠建議每 5K 一支（≈每 40 分，剛好對齊 Fuel X 站，好記又好沖），全程約 8 支；每 7.5K（≈1 小時）偏少、32K 後容易空。補水＋電解質每站都進，32K 後尤其防抽筋。現場膠只在 30K 站且限量，務必自備。',
        pacers: '官方配速員（GCM Pacers）會舉氣球＋背號標時間，依「淨時間（晶片計時）」配速、目標讓你比設定時間快約 30 秒完賽。配速組有 4:00 / 4:15 / 4:30 / 4:45 / 5:00 / 5:30 / 6:00 / 6:40。你可在起跑區找 5:30 氣球當參考，但 run-walk 策略下仍以自己節奏為主、把它當上限就好。',
      },
    },
    gear: [
      '比賽鞋（已習慣、已試跑過長距離）',
      '排汗上衣 + 短褲',
      '壓縮小腿套 / 襪（看習慣）',
      '運動手錶（GPS、心率）',
      '號碼布、別針 / 號碼帶',
      '能量膠 × 依補給計畫',
      '防曬、凡士林 / 止磨膏',
      '賽前保暖：拋棄式外套或舊衣（冬天清晨冷）',
      '帽子 / 太陽眼鏡（日出後）',
    ],
    fueling: [
      '賽前 2–3 小時正常早餐，賽前最後補一次水。',
      '依配速計畫每 30–45 分鐘補一支能量膠（自備，現場膠只在 30K 站且限量）。',
      '善用補給站補水/運動飲料，天氣涼也不要漏喝。',
      '賽前 48 小時別吃消炎止痛藥（如布洛芬 ibuprofen）、賽前一天起避免能量飲料／酒／咖啡因，降低脫水與橫紋肌溶解風險。',
      '號碼布背面務必填緊急聯絡人。（國際選手）救護車送園區醫療站免費，但送院外醫院 QAS 會向國際／外州選手收費——確認你的旅平／醫療險有涵蓋。',
      '完賽後 30 分鐘內補蛋白質與碳水，開始恢復。',
    ],
    raceDay: [
      '冬季清晨偏冷，提早到、保暖到最後一刻再脫拋棄式外套。',
      '確認起跑分區、寄物、廁所動線。',
      '前半段壓住配速，不要被現場氣氛帶快。',
      '不要戴罩耳式耳機／AirPods（安全規定，要聽得到工作人員與急救指示）；想聽音樂用骨傳導或開放式耳機。',
      '靠左跑、超車才靠右；要停下移到左側，別停在路中央。補給站杯子丟在站後約 50 公尺的白色大袋，膠包裝也丟進桶子別亂丟（會滑）。',
      '終點通道持續前進、不要停下自拍（沿途與終點都有官方照）；先進 Recovery 補給，再領完賽衣與獎牌。',
      '完賽先補給、伸展、緩走，再回飯店冰敷恢復。',
    ],
    // 以下為 2026 官方賽事資訊（來源 goldcoastmarathon.com.au，2026-06-20 查）
    course: {
      certified: 'AIMS 認證 · 澳洲最平最快路線之一',
      startFinish: '起終點同一園區：Broadwater Parklands, Marine Parade, Southport（Race Precinct）',
      description: '海岸線出發，先往南到 Miami 折返點，再往北一路到 Runaway Bay，最後回到 Southport、終點通道就在 Broadwater 海濱旁。',
      elevation: '總爬升約 62 公尺（幾乎全平）',
      beachside: '約 29 公里沿海岸跑',
      aidStations: '全程 16 站、約每 2.5K 一站：8 個補給站（Fuel X 熱帶口味＋水）＋8 個純補水站。能量膠（Gel X Pro）只在 30K 站、且限量不保證——你本來就自備膠，照計畫帶足，別指望現場。',
      records: { male: '男子 2:07:33（Yuki Takei JPN, 2025）', female: '女子 2:24:22（Yuki Nakamura JPN, 2024）' },
      scale: '2025 年超過 39,000 名跑者、50+ 國家',
      mapLinks: [
        { label: '官方賽道頁（路線圖／Fly-through）', url: 'https://goldcoastmarathon.com.au/marathon-course/' },
        { label: '補給站與醫療', url: 'https://goldcoastmarathon.com.au/aid-stations-and-medical/' },
      ],
      // 官方 Google My Maps（免 API key 的 iframe 嵌入）
      mapEmbed: 'https://www.google.com/maps/d/embed?mid=1dHGZwBay3OnhtW0WAjvqMTIyzixpjU4',
      googleMap: 'https://www.google.com/maps/d/viewer?mid=1dHGZwBay3OnhtW0WAjvqMTIyzixpjU4',
      gpxDownload: 'https://goldcoastmarathon.com.au/wp-content/uploads/2026/03/2026-ASICS-Gold-Coast-Marathon-Course.gpx_.zip',
      // 高度剖面：每公里海拔（公尺），由官方 GPX 平滑後得出
      profile: {
        note: '世界級平坦路線：全程海拔僅約 0–13m，官方標總爬升 62m。此版高度改用 Garmin 課程 DEM 資料（1437 點，比先前 AllTrails 準）。唯二明顯的小起伏在 km11–12 與 km24–25 附近（約 10m 的跨橋），其餘幾乎貼海平面。下圖縱軸放大才看得出起伏，配速可當作全平。',
        max: 13,
        source: 'Garmin Connect course 477110673（DEM 高度）',
        perKm: [6.5, -0.5, 1.5, 1.2, 1.5, 1.5, 3.3, 3.9, 5.4, 3.4, 2.1, 11.3, 11.1, 8, 5.7, 6.5, 7.5, 5.4, 5.3, 7.4, 5.5, 5.9, 7.2, 5.5, 11.6, 8, 2, 3.6, 4.8, 9.9, -0.1, 4.3, 2.6, 2.7, 2.2, 1, 1.5, 4.1, 3, 1.3, 0, 3.4, 1.5],
      },
      // 路段對照（地點由 Google 反向地理編碼確認；折返點：Miami km17.5、Runaway Bay km37）
      sections: [
        { km: '0–4', place: 'Southport · Broadwater Parklands 出發', view: '內灣 Broadwater 水景', terrain: '平 · 跨 Nerang River 橋', beach: false },
        { km: '4–17.5', place: 'Main Beach → Surfers Paradise → Broadbeach → Mermaid Beach → Miami 折返', view: '沖浪海灘（海濱步道 Esplanade）', terrain: '平坦海濱', beach: true },
        { km: '17.5–30', place: 'Miami 折返北返，經 Broadbeach、Surfers Paradise、Main Beach', view: '沖浪海灘（回程，部分內側一街區）', terrain: '平坦', beach: true },
        { km: '30–37', place: 'Southport → Labrador → Runaway Bay 折返', view: '內灣 Broadwater 水景', terrain: '平 · 再跨橋', beach: false },
        { km: '37–42.2', place: 'Runaway Bay → Southport 終點衝線', view: '內灣 Broadwater · 終點 Broadwater Parklands', terrain: '平坦衝線', beach: false },
      ],
    },
    schedule: {
      date: '2026-07-05 週日',
      arrive: '建議 5:15am 抵達（至少賽前 1 小時）',
      gun: '6:15am 第一波鳴槍',
      startClosure: '6:05am 各分區須就位、6:45am 末波（W4）起跑後管制',
      cutoff: '關門：鳴槍後 7 小時（官方關門政策）→ 約 13:15 終點關閉（官方也表述為「末波 6:45 後 6h40」）。你預估 5h30（約 11:45 前完賽），餘裕約 1.5 小時。',
      paceGuide: '配速指引 9:30 /km（過起點線後須維持或更快，否則會被收容車）',
      waves: [
        'Wave 1 · 6:15am — 菁英／優先 + A 區',
        'Wave 2 · 6:25am — B 區',
        'Wave 3 · 6:35am — C 區',
        'Wave 4 · 6:45am — D & E 區',
      ],
      zoneNote: '6:05am 前各分區（A–E）須在號碼布字母對應的 Start Zone 就位，之後管制進場；蓄意跨區起跑可能被取消成績。想跟比自己慢的親友一起跑，可往後到較慢的分區起跑。菁英首位完賽約 8:20am、頒獎 9:40am。',
    },
    companionEvents: {
      date: '2026-07-04 週六 · 團體賽事日（Neil 非主賽）',
      items: [
        'China Airlines 半程馬拉松 6:15am（關門 3h20m）',
        'Southern Cross University 10km 9:25am（關門 1h40m）',
        'Gold Coast Airport 5km 11:45am（關門 1h10m）',
        '輪椅 10km 9:15am／輪椅 5km 11:30am',
        'Australia Fair 2km 兒童跑 11:10am',
      ],
    },
    clothing: {
      title: '賽事日穿著建議',
      sub: '依目前預報：低約 8.8°C、高約 18.4°C、降雨機率低、風約 12 km/h',
      items: [
        '賽前等待最冷（約 8–9°C）：穿可拋棄式舊外套／舊長袖或大型垃圾袋擋風，起跑後沿途丟棄（賽會多會回收捐贈）。',
        '起跑穿著：跑動體感比實際氣溫約多 10°C，建議短袖／背心＋短褲為主；怕冷可加可脫式袖套＋薄手套，暖身後收進口袋。',
        '海岸清晨風寒明顯：排汗底層優於純棉；終點備一件輕量風衣，避免完賽後失溫。',
      ],
    },
    splits: {
      note: '官方關門政策：總關門 7 小時（鳴槍計）＝末波後 6h40，配速指引 9:30/km（過起點線後須維持或更快），沒有逐站關門時間。下表是依 9:30/km 從末波 6:45 起算的「最晚通過」參考（最保守）；維持在這之內就安全。你的目標 5h30 在每個分段都有大幅餘裕。',
      pace: '關門配速 9:30 /km',
      rows: [
        { km: '10K', cum: '約 1:35', clock: '約 08:20' },
        { km: '半程 21.1K', cum: '約 3:20', clock: '約 10:05' },
        { km: '30K', cum: '約 4:45', clock: '約 11:30' },
        { km: '終點 42.2K', cum: '約 6:40', clock: '約 13:25（末波關門）' },
      ],
    },
    // 逐站配速對照表：數字由 app.js 依下方 segments 平均配速即時算（不手刻）。地點由官方 GPX 路線逐站反向地理編碼（Google Maps）得出，對齊官方 16 個補給站（每 2.5K）
    paceTable: {
      note: '「預估時刻」假設你在 D/E 區、6:45 末波、約 6:50 過起跑線。你的波次越前面就整列往前移；以你的實際起跑時間＋累計時間為準。地點由官方 GPX 反查，給家人對照「我大概幾點在哪」。',
      startClock: '6:50',
      segments: [
        { to: 21, secPerKm: 420, ratio: '跑8走1', pace: '7:00/km' },     // 0–21K
        { to: 32, secPerKm: 455, ratio: '跑6走1', pace: '7:35/km' },     // 21–32K
        { to: 42.195, secPerKm: 520, ratio: '跑5走2', pace: '8:40/km' }, // 32–42.2K
      ],
      // marathon 16 站，每 2.5K（WS=純水，RS=Fuel X 熱帶+水，gels 只在 30K）；place 由 GPX 座標反查
      stations: [
        { km: 2.5, type: 'WS', place: 'Main Beach（內灣段）' }, { km: 5, type: 'RS', place: 'Main Beach' },
        { km: 7.5, type: 'WS', place: 'Main Beach Pde' }, { km: 10, type: 'RS', place: 'Surfers Paradise · Cavill Ave' },
        { km: 12.5, type: 'WS', place: 'Broadbeach' }, { km: 15, type: 'RS', place: 'Mermaid Beach' },
        { km: 17.5, type: 'WS', turn: 'Miami 折返', place: 'Miami（南端折返）' }, { km: 20, type: 'RS', place: 'Mermaid Beach（回程）' },
        { km: 22.5, type: 'WS', place: 'Broadbeach（回程）' }, { km: 25, type: 'RS', place: 'Surfers/Main Beach Pde' },
        { km: 27.5, type: 'WS', place: 'Main Beach' }, { km: 30, type: 'RS', gels: true, place: 'Southport（回到出發地）' },
        { km: 32.5, type: 'WS', place: 'Southport（轉北）' }, { km: 35, type: 'RS', place: 'Biggera Waters' },
        { km: 37.5, type: 'WS', turn: 'Runaway Bay 折返', place: 'Runaway Bay（北端折返）' }, { km: 40, type: 'RS', place: 'Labrador（回程）' },
      ],
      finishPlace: 'Southport（終點園區）',
      finish: 42.195,
    },

    // ASICS Sport & Leisure Expo（選手報到/號碼布領取）+ 賽事園區設施，來源 2026 官方賽事手冊
    expo: {
      title: 'ASICS Sport & Leisure Expo（選手報到 / 號碼布領取）',
      venue: 'Gold Coast Convention & Exhibition Centre 會展中心 · 2684–2690 Gold Coast Highway, Broadbeach',
      free: '免費入場，逾 60 家攤位（ASICS 鞋服、補給、裝備），現場有免費 WiFi。',
      hours: [
        '週四 7/02 · 12:00–19:00',
        '週五 7/03 · 09:00–20:00',
        '週六 7/04 · 09:00–16:00',
      ],
      note: '號碼布在 Expo 內的 Check-in Centre 領取，官方建議「自己親領」；若請人代領，需帶你的 entry certificate（報名確認證明）。全馬建議週六去領（週五歷年最擠）。你是跟團，實際自領或領隊代領請先跟領隊敲定。會展中心在 Broadbeach，與賽事園區（Southport）是不同地點，搭輕軌可達；GCCEC 停車免費 1 小時。',
      facilities: {
        title: '賽事園區（Broadwater Parklands, Southport）',
        items: [
          '寄物 Bag Drop、廁所、補水站、資訊 booth、失物／走失帳篷',
          '終點後 Recovery 恢復區（水果、飲水）→ 再到完賽衣／獎牌領取點',
          'Event Lawn 有食物飲料、Better Beer 酒吧、大螢幕直播',
          '接送下車區在 Davenport St（走到園區約 5 分鐘）',
        ],
      },
      finisher: '完賽禮：官方完賽衣 + GCM26 紀念品 + 獎牌 + 完賽證書（2026 獎牌以海浪漣漪為設計）。',
      tracking: '家人想即時追蹤：下載新版「ASICS Gold Coast Marathon」App（live tracking／賽道圖／成績，舊 2025 版要刪掉重裝），或看官方 YouTube／Facebook 直播（週日 6:00–9:00 QLD 時間）。',
    },
    result: {
      // 賽後回來填
      finishTime: null,
      placing: null,
      reflection: null,
    },
  },

  /* ---------------------------------------------------------------- 行前情報 */
  intel: {
    sights: [
      {
        name: 'Paradise Country 天堂鄉農莊', city: '黃金海岸',
        points: ['澳洲農莊體驗', '無尾熊拍照', '動物與農場表演'],
        info: '約 10:00–15:30；表演採場次制，入園索取當日時刻表。聖誕與澳紐軍團日（4/25）休園。',
        link: 'https://paradisecountry.com.au/shows-and-presentations',
      },
      {
        name: 'Sanctuary Cove 神仙灣', city: '黃金海岸',
        points: ['濱水餐飲', '精品小店', '遊艇碼頭與高級住宅區氛圍'],
        info: '免門票、每日開放、免費停車；約 80 家店與得獎遊艇碼頭，自由逛街用餐。',
        link: 'https://sanctuarycove.com/',
      },
      {
        name: 'SkyPoint 觀景台', city: '黃金海岸',
        points: ['Q1 大樓觀景台', '黃金海岸高空視角', '留意日落時段與最後入場時間'],
        info: '每日約 07:30–21:00（最後入場約 20:30）；成人約 AUD $33 起。7 月日落約下午 5 點，建議 16:00–16:15 上去一次看日夜景。聖誕休館。',
        link: 'https://skypoint.com.au/visit',
      },
      {
        name: 'Tamborine Mountain / Eagle Heights 鷹高藝術小鎮', city: '黃金海岸腹地山區',
        points: ['山區小鎮', '咖啡、藝品、特色小店', '適合慢慢逛，不是衝刺購物型'],
        info: 'Gallery Walk 店家多每日約 10:00–16:00；逛一圈約 1–2 小時，建議上午前往、避開午後人潮。',
        link: 'https://visittamborinemountain.com.au/',
      },
      {
        name: '南岸公園 South Bank', city: '布里斯本',
        points: ['河岸人造沙灘與綠地', '步行友善', '市區暖身散步好去處'],
        link: 'https://visit.brisbane.qld.au/places-to-go/inner-city/south-bank',
      },
      {
        name: '故事橋 Story Bridge / 市政廳 / 庫莎山', city: '布里斯本',
        points: ['城市地標', '庫莎山可俯瞰市景', '賽前輕鬆觀光，不要操腿'],
        link: null,
      },
    ],
    shopping: [
      {
        name: 'Harbour Town Gold Coast', type: 'Outlet 折扣',
        note: '超過 220 間店、日常折扣最高可到 70%。適合集中逛運動品牌、戶外、太陽眼鏡與 3C。',
        picks: [
          { label: '運動跑鞋/服飾', stores: 'ASICS、Nike、New Balance、Puma' },
          { label: '戶外旅行', stores: 'Kathmandu' },
          { label: '太陽眼鏡', stores: 'Oakley Vault、Sunglass Hut' },
          { label: '3C', stores: 'JB Hi-Fi' },
          { label: '舒適鞋', stores: 'ECCO' },
        ],
        directory: 'https://www.harbourtowngoldcoast.com.au/stores',
        home: 'https://www.harbourtowngoldcoast.com.au/',
      },
      {
        name: 'Pacific Fair', type: '大型綜合商場',
        note: '不只是 outlet，適合賽後或空檔補買運動、鞋款、男裝、3C。',
        picks: [
          { label: '運動', stores: 'Adidas Performance、Rebel、ASICS' },
          { label: '跑鞋/鞋款', stores: "The Athlete's Foot、Hype DC、SoleStreet" },
          { label: '3C/通訊', stores: 'JB Hi-Fi、Vodafone' },
          { label: '男性基本款', stores: 'Academy Brand、JD Sports' },
        ],
        directory: 'https://www.pacificfair.com.au/stores-services',
        home: 'https://www.pacificfair.com.au/',
      },
    ],
    shoppingUpdated: '2026-06-20',
    shoppingDisclaimer: '店家會變動，出發前以官方店家目錄為準。',
    localInfo: {
      updated: '2026-06-20',
      items: [
        { label: '小費', text: '澳洲不強制小費、店家不期待。餐廳優質服務可給約 10%（隨意）、計程車湊整數即可，皆非義務。' },
        { label: '電壓 / 插頭', text: '230V（常達 240V）／50Hz，插頭 Type I（三支斜扁腳）。手機、筆電充電器多支援 100–240V 僅需轉接頭；110V 吹風機、電鬍刀勿直接用會燒壞。' },
        { label: '緊急電話', text: '全澳統一 000（警察／救護／消防同號）。' },
        { label: '叫車', text: 'Uber、DiDi 在黃金海岸都可用（Uber 覆蓋最廣、DiDi 較便宜）；Ola 已退出澳洲。傳統計程車仍可叫。' },
        { label: '支付', text: '感應刷卡（tap & go）極普及，$100 以下免簽免 PIN，手機／手錶 NFC 通用。帶感應卡最方便，少量現金備用即可。' },
      ],
    },
    transport: {
      items: [
        { label: '住宿 → 賽事園區', text: 'Mercure Gold Coast Resort（Palm Meadows／Carrara）到 Broadwater Parklands（Southport）約 8–10km、平日車程 10–15 分；賽事日封路會更久，務必提早。' },
        { label: '輕軌 G:link（首選）', text: '最近站＝Broadwater Parklands，下車跟指標即達會場。憑號碼布免費搭（週日 04:00–15:00）。週日班距：04:00–07:00 約每 6.5 分、07:00–14:00 約每 7.5 分一班。' },
        { label: '封路（2026 已確認）', text: '賽事日（週日 7/05）封路 3:30am 起、隨賽事完成陸續開放、全部約 2:30pm 前恢復；封路範圍 Paradise Point 到 Miami。' },
        { label: '接駁巴士（備援）', text: '週日輕軌若爆滿有接駁巴士：Broadbeach South（4:30–5:30、末班 5:15）、Surfers Paradise 的 Cavill Ave／Cypress Ave（4:30–5:45、末班 5:30）。' },
        { label: '自駕 / 接送', text: '接送下車區在 Davenport St（經 Nerang St 進、Nind St 西向出，走到園區約 5 分）。Broadwater Parklands 停車場（水上運動中心）6/22–7/09 全關，別開進核心區；賽前至少 1 小時到。' },
        { label: '布里斯本機場 ↔ 黃金海岸', text: '約 85–95km、自駕 1 小時～1 小時 15 分（尖峰更久）；另有直達巴士約 2 小時。6/27–7/19 鐵路施工，往返布里斯本部分改鐵路接駁巴士到 Helensvale 再轉輕軌，車程可能拉長。' },
      ],
      note: '封路與大眾運輸以官方為準：goldcoastmarathon.com.au/road-closures；往返布里斯本先用 Translink Journey Planner 查最新班次（施工期班次會變動）。',
    },
  },

  /* ---------------------------------------------------------------- 天氣 */
  weather: {
    updatedAt: '2026-06-20 16:43 台北時間',
    apiNote: '使用 Open-Meteo 免金鑰 API。查詢時 API 僅開放到 2026-07-05，7/06–7/08 顯示待更新。',
    locations: [
      { key: 'gold-coast', name: '黃金海岸', latitude: -28.0167, longitude: 153.4, primary: true },
      { key: 'brisbane', name: '布里斯本', latitude: -27.4698, longitude: 153.0251 },
    ],
    marathonReminder: {
      date: '2026-07-05',
      text: '全馬日目前預報偏涼（低溫約 8.8°C、高溫約 18.4°C），降雨機率不高。賽前等待會冷，準備拋棄式外套。出發前務必重查。',
    },
    climateNote: '黃金海岸 7 月為冬季：日間約 17–21°C、清晨可低至 8–10°C，整體乾爽、少雨。',
    // 行前研究時的快照，作為 API 取不到時的 fallback
    snapshot: {
      'gold-coast': [
        { date: '2026-07-02', code: 80, max: 20.6, min: 15.7, rain: 16, wind: 16.0 },
        { date: '2026-07-03', code: 80, max: 19.0, min: 12.6, rain: 25, wind: 15.0 },
        { date: '2026-07-04', code: 0, max: 17.7, min: 9.5, rain: 16, wind: 11.9 },
        { date: '2026-07-05', code: 51, max: 18.4, min: 8.8, rain: 19, wind: 12.1 },
      ],
      brisbane: [
        { date: '2026-07-02', code: 53, max: 21.8, min: 15.0, rain: 18, wind: 12.7 },
        { date: '2026-07-03', code: 53, max: 18.0, min: 12.6, rain: 24, wind: 17.4 },
      ],
    },
  },

  /* ---------------------------------------------------------------- 旅行日誌（佔位，回來補） */
  journal: [
    { date: '2026-07-02', title: '', mood: '', body: '', oneThing: '', photo: null },
    { date: '2026-07-03', title: '', mood: '', body: '', oneThing: '', photo: null },
    { date: '2026-07-04', title: '', mood: '', body: '', oneThing: '', photo: null },
    { date: '2026-07-05', title: '', mood: '', body: '', oneThing: '', photo: null },
    { date: '2026-07-06', title: '', mood: '', body: '', oneThing: '', photo: null },
    { date: '2026-07-07', title: '', mood: '', body: '', oneThing: '', photo: null },
    { date: '2026-07-08', title: '', mood: '', body: '', oneThing: '', photo: null },
  ],

  /* ---------------------------------------------------------------- 照片牆 */
  gallery: [
    { key: 'brisbane', label: '布里斯本', photos: [] },
    { key: 'gold-coast', label: '黃金海岸', photos: [] },
    { key: 'marathon', label: '馬拉松', photos: [] },
    { key: 'food', label: '飲食', photos: [] },
    { key: 'street', label: '街景', photos: [] },
    { key: 'quiet', label: '安靜片刻', photos: [] },
  ],

  /* ---------------------------------------------------------------- 出發清單 */
  checklist: [
    { category: '證件與出發', items: ['護照（效期 6 個月以上）', '電子簽證 / ETA 確認', '登機證 / 行程單', '旅遊保險', '少量澳幣現金 + 信用卡', '海關申報注意（見下方入境提醒）'] },
    { category: '跑步裝備', items: ['比賽鞋（已試跑）', '排汗上衣 + 短褲', '壓縮套/襪', '運動手錶 + 充電線', '號碼帶、別針', '能量膠', '防曬、止磨膏', '賽前拋棄式保暖外套'] },
    { category: '衣物與天氣', items: ['冬季外套（日夜溫差大）', '長袖 + 短袖混搭', '保暖帽 / 手套（清晨冷）', '輕便雨具', '泳衣（飯店泳池）', '休閒鞋'] },
    { category: '電器與充電', items: ['手機 + 充電線', '行動電源', '萬用轉接頭（澳洲 Type I）', '手錶/耳機充電', '相機（選帶）'] },
    { category: '藥品與身體照護', items: ['個人常備藥', '腸胃藥、止痛藥', 'OK 繃、肌貼', '電解質', '保濕/護唇（乾燥）'] },
    { category: '澳洲入境提醒', items: ['不可攜帶肉類、蛋、奶、種子、生鮮蔬果', '藥品備英文標示或處方', '木製品、蜂蜜需申報', '不確定就申報，罰則很重'] },
    { category: '回台提醒', items: ['免稅菸酒額度確認', '保留消費單據（個人留存）', '農畜產品勿帶回', '整理照片與日誌素材'] },
  ],

  /* ---------------------------------------------------------------- 財務（只放分類總額） */
  budget: {
    currency: 'TWD',
    note: '公開頁只顯示分類統計，不顯示每筆消費明細。金額回來後再補。',
    categories: [
      { label: '團費', amount: null },
      { label: '簽證與旅遊文件', amount: null },
      { label: '小費', amount: null },
      { label: '餐飲', amount: null },
      { label: '當地交通', amount: null },
      { label: '購物', amount: null },
      { label: '跑步相關支出', amount: null },
      { label: '其他雜支', amount: null },
    ],
  },

  PRIVATE_NOTE,
};
