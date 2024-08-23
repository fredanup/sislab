import { prisma } from "../prisma";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { createMovementSchema } from "../../utils/auth";
import { z } from "zod";

export const movementRouter = createTRPCRouter({
    //Obtener todos los ejemplares de la sucursal del usuario actual
    findMovements: publicProcedure.input(z.string()).query(async () => {      
      const movements = await prisma.movement.findMany();
      return movements;
    }),
  
    findOne: publicProcedure.input(z.string()).query(async ({ input }) => {
      const movement = await prisma.movement.findUnique({ where: { id: input } });
      return movement;
    }),

    createOutputMovement: protectedProcedure
    .input(createMovementSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.movement.create({          
          data: {                
            moveType: 'salida',               
            moveStatus: 'pendiente', 
            provenanceId:input.provenanceId,
            destinationId:input.destinationId,
            exampleId:input.exampleId,                    
          },
        });
        // Actualización de la tabla example
        const example=await prisma.example.update({
          where: { id: input.exampleId! },
          data: { isAvailable: false },
        });
         // Verificar si ya existe un registro en Stock para este producto y sucursal
         const existingStock = await ctx.prisma.stock.findFirst({
          where: {
            productId: example.productId,
            branchId: example.branchId,
          },
        });
        if (existingStock) {
          // Si existe, disminuir el stock en 1
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
        console.log(error);
      }
    }),

    createIncomeMovement: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
       
        const movement=await prisma.movement.findFirst({ where: { exampleId: input } });
        if(movement){

          const example=await prisma.example.findFirst({ where: { id: input, isAvailable:false} });
          if(example){
            await ctx.prisma.movement.create({          
              data: {                
                moveType: 'ingreso',               
                moveStatus: 'completo', 
                provenanceId:null,
                destinationId:null,
                exampleId:input,                    
              },
            });
            // Actualización de la tabla example
            const example=await prisma.example.update({
              where: { id: input },
              data: { isAvailable: true, branchId:movement.destinationId! },
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
          }
         
        }
   
      } catch (error) {
        console.log(error);
      }
    }),

 

  });