export class HelperBingo {

  static StoreCardsLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static GetDataFromLocalStorage(key: string): any {
    let retrievedData = localStorage.getItem(key);
    if (retrievedData) {
      return JSON.parse(retrievedData);
    }
  }

}
