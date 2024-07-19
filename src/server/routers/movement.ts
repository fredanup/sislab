import { prisma } from "server/prisma";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "server/trpc";
import { createExampleSchema, createMovementSchema, createProductSchema, editProductSchema, productSchema } from "utils/auth";
import { z } from "zod";

export const movementRouter = createTRPCRouter({
    //Obtener todos los ejemplares de la sucursal del usuario actual
    findMovements: publicProcedure.input(z.string()).query(async ({input}) => {      
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
        await prisma.example.update({
          where: { id: input.exampleId! },
          data: { isAvailable: false },
        });
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
            await prisma.example.update({
              where: { id: input },
              data: { isAvailable: true, branchId:movement.destinationId! },
            });
          }
         
        }
   
      } catch (error) {
        console.log(error);
      }
    }),

 

  });