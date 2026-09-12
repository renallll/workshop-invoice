export type VehicleStatus =
  | "active"
  | "service_due"
  | "inactive";

export const getVehicleStatus = (
  lastVisit: string
): VehicleStatus => {
  if (!lastVisit) return "inactive";

  const today = new Date();

  const last = new Date(lastVisit);

  const diffDays = Math.floor(
    (today.getTime() - last.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 90) {
    return "active";
  }

  if (diffDays <= 365) {
    return "service_due";
  }

  return "inactive";
};

export const getVehicleStatusLabel = (
  status: VehicleStatus
) => {
  switch (status) {
    case "active":
      return {
        text: "Aktif",
        emoji: "🟢",
      };

    case "service_due":
      return {
        text: "Perlu Service",
        emoji: "🟡",
      };

    case "inactive":
      return {
        text: "Lama Tidak Servis",
        emoji: "🔴",
      };
  }
};