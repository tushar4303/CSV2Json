import { executeQuery } from "../database";

export const insertUsers = async (users: any[]) => {
  try {
    const valuePlaceholders = users
      .map((_, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`)
      .join(", ");
      
    const insertQuery = `
      INSERT INTO public.users (name, age, address, additional_info) 
      VALUES 
      ${valuePlaceholders}
    `;

    const values: any[] = [];
    users?.forEach((user) => {
      const { name, age, address, ...otherInfo } = user;
      const { firstName, lastName } = name;
      const fullName = `${firstName} ${lastName}`.trim();
      const addressJson = address ? JSON.stringify(address) : null;
      const additionalInfoJson = otherInfo ? JSON.stringify(otherInfo) : null;
      values?.push(fullName, Number(age), addressJson, additionalInfoJson);
    });
    await executeQuery(insertQuery, values);
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
