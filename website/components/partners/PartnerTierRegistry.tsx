import DiamondPartner from "./DiamondPartner";
import GoldenPartner from "./GoldenPartner";
import SilverPartner from "./SilverPartner";

export const partnerTierRegistry: Record<string, React.ComponentType<any>> = {
  diamond: DiamondPartner,
  gold: GoldenPartner,
  golden: GoldenPartner,
  silver: SilverPartner,
};
