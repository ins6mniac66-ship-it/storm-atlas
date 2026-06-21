import type { ImageSourcePropType } from 'react-native';

declare const require: (path: string) => ImageSourcePropType;

export const shrineImageSources: Record<string, ImageSourcePropType> = {
  "RiskOfRain2_Shrines/shrine-of-blood.png": require("../../RiskOfRain2_Shrines/shrine-of-blood.png"),
  "RiskOfRain2_Shrines/shrine-of-chance.png": require("../../RiskOfRain2_Shrines/shrine-of-chance.png"),
  "RiskOfRain2_Shrines/shrine-of-combat.png": require("../../RiskOfRain2_Shrines/shrine-of-combat.png"),
  "RiskOfRain2_Shrines/shrine-of-order.png": require("../../RiskOfRain2_Shrines/shrine-of-order.png"),
  "RiskOfRain2_Shrines/shrine-of-the-mountain.png": require("../../RiskOfRain2_Shrines/shrine-of-the-mountain.png"),
  "RiskOfRain2_Shrines/shrine-of-the-woods.png": require("../../RiskOfRain2_Shrines/shrine-of-the-woods.png"),
};
