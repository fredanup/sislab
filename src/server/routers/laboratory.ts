import { prisma } from "../prisma";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const laboratoryRouter = createTRPCRouter({
    //Listar a los usuarios con su sucursal adjunta
    findMany: publicProcedure.query(async () => {
      const laboratories = await prisma.laboratory.findMany();
      return laboratories;
    }),
    createLab: publicProcedure.input(z.object({
      name: z.string(),      
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { name } = input;
        await ctx.prisma.laboratory.create({          
          data: {                
              name: name,                             
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  });