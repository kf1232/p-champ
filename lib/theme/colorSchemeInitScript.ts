import { APP_STORAGE_KEYS } from "@/lib/storage/keys";

import { COLOR_SCHEME_ATTRIBUTE } from "./colorScheme";
import {
  COLOR_SCHEME_COOKIE_MAX_AGE_SEC,
  COLOR_SCHEME_COOKIE_NAME,
} from "./colorSchemeCookie";

/** Inline script for `beforeInteractive` — avoids light/dark flash on first paint. */
export function colorSchemeBootstrapScript(): string {
  const storageKey = JSON.stringify(APP_STORAGE_KEYS.colorScheme);
  const attr = JSON.stringify(COLOR_SCHEME_ATTRIBUTE);
  const cookieName = JSON.stringify(COLOR_SCHEME_COOKIE_NAME);
  const maxAge = String(COLOR_SCHEME_COOKIE_MAX_AGE_SEC);
  return `(function(){try{var cn=${cookieName};var scheme="light";var found=false;var parts=document.cookie?document.cookie.split(";"):[];for(var i=0;i<parts.length;i++){var p=parts[i].trim();if(p.indexOf(cn+"=")===0){var c=decodeURIComponent(p.slice(cn.length+1));if(c==="dark"||c==="light"){scheme=c;found=true}break}}if(!found){var raw=localStorage.getItem(${storageKey});if(raw==="dark"||raw==="light"){scheme=raw;document.cookie=cn+"="+encodeURIComponent(scheme)+"; path=/; max-age=${maxAge}; SameSite=Lax"}}document.documentElement.setAttribute(${attr},scheme)}catch(e){}})();`;
}
