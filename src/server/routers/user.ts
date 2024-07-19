import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { prisma } from 'server/prisma';
import { editUserBranchSchema, userBranchSchema } from 'utils/auth';

import { z } from 'zod';

export const userRouter = createTRPCRouter({
  //Listar a los usuarios con su sucursal adjunta
  findManyUserBranch: publicProcedure.query(async () => {
    const users = await prisma.user.findMany({
      select:{
        id:true,
        name:true,
        lastName:true,
        image:true,
        email:true,
        role:true,
        branchId:true,
        Branch:true
      },
      orderBy:{
        createdAt:'asc'
      }
    });
    return users;
  }),

  findOne: publicProcedure.input(z.string()).query(async ({ input }) => {
    const user = await prisma.user.findUnique({ where: { id: input } });
    return user;
  }),
  findCurrentOne: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({ where: { id: ctx.session.user.id } });
    return user;
  }),
  updateUser: protectedProcedure
    .input(editUserBranchSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.user.update({
          where: { id: input.id },
          data: {
            name: input.name,
            lastName: input.lastName,
            role:input.role,
            branchId:input.branchId      
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  deleteOne:  protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.user.delete({
        where: { id: input.id },
      });
      
    } catch (error) {
      console.log(error);
    }
  }),
});