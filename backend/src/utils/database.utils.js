// Database utilities - helper functions for building DB queries

// Build WHERE clause from filters
export const buildWhereClause = (filters, startParam = 1) => {
  const conditions = [];
  const values = [];
  let paramCount = startParam;

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      conditions.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  }

  const clause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  return {
    clause,
    values,
    nextParam: paramCount,
  };
};

// Build LIKE WHERE clause for text search
export const buildLikeClause = (field, value, paramNumber) => {
  return {
    clause: `${field} ILIKE $${paramNumber}`,
    value: `%${value}%`,
  };
};

// Build pagination clause (LIMIT and OFFSET)
export const buildPagination = (page = 1, limit = 10, startParam = 1) => {
  const offset = (page - 1) * limit;
  const clause = `LIMIT $${startParam} OFFSET $${startParam + 1}`;
  const values = [limit, offset];

  return {
    clause,
    values,
    nextParam: startParam + 2,
  };
};

// Build ORDER BY clause
export const buildSortClause = (field = "created_at", direction = "DESC") => {
  const validDirections = ["ASC", "DESC"];
  const sortDirection = validDirections.includes(direction.toUpperCase())
    ? direction.toUpperCase()
    : "DESC";

  return `ORDER BY ${field} ${sortDirection}`;
};

// Build dynamic UPDATE SET clause
export const buildUpdateSetClause = (data, startParam = 2) => {
  const fields = Object.keys(data);
  const values = Object.values(data);

  if (fields.length === 0) {
    return { clause: "", values: [], nextParam: startParam };
  }

  const setClause = fields
    .map((field, index) => `${field} = $${startParam + index}`)
    .join(", ");

  return {
    clause: setClause,
    values,
    nextParam: startParam + fields.length,
  };
};

// Build IN clause for arrays
export const buildInClause = (field, values, startParam = 1) => {
  if (!Array.isArray(values) || values.length === 0) {
    return { clause: "", values: [], nextParam: startParam };
  }

  const params = values.map((_, index) => `$${startParam + index}`).join(", ");
  const clause = `${field} IN (${params})`;

  return {
    clause,
    values,
    nextParam: startParam + values.length,
  };
};
