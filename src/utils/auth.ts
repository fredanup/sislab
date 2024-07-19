import * as z from 'zod';

//Consulta utilizada para mostrar a los usuarios con sus sucursales
export const userBranchSchema = z.object({
    id:z.string(),
    name: z.string().nullable(),
    lastName: z.string().nullable(), 
    image: z.string().nullable(),
    email:z.string(),
    role: z.string().nullable(), 
    branchId:z.string().nullable(), 
    Branch: z.object({
      address:z.string().nullable()
    }).nullable()
  });

  export const editUserBranchSchema = z.object({
    id:z.string(),
    name: z.string().nullable(),
    lastName: z.string().nullable(),     
    role: z.string().nullable(), 
    branchId:z.string().nullable()
  });

  export const branchSchema = z.object({
    id:z.string(),
    name: z.string(),
    address: z.string().nullable(),     

  });

  export const laboratorySchema = z.object({
    id:z.string(),
    name: z.string(),
  });

  export const presentationSchema = z.object({
    id:z.string(),
    presentation: z.string(),
  });
  

  export const productSchema=z.object({
    id:z.string(),
    name: z.string(),
    quantity: z.string(),
    price:z.number(),
    laboratoryId:z.string().nullable(), 
    Laboratory: z.object({
      name:z.string().nullable()
    }).nullable(),
    presentationId:z.string().nullable(), 
    Presentation: z.object({
      presentation:z.string().nullable()
    }).nullable(),
    
  })

  export const createProductSchema = z.object({  
    name: z.string(),   
    quantity: z.string(),
    price:z.number(),
    laboratoryId:z.string().nullable(), 
    presentationId:z.string().nullable(), 
  });

  export const editProductSchema = createProductSchema.extend({
    id:z.string(),  
  });

  export const createExampleSchema = z.object({  
    productId: z.string(),   
    branchId: z.string(),
    saleId:z.string().nullable(),
    isAvailable:z.boolean(), 
    
  });

  export const createMovementSchema = z.object({  
    provenanceId:z.string().nullable(),
    destinationId:z.string().nullable(),
    exampleId:z.string().nullable()
  });


  export const movementDetailSchema=z.object({  
    id: z.string(),
    Product: z.object({
      name:z.string(),
      Laboratory: z.object({
        name:z.string()
      }).nullable(),
      Presentation: z.object({
        presentation:z.string()
      }).nullable(),
      quantity:z.string(),
      price:z.number(),      
    }),
    branchId: z.string(),
  });

  export const saleSchema=z.object({  
    buyerId: z.string(),
    discount: z.number(),
    finalPrice: z.number(),

  });

  export const saleSchemaDetail=z.object({  
    id:z.string(),
    buyerId: z.string(),
    discount: z.number(),
    finalPrice: z.number(),
    saleDate:z.date()
  });





  export type IUserBranch = z.infer<typeof userBranchSchema>;
  export type IEditUserBranch = z.infer<typeof editUserBranchSchema>;
  export type IBranch = z.infer<typeof branchSchema>;
  export type IProductDetail = z.infer<typeof productSchema>;
  export type ILaboratory = z.infer<typeof laboratorySchema>;
  export type IPresentation = z.infer<typeof presentationSchema>;
  export type IEditProduct = z.infer<typeof editProductSchema>;
  export type ICreateProduct = z.infer<typeof createProductSchema>;
  export type ICreateExample = z.infer<typeof createExampleSchema>;
  export type ICreateMovement = z.infer<typeof createMovementSchema>;
  export type IMovementDetail = z.infer<typeof movementDetailSchema>;
  export type ISale = z.infer<typeof saleSchema>;
  export type ISaleDetail = z.infer<typeof saleSchemaDetail>;
  