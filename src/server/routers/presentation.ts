import { prisma } from "server/prisma";
import { createTRPCRouter, publicProcedure } from "server/trpc";
import { z } from "zod";

export const presentationRouter = createTRPCRouter({
    //Listar a los usuarios con su sucursal adjunta
    findMany: publicProcedure.query(async () => {
      const presentations = await prisma.presentation.findMany();
      return presentations;
    }),
    createPresentation: publicProcedure.input(z.object({
      presentation: z.string(),      
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { presentation } = input;
        await ctx.prisma.presentation.create({          
          data: {                
              presentation: presentation,                             
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  });