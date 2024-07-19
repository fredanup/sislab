/**
 * This file contains the root router of your tRPC-backend
 */
import {createTRPCRouter, publicProcedure } from '../trpc';
import { observable } from '@trpc/server/observable';
import { clearInterval } from 'timers';
import { userRouter } from './user';
import { branchRouter } from './branch';
import { laboratoryRouter } from './laboratory';
import { presentationRouter } from './presentation';
import { productRouter } from './product';
import { exampleRouter } from './example';
import { movementRouter } from './movement';
import { saleRouter } from './sale';
import { postRouter } from './post';

export const appRouter = createTRPCRouter({
  healthcheck: publicProcedure.query(() => 'yay!'),
  user: userRouter,
  branch: branchRouter,
  laboratory:laboratoryRouter,
  presentation:presentationRouter,
  product:productRouter,
  example:exampleRouter,
  movement:movementRouter,
  sale:saleRouter,
  post:postRouter,
  randomNumber: publicProcedure.subscription(() => {
    return observable<number>((emit) => {
      const int = setInterval(() => {
        emit.next(Math.random());
      }, 500);
      return () => {
        clearInterval(int);
      };
    });
  }),
});

export type AppRouter = typeof appRouter;
