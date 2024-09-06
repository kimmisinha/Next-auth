// import { NextMiddleware } from 'next-auth/middleware';

export { default } from "next-auth/middleware";

export const config: {
  matcher: string[];
} = {
  matcher: ["/dashboard"],
};
