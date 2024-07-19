import { prisma } from "server/prisma";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "server/trpc";
import {  saleSchema } from "utils/auth";

export const saleRouter = createTRPCRouter({
  findUserSales: protectedProcedure.query(async ({ctx}) => {
    const sales = await prisma.sale.findMany({
      select:{
        id:true,
        buyerId:true,
        discount:true,
        finalPrice:true,
        saleDate:true,
       
      },
      orderBy:{
        saleDate:'asc'
      },
      where:{
        userId:ctx.session.user.id
      }
    });
    return sales;
  }),
  createSale: protectedProcedure
    .input(saleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const newSale = await ctx.prisma.sale.create({
          data: {
            buyerId: input.buyerId,
            discount: input.discount,
            finalPrice: input.finalPrice,
            userId:ctx.session.user.id
          },
        });

        return newSale; // Devolver el objeto de venta creado
      } catch (error) {
        console.error('Error creating sale:', error);
        throw new Error('Failed to create sale');
      }
    }),
});

