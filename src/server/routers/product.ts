import { prisma } from "server/prisma";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "server/trpc";
import { createProductSchema, editProductSchema, productSchema } from "utils/auth";
import { z } from "zod";

export const productRouter = createTRPCRouter({
    //Listar a los usuarios con su sucursal adjunta
    findManyProduct: publicProcedure.query(async () => {
      const products = await prisma.product.findMany({
        select:{
          id:true,
          name:true,
          quantity:true,
          price:true,
          laboratoryId:true,
          Laboratory:true,
          presentationId:true,
          Presentation:true
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