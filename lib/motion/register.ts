"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

let registered = false;

export function registerMotion() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);
  CustomEase.create("current", "0.76, 0, 0.24, 1");
  CustomEase.create("expoOut", "0.16, 1, 0.3, 1");
  registered = true;
}

registerMotion();

export { gsap, ScrollTrigger };
