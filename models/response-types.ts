import { TestUnitType } from "./test-unit.ts";

class responseTypes {
  key: string;
  type: string;
  children?: responseTypes[];
  unit: TestUnitType;
  allowNull?: boolean;
  constructor(key: string, type: string, unit: TestUnitType, children?: responseTypes[], allowNull?: boolean) {
    this.key = key;
    this.type = type;
    this.children = children;
    this.unit = unit;
    this.allowNull = allowNull ?? false;
  }
}
export { responseTypes };
