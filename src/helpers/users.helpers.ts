import { executeQuery } from "../database";
import { AppError } from "../services/utils/error.utils";

export const transformUser = (user: any) => {
  const { name, age, address, ...otherInfo } = user;
  const { firstName, lastName } = name;
  const fullName = `${firstName} ${lastName}`?.trim();
  const addressJson = address ? JSON.stringify(address) : null;
  const additionalInfoJson = otherInfo ? JSON.stringify(otherInfo) : null;
  return [fullName, Number(age), addressJson, additionalInfoJson];
};

export const insertUsersByBatch = async (batch: any[]): Promise<void> => {
  try {
    const valuePlaceholders = batch?.map((_, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`)?.join(", ");

    const insertQuery = `
      INSERT INTO public.users (name, age, address, additional_info)
      VALUES ${valuePlaceholders}
    `;

    const values = batch?.flat();
    await executeQuery(insertQuery, values); 
  } catch (error) {
    console.error("Error inserting batch: ", error);
    throw new AppError("Error inserting batch", 500);
  }
};

export const processUsersInBatches = async (users: any[], batchSize: number, maxParallel: number): Promise<void> => {
  try {
    const runningPromises: Promise<any>[] = [];
    for (let i = 0; i < users?.length; i += batchSize) {
      const batch = users?.slice(i, i + batchSize);
      const promise = insertUsersByBatch(batch);

      runningPromises?.push(promise);

      if (runningPromises?.length >= maxParallel) {
        await Promise.all(runningPromises);
        runningPromises.length = 0;
      }
    }
    await Promise.all(runningPromises);
  } catch (error) {
    console.error("Error in processUsersInBatches: ", error);
    throw new AppError("Error in processUsersInBatches", 500);
  }
};
