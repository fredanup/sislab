import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { prisma } from 'server/prisma';


export const branchRouter = createTRPCRouter({
  //Listar a los usuarios con su sucursal adjunta
  findMany: publicProcedure.query(async () => {
    const branchs = await prisma.branch.findMany();
    return branchs;
  }),
  createBranch: publicProcedure.input(z.object({
    name: z.string(),
    address: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    try {
      const { name, address } = input;
      await ctx.prisma.branch.create({          
        data: {                
            name: name,        
            address: address             
        },
      });
    } catch (error) {
      console.log(error);
    }
  }),



});