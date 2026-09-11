export const vehicleData = {
  Toyota: [
    "Agya",
    "Calya",
    "Avanza",
    "Veloz",
    "Innova",
    "Fortuner",
    "Rush",
    "Raize",
    "Yaris",
    "Hilux",
    "Alphard",
  ],

  Honda: [
    "Brio",
    "Jazz",
    "Mobilio",
    "BR-V",
    "HR-V",
    "CR-V",
    "WR-V",
    "City",
    "Civic",
    "Accord",
  ],

  Daihatsu: [
    "Ayla",
    "Sigra",
    "Xenia",
    "Terios",
    "Rocky",
    "Luxio",
    "Gran Max",
  ],

  Suzuki: [
    "Ertiga",
    "XL7",
    "Carry",
    "Baleno",
    "Jimny",
    "Ignis",
    "S-Presso",
  ],

  Mitsubishi: [
    "Xpander",
    "Xpander Cross",
    "Pajero Sport",
    "Triton",
    "Outlander",
  ],

  Nissan: [
    "Livina",
    "X-Trail",
    "Serena",
    "Magnite",
  ],

  Hyundai: [
    "Stargazer",
    "Creta",
    "Ioniq 5",
    "Palisade",
    "Santa Fe",
  ],

  Wuling: [
    "Air EV",
    "Alvez",
    "Almaz",
    "Confero",
  ],

  Kia: [
    "Sonet",
    "Seltos",
    "Carnival",
  ],

  Mazda: [
    "Mazda2",
    "Mazda3",
    "CX-3",
    "CX-5",
    "CX-8",
  ],

  BMW: [
    "Seri 3",
    "Seri 5",
    "X1",
    "X3",
  ],

  "Mercedes-Benz": [
    "C-Class",
    "E-Class",
    "GLC",
    "GLE",
  ],

  Isuzu: [
    "Panther",
    "D-Max",
    "MU-X",
    "ELF",
  ],

  Ford: [
    "Ranger",
    "Everest",
  ],

  Chery: [
    "Omoda 5",
    "Tiggo 7",
    "Tiggo 8",
  ],

  BYD: [
    "Dolphin",
    "Atto 3",
    "Seal",
    "M6",
  ],

  MG: [
    "ZS",
    "HS",
    "4 EV",
  ],

  DFSK: [
    "Glory 560",
    "Glory i-Auto",
    "Gelora",
  ],
} as const;

export type VehicleBrand = keyof typeof vehicleData;