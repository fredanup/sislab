import { prisma } from "../prisma";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { createProductSchema, editProductSchema } from "../../utils/auth";
import { z } from "zod";

export const productRouter = createTRPCRouter({
    //Listar a los usuarios con el stock de la sucursal del usuario actual
    findManyProduct: protectedProcedure.query(async ({ctx}) => {
      if (!ctx.session?.user?.id) {
        throw new Error('Not authenticated');
      }
      const user = await prisma.user.findUnique({ where: { id: ctx.session.user.id } });
      if (!user) {
        throw new Error('User not found');
      }
      
      const products = await ctx.prisma.product.findMany({
        select:{
          id:true,
          name:true,
          quantity:true,
          price:true,
          laboratoryId:true,
          Laboratory:true,
          presentationId:true,
          Presentation:true,
          Stocks: {
            select: {
              stock:true,   
                      
            },
            where: {
              branchId:user.branchId
            }
          }
        },
    
      });
      return products;
    }),
  
    findOne: publicProcedure.input(z.string()).query(async ({ input }) => {
      const product = await prisma.product.findUnique({ where: { id: input } });
      return product;
    }),

    createProduct: protectedProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.product.create({          
          data: {                
              name: input.name,                
              quantity: input.quantity,
              price:input.price,
              laboratoryId:input.laboratoryId, 
              presentationId:input.presentationId,   
              
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

    updateProduct: protectedProcedure
      .input(editProductSchema)
      .mutation(async ({ ctx, input }) => {
        try {
          await ctx.prisma.product.update({
            where: { id: input.id },
            data: {                
                name: input.name,                
                quantity: input.quantity,
                price:input.price,
                laboratoryId:input.laboratoryId, 
                presentationId:input.presentationId,   
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
        await ctx.prisma.product.delete({
          where: { id: input.id },
        });
        
      } catch (error) {
        console.log(error);
      }
    }),
  });