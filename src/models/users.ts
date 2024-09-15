import { executeQuery } from "../database";
import { processUsersInBatches, transformUser } from "../helpers/users.helpers";
import { PassThrough } from 'stream';

export const insertUsers = async (users: any[], batchSize: number = 10000, maxParallel: number = 10): Promise<boolean> => {
  const transformedUsers = users?.map(transformUser); 
  try {
    await processUsersInBatches(transformedUsers, batchSize, maxParallel);
    return true;
  } catch (error) {
    console.error(error, "ERROR IN insertUsers");
    return false;
  }
};

export const getUserByAge = async () => {
  try {
    const query = `
      SELECT 
        COUNT(*) as "totalUsers",
        SUM(CASE WHEN age < 20 THEN 1 ELSE 0 END) as "lessThan20",
        SUM(CASE WHEN age BETWEEN 20 AND 40 THEN 1 ELSE 0 END) as "between20And40",
        SUM(CASE WHEN age BETWEEN 40 AND 60 THEN 1 ELSE 0 END) as "between40And60",
        SUM(CASE WHEN age > 60 THEN 1 ELSE 0 END) as "greaterThan60"
      FROM users
    `;
  
    const data = await executeQuery(query);
    return data?.[0] || {};
  } catch (error) {
    console.error(error, "ERROR IN getUserByAge");
    return {};
  }
}
