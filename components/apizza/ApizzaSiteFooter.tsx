import Link from "next/link";

import { APIZZA_HOME_PATH } from "@/lib/site";

import {
  APIZZA_LOGO_ALT,
  APIZZA_LOGO_SRC,
} from "./configs/apizzaBrandCopy";
import {
  APIZZA_COPYRIGHT,
  APIZZA_SOCIAL_BAR_LABEL,
  APIZZA_SOCIAL_ITEMS,
} from "./configs/apizzaHomeCopy";

export function ApizzaSiteFooter() {
  return (
    <footer className="apizza-footer">
      <div className="apizza-footer__inner">
        <Link href={APIZZA_HOME_PATH} className="apizza-footer__logo-link">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={APIZZA_LOGO_SRC}
            alt={APIZZA_LOGO_ALT}
            className="apizza-footer__logo"
          />
        </Link>
        <div className="apizza-footer__end">
          <ul className="apizza-social" aria-label={APIZZA_SOCIAL_BAR_LABEL}>
            {APIZZA_SOCIAL_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="apizza-social__link"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="apizza-social__icon"
                    src={item.src}
                    alt={item.label}
                    width={20}
                    height={20}
                  />
                </a>
              </li>
            ))}
          </ul>
          <p className="apizza-footer__copy">{APIZZA_COPYRIGHT}</p>
        </div>
      </div>
    </footer>
  );
}
