/**
 * Central export point for utility functions
 *
 * Import utilities from here instead of individual files:
 *
 * @example
 * // Instead of:
 * import { buildWhereClause } from "../utils/database.utils.js";
 *
 * // Use:
 * import { buildWhereClause } from "../utils/index.js";
 */

// Database utilities
export {
  buildWhereClause,
  buildLikeClause,
  buildPagination,
  buildSortClause,
  buildUpdateSetClause,
  buildInClause,
} from "./database.utils.js";
