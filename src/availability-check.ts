import fetch from "node-fetch";
import { AVAILABILITY_URL } from "./config";
import { MODELS, STORES } from "./data";

const modelsMap = new Map(
  MODELS.map((model) => [
    model.partNumber,
    `${model.familyType} ${model.dimensionColor} ${model.dimensionCapacity}`,
  ])
);

const storeMap = new Map(
  STORES.map((store) => [
    store.storeNumber,
    `${store.storeName}, ${store.city}`,
  ])
);

export async function checkAvailability(): Promise<string[]> {
  const res = await fetch(AVAILABILITY_URL);
  if (res.status !== 200) {
    console.info("Availability check failed");
    return [];
  }
  const data = await res.json();
  const stores = Object.keys(data.stores ?? {});
  const storeAndModelsAvailable = stores.reduce(
    (acc: { store: string; models: string[] }[], store) => {
      const storeData = data.stores[store];
      const storeDetails = storeMap.get(store) ?? "Unknown Store";
      const models = Object.keys(storeData ?? {});
      const modelsAvailable = models.reduce((acc1: string[], model) => {
        const modelData = storeData[model];
        const isAvailable = modelData.availability.unlocked ?? false;

        return isAvailable ? [...acc1, model] : acc1;
      }, []);

      return [
        ...acc,
        {
          store: storeDetails ?? "Unknown",
          models: modelsAvailable,
        },
      ];
    },
    []
  );

  return storeAndModelsAvailable.reduce((acc: string[], data) => {
    return data.models.reduce((acc2: string[], model) => {
      const modelDetails = modelsMap.get(model) ?? "Unknown";
      return [...acc2, `${modelDetails} @ ${data.store}`];
    }, []);
  }, []);
}
