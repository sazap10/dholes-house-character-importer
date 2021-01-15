import * as DataParser  from "src/module/dataParser";


describe('dataParser', function() {
  it('converts from json correctly', function() {
    let result = DataParser.Convert.toDholesHouseExportData("test");
    expect(result).toBe(7);
  });

  it('converts to json correctly', function() {
    const input: DataParser.DholesHouseExportData = {
      Investigator: {
        Header: {

        },
        PersonalDetails: {},
        Characteristics: {},
        Skills: {},
        Talents: null,
        Weapons: {},
        Combat: {},
        Backstory: {},
        Possessions: {},
        Cash: {},
        Assets: null,
      },
  };

    let result = DataParser.Convert.dholesHouseExportDataToJson(input);
    expect(result).toBe(7);
  });
});
