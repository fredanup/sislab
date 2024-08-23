import { prisma } from "../prisma";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { createExampleSchema } from "../../utils/auth";
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
        // Crear el nuevo registro en la tabla Example
        const example = await ctx.prisma.example.create({          
          data: {                
            productId: input.productId,                
            branchId: input.branchId,
            saleId: input.saleId,
            isAvailable: input.isAvailable,               
          },
        });
  
        // Verificar si ya existe un registro en Stock para este producto y sucursal
        const existingStock = await ctx.prisma.stock.findFirst({
          where: {
            productId: example.productId,
            branchId: example.branchId,
          },
        });
  
        if (existingStock) {
          // Si existe, incrementar el stock en 1
          await ctx.prisma.stock.update({
            where: {
              id: existingStock.id, // Asumiendo que 'id' es el identificador de la tabla 'Stock'
            },
            data: {
              stock: { increment: 1 },
            },
          });
        } else {
          // Si no existe, crear un nuevo registro de stock
          await ctx.prisma.stock.create({
            data: {
              stock: 1,
              branchId: example.branchId,
              productId: example.productId,
            },
          });
        }
  
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
        const example = await ctx.prisma.example.update({ 
          where: { id: exampleId }, // Usar exampleId para buscar el ejemplo
          data: {                
            saleId: saleId,
            isAvailable: false,               
          },
        });
         // Verificar si ya existe un registro en Stock para este producto y sucursal
         const existingStock = await ctx.prisma.stock.findFirst({
          where: {
            productId: example.productId,
            branchId: example.branchId,
          },
        });
  
        if (existingStock) {
          // Si existe, incrementar el stock en 1
          await ctx.prisma.stock.update({
            where: {
              id: existingStock.id, // Asumiendo que 'id' es el identificador de la tabla 'Stock'
            },
            data: {
              stock: { decrement: 1 },
            },
          });
        } 
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