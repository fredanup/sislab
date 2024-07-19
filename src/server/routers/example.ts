import { prisma } from "server/prisma";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "server/trpc";
import { createExampleSchema, createProductSchema, editProductSchema, productSchema } from "utils/auth";
import { z } from "zod";

export const exampleRouter = createTRPCRouter({
    //Obtener todos los ejemplares de la sucursal del usuario actual
    findUserExamples: publicProcedure.input(z.string()).query(async ({input}) => {      
      const examples = await prisma.example.findMany({
        where:{
          branchId:input,
          isAvailable:true
        },
        select: {
          id: true,
          isAvailable: true,
          Product: {
            select: {
              name: true,
              Laboratory: {
                select: {
                  name: true,
                }
              },
              Presentation: {
                select: {
                  presentation: true
                }
              },
              quantity: true,
              price: true
            }
          },
          branchId:true
        },
       
      });
      return examples;
    }),
  
    findOne: publicProcedure.input(z.string()).query(async ({ input }) => {
      const example = await prisma.example.findUnique({ where: { id: input } });
      return example;
    }),

    createExample: protectedProcedure
    .input(createExampleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.example.create({          
          data: {                
              productId: input.productId,                
              branchId: input.branchId,
              saleId:input.saleId,
              isAvailable:input.isAvailable,               
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

    updateExample: protectedProcedure
    .input(z.object({
      saleId: z.string(),
      exampleId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { saleId, exampleId } = input; // Destructurar los valores de entrada
        await ctx.prisma.example.update({ 
          where: { id: exampleId }, // Usar exampleId para buscar el ejemplo
          data: {                
            saleId: saleId,
            isAvailable: false,               
          },
        });
      } catch (error) {
        console.error(error);
      }
    }),

    findSoldExamples: publicProcedure.input(z.string()).query(async ({input}) => {      
      const examples = await prisma.example.findMany({
        where:{
          saleId:input,          
        },
        select: {
          id: true,          
          Product: {
            select: {
              name: true,
              Laboratory: {
                select: {
                  name: true,
                }
              },
              Presentation: {
                select: {
                  presentation: true
                }
              },
              quantity: true,
              price: true
            }
          },
          
        },
       
      });
      return examples;
    }),
  

  });