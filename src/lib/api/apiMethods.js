/**
 * ============================================================
 *  API METHODS — Barrel File (apiMethods.js)
 * ============================================================
 *  Sab API helpers ek jagah se import karo:
 *
 *    import { apiGet, apiPost, apiPut, apiPatch, apiDelete, apiMultipart, apiDownload }
 *      from '@/lib/api/apiMethods'
 *
 *  Ya individual import:
 *    import apiGet from '@/lib/api/apiGet'
 *    import apiPost from '@/lib/api/apiPost'
 * ============================================================
 */

export { apiGet }       from './apiGet';
export { apiPost }      from './apiPost';
export { apiPut }       from './apiPut';
export { apiPatch }     from './apiPatch';
export { apiDelete }    from './apiDelete';
export { apiMultipart } from './apiMultipart';
export { apiDownload }  from './apiDownload';

// Default export for convenience
import { apiGet }       from './apiGet';
import { apiPost }      from './apiPost';
import { apiPut }       from './apiPut';
import { apiPatch }     from './apiPatch';
import { apiDelete }    from './apiDelete';
import { apiMultipart } from './apiMultipart';
import { apiDownload }  from './apiDownload';

const apiMethods = { apiGet, apiPost, apiPut, apiPatch, apiDelete, apiMultipart, apiDownload };
export default apiMethods;
