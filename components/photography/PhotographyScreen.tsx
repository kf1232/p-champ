import Link from "next/link";

import { PORTAL_HOME_PATH, PORTAL_NAME } from "@/lib/site";

import { PhotographyContentGrid } from "./PhotographyContentGrid";

const PHOTOGRAPHY_DESCRIPTION = "Shared Lightroom gallery.";

export function PhotographyScreen() {
  return (
    <div className="photography-screen-root">
      <header className="photography-screen-header">
        <div className="photography-screen-header-inner">
          <Link
            href={PORTAL_HOME_PATH}
            className="photography-screen-portal-link"
          >
            {PORTAL_NAME}
          </Link>
          <span className="photography-screen-breadcrumb-sep" aria-hidden>
            /
          </span>
          <span className="photography-screen-breadcrumb-current">
            Photography
          </span>
        </div>
      </header>

      <main className="photography-screen-main">
        <div className="photography-screen-title-block">
          <h1 className="photography-screen-title">Photography</h1>
          <p className="photography-screen-description">
            {PHOTOGRAPHY_DESCRIPTION}
          </p>
        </div>

        <PhotographyContentGrid />
      </main>
    </div>
  );
}
