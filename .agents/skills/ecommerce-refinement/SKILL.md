# Ecommerce Refinement Pattern (電商介面優化模式)

This skill documents the best practices and logical patterns used to refine our e-commerce application.

## 1. Unified Message System (統一訊息系統)
Always use the specialized `useMessage` hook for UI feedback.
- **Pattern**: `try { await dispatch(...).unwrap(); showSuccess("Success!"); } catch (err) { showError(err); }`
- **Goal**: Ensure consistent user notifications across all components.

## 2. Loading State Management (讀取狀態管理)
Never leave the user guessing. Always provide visual feedback during async actions.
- **Pattern**:
  - `loadingCartId` to track specific item processing.
  - Disable buttons and show `<i className="fas fa-spinner fa-spin"></i>`.
- **Logic**: Set loading state at the start of an async function and clear it in the `finally` block to ensure it always clears.

## 3. Robust Pagination & Routing (健壯的分頁與路由)
- **Prop Destructuring**: Always destructure props in the Pagination component: `function Pagination({ pagination, onChangePage })`.
- **API Field Matching**: Ensure you use the exact field names from the API (e.g., `has_pre`, `total_pages`).
- **Routing**: Use `<Link to="/path">` for internal navigation to prevent page refreshes.

## 4. Derived Data from API (衍生資料處理)
- **Categories**: Use `[...new Set(array.map(item => item.category))]` to extract unique categories from a product list.
- **Explanation**: The spread operator `...` is crucial to convert the `Set` back into a usable `Array`.

---
*Created during an Antigravity pair programming session.*
