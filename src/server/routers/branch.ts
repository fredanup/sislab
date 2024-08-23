import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { prisma } from '../prisma';


export const branchRouter = createTRPCRouter({
  //Listar a los usuarios con su sucursal adjunta
  findMany: publicProcedure.query(async () => {
    const branchs = await prisma.branch.findMany();
    return branchs;
  }),
  findOtherBranches: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user?.id) {
      throw new Error('Not authenticated');
    }
  
    const user = await ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } });
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.branchId) {
      throw new Error('User not has a branch yet');
    }
  
    const branches = await ctx.prisma.branch.findMany({
      where: {
        id: {
          not: user.branchId, // Excluir la sucursal del usuario actual
        },
      },
    });
  
    return branches;
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