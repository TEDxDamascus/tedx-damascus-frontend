// partnerTierRegistry.ts

import DiamondPartner from "./DiamondPartner";
import GoldenPartner from "./GoldenPartner";
import SilverPartner from "./SilverPartner";
import BronzePartner from "./BronzePartner";
import MediaPartner from "./MediaPartner";
import HealthPartner from "./HealthPartner";

export const partnerTierRegistry: Record<string, React.ComponentType<any>> = {
  diamond: DiamondPartner,
  gold: GoldenPartner,
  golden: GoldenPartner,
  silver: SilverPartner,
  bronze: BronzePartner,
  media: MediaPartner,
  health: HealthPartner,
};